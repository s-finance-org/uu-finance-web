import BN from 'bignumber.js'
import { reactive } from 'vue'

import abi from './abi'

import { ModelToken, ModelValueEther, ModelValueAddress, ModelValueUint8 } from '../../../models'
import { getDotenvAddress, listenEvent } from '../../helpers/methods'
import tokenAddresses from '../token-addresses'

import multicall from '../../swaps/multicall'
import storeWallet from '../../wallet'
import notify from '../../notify'
import i18n from '../../../i18n'


export default ModelToken.create({
  code: 'UU',
  address: getDotenvAddress('UU_TOKEN'),
  abi,
  isInfiniteAllowance: true,
  // TODO: 要追加而不是覆盖（有默认的）
  customAssociatedTokenModel (_token, __root__) {
    // TODO: 这里不是 __root__
    // TODO: 可能 SFG 会没有精度初始完毕就显示
    const parameters = _token.parameters || {
      decimals: ModelValueUint8.create().setValue(18),
    }
    const __root__parameters = __root__.parameters

    const result = {
      // 待领取奖励数
      claimableReward: ModelValueEther.create({
        ...parameters,
        trigger () {
          result.totalReward.referrer()
        }
      }),
      // 已领取奖励数
      claimedReward: ModelValueEther.create({
        ...parameters,
        trigger () {
          result.totalReward.referrer()
        }
      }),
      // 合计奖励数
      totalReward: ModelValueEther.create({
        ...parameters,
        referrer () {
          const { state } = this
          const { claimableReward, claimedReward } = result

          // claimableReward、claimedReward 相加的值
          claimableReward.state.updated && claimedReward.state.updated
            ? this.setValue(BN(result.claimableReward.ether).plus(result.claimedReward.ether).toString())
            : state.beforeUpdate()
        }
      }),

      // 铸造 UU 可获得的量（由不同 token address 区分）
      mintGainAmount: ModelValueEther.create(__root__parameters),
      // 取回将销毁 UU 的量（由不同 token address 区分）
      burnGainAmount: ModelValueEther.create(__root__parameters),

      // lpt 净值
      netValue: ModelValueEther.create(__root__parameters),
      // lpt 总净值
      totalNetValue: ModelValueEther.create(__root__parameters),


      // TODO: temp lpt 对应的奖励 token
      rewardNum: 0,
      // 临时同步方法
      rewardAddresses: reactive([
        ModelValueAddress.create()
      ]),
      // TODO: 目前只用在反计算的可销毁最大的
      // maxBurnBalanceOf: ModelValueWallet.create(parameters),
    }

    return result
  }
}).extend(function (__root__) {
  /**
   * UU 总净值
   * - DAI 计价
   * @type {Object}
   */
  __root__.totalNetValue = ModelValueEther
    .create(__root__.parameters)
    .init(function () {
      const { address, contract } = __root__

      multicall.series([
        { call: [address, contract.methods.totalNetValue().encodeABI()], target: this }
      ])
    })

  /**
   * UP 价格
   * - 如果使用 UU 的数量,价格用 1
   * - 如果使用 UP 的数量,价格用 calcPrice
   * @type {Object}
   */
  __root__.UPPrice = ModelValueEther
    .create(__root__.parameters)
    .init(function () {
      const { address, contract } = __root__

      multicall.series([
        { call: [address, contract.methods.calcPrice().encodeABI()], target: this }
      ])
    })






// const Modeladdad = {
  
// }

//   __root__.supportedLpts = []

//   __root__.supportedLpts.add({
//     address: ''
//   })
  


  /**
   * 支持的 lpt 地址
   * @type {Array}
   */
  // TODO: 遍历 lpts()
  __root__.supportedLptAddresses = []

  /**
   * 支持的 lpt 数量
   * - supportedLptNum -> supportedLptAddresses
   * @type {Object}
   */
  __root__.supportedLptNum = ModelValueEther
    .create({
      async trigger () {
        const { handled } = this
        const { contract, address } = __root__

        // TODO: 
        const series = []

        for (let i = 0; i < +handled; i++ ) {
          const _address = ModelValueAddress.create({
            async trigger () {
              const { handled } = this
              // XXX: 目前无法得知 lpt 对应多少奖励币种
              // TODO: 应该先知道 lpt 对应哪些奖励 token
            //  TODO: 目前两个池子都只有一个奖励
                __root__.settleableReward(tokenAddresses[handled], 0)

              // XXX: 如果没有在 tokenAddresses 内的，则应该自动创建
              // TODO: 考虑如何 multi
              // TODO: 这里是 lpt 在 UU 内的，而不是 lpt 自身
                __root__.lptBalance(tokenAddresses[handled])
            }
          })
          __root__.supportedLptAddresses[i] = _address

          __root__.getLptAddress(i)
        }
      }
    })
    .init(function () {
      const { address, contract } = __root__

      multicall.series([
        { call: [address, contract.methods.lptN().encodeABI()], target: this }
      ])
    })

  /**
   * 支持的奖励 token 地址
   */
  // TODO: rewards()
  // TODO: temp
  // TODO: 过渡品
  __root__.supportedRewardAddresses = []

  /**
   * 支持奖励 token 的数量
   * - supportedRewardNum -> supportedRewardAddresses
   * @type {Object}
   */
  __root__.supportedRewardNum = ModelValueEther
    .create({
      async trigger () {
        const { handled } = this
        const { contract, address } = __root__

        const series = []

        for (let i = 0; i < +handled; i++ ) {
          const _address = ModelValueAddress.create({
            async trigger () {
              const { handled } = this

              // XXX: 如果没有在 tokenAddresses 内的，则应该自动创建
              // TODO: 考虑如何 multi
              await __root__.claimableReward(tokenAddresses[handled])
              await __root__.claimedReward(tokenAddresses[handled])
            }
          })
          __root__.supportedRewardAddresses[i] = _address
          // TODO: 枚举所有奖励地址合约地址
          // TODO: 支持调用、multi
          series.push({
            call: [
              address,
              contract.methods.rewards(i).encodeABI()
            ],
            target: __root__.supportedRewardAddresses[i]
          })
        }

        await multicall.series(series)
      }
    })
    .init(function () {
      const { address, contract } = __root__

      multicall.series([
        { call: [address, contract.methods.rewardN().encodeABI()], target: this }
      ])
    })



  /**
   * TODO: 
   * lpt 铸造 UU
   * - 自带授权
   * @param {Object} _token
   */
  this.mint = async _token => {
    const { contract, address, state } = this
    const walletAddress = storeWallet.address.handled

    // 校验授权（预防）
    await _token.approve(address)

    // 限制当前提交待确认的交易只有一份
    state.beforeUpdate()

    const { update, dismiss } = notify.notification({ message: i18n.$i18n.global.t('global.msg.mintingUU') })
    // TODO: 是否有必要
    // update mintGainAmount
    this.getLpt2UUVol(_token)

    const sendOpts = {
      from: walletAddress,
    }

    const _method = await contract.methods.mint(
      _token.address,
      _token.amount.ether,
      this.getAssociatedToken(_token).mintGainAmount.ether
    )

    try {
      sendOpts.gas = await _method.estimateGas({
        from: walletAddress,
      })
    } catch (err) {
      console.error(err)
    }

    return _method.send(sendOpts)
      .once('transactionHash', transactionHash => {
        notify.handler(transactionHash)

        // TODO: 这里还有个 UpdatePrice event
        listenEvent({
          name: 'Transfer',
          contract,
          transactionHash
        }).then(data => {
          /* data
            {
              returnValues: {
                from: "0x"
                to: "0x"
                value: "0"
              }
            }
          */
          const { returnValues } = data
          const filter = returnValues.to === walletAddress

          if (!filter) return false

          dismiss() // 销毁
          state.afterUpdate()

          // sync
          _token.walletBalanceOf.trigger()
        }).catch(err => {
          dismiss() // 销毁
          state.afterUpdate()
        })
      })
      .catch(err =>{
        console.error(err)
        dismiss()

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      })
  }

  /**
   * lpt 可铸造的 UU 量
   * @param {Object} _token
   */
  __root__.getLpt2UUVol = function (_token) {
    const { address, contract } = this
    const result = __root__.getAssociatedToken(_token)

    // update
    result.mintGainAmount.state.beforeUpdate()
    multicall.series([
      { call: [address, contract.methods.lpt2uu(_token.address, _token.amount.ether).encodeABI()], target: result.mintGainAmount }
    ])
  }

  /**
   * 销毁 uu 获得 lpt 数量
   * @param {Object} _token
   */
  __root__.getUU2LptVol = function (_token) {
    const { address, contract } = this
    const result = __root__.getAssociatedToken(_token)

    // update
    result.burnGainAmount.state.beforeUpdate()
    // TODO: 不能超过 lpt 余额
    // const lptBalance = await contract.methods.lptBalance(_token.address).call()
    multicall.series([
      { call: [address, contract.methods.uu2lpt(_token.amount.ether, _token.address).encodeABI()], target: result.burnGainAmount }
    ])
  }

  /**
   * lpt 净值
   * - DAI 计价
   * @param {Object} _token
   * @return {Promise}
   */
  // TODO: vol?
  __root__.getLptNetValue = async function (_token, vol) {
    const { address, contract } = this
    const result = __root__.getAssociatedToken(_token)

    // update
    result.netValue.state.beforeUpdate()
    multicall.series([
      { call: [address, contract.methods.netvalue(_token.address, vol).encodeABI()], target: result.netValue }
    ])
  }

  /**
   * lpt 总净值
   * - DAI 计价
   * @param {Object} token
   * @return {Promise}
   */
  __root__.getLptTotalNetValue = function (_token) {
    const { address, contract } = this
    const result = __root__.getAssociatedToken(_token)

    // update
    result.totalNetValue.state.beforeUpdate()
    multicall.series([
      { call: [address, contract.methods.netvalue(_token.address).encodeABI()], target: result.totalNetValue }
    ])
  }


/**
 * lpt 相对 UU 的价格
 * @param {Object} _token
 * @return {Promise}
 */
__root__.getLptPrice = async function (_token) {
  const { contract } = this
  // const associatedToken = __root__.getAssociatedToken(_token)

  // TODO: multi



  // associatedToken.burnGainAmount.state.beforeUpdate()
  // TODO: 计价币单位？
  // const result = associatedToken.burnGainAmount.ether = 
  // TODO: 在 multi 未使用之前暂不使用
  // const lptBalance = await contract.methods.lptBalance(_token.address).call()

  // // TODO: why?

  return await contract.methods.lptPrice(_token.address).call()
}

/**
 * 领取全部奖励
 * - 钱包地址
 * TODO:
 */
__root__.claimAllRewards = async () => {
  const { contract, state } = this
  const walletAddress = storeWallet.address.handled

  // 限制当前提交待确认的交易只有一份
  state.beforeUpdate()
  // TODO: 暂缓存，但应该在内部自带
  const rewardAssociatedTokens = {}
  __root__.supportedRewardAddresses.forEach(_address => {
    // TODO: 这时候应该都有了
    const associatedToken = __root__.getAssociatedToken({ address: _address.handled })

    // 更新每个的状态
    associatedToken.state.beforeUpdate()
    rewardAssociatedTokens[_address.handled] = associatedToken
  })

  const { update, dismiss } = notify.notification({ message: i18n.$i18n.global.t('global.msg.collectingAllRewards') })

  const sendOpts = {
    from: walletAddress,
  }

  const _method = await contract.methods.claim()

  try {
    sendOpts.gas = await _method.estimateGas({
      from: walletAddress,
    })
  } catch (err) {
    console.error(err)
  }

  return _method.send(sendOpts)
    .once('transactionHash', transactionHash => {
      notify.handler(transactionHash) // 改为 hash

      // 有几个奖励，就会触发几次奖励的 event
      listenEvent({
        name: 'ClaimTo',
        contract,
        transactionHash,
        success (data) {
          const { returnValues } = data
          const filter = returnValues.agent === walletAddress

          if (!filter) return false

          // TODO: 重复、繁琐
          // TODO: 考虑从 reward 定位，vol 是当前领取的量
          const _token = tokenAddresses[returnValues.reward]
          // TODO: 如此更新繁琐
          rewardAssociatedTokens[returnValues.reward].state.afterUpdate() // btn 状态
          // TODO: multi？
          __root__.claimableReward({ address: returnValues.reward })
          __root__.claimedReward({ address: returnValues.reward })
        }
      }).then(data => {
        /* data
          {
            returnValues: {
              agent: "0x"
              reward: "0x"
              tip: "0"
              to: "0x"
              vol: "3"
            }
          }
        */
        const { returnValues } = data
        const filter = returnValues.agent === walletAddress

        if (!filter) return false

        // 当前已触发完毕，流程中针对每个奖励的更新不含在当前范围内
        dismiss() // 销毁
        state.afterUpdate()
      }).catch(err => {
        dismiss() // 销毁

        // TODO: 重复、繁琐
        Object.values(rewardAssociatedTokens).forEach(associatedToken => {
          associatedToken.state.afterUpdate()
        })
        state.afterUpdate()
      })
    })
    .catch(err => {
      console.log(err)
      dismiss() // 销毁

      notify.updateError({
        update,
        code: err.code,
        message: err.message
      })

      // TODO: 重复、繁琐
      Object.values(rewardAssociatedTokens).forEach(associatedToken => {
        associatedToken.state.afterUpdate()
      })
      state.afterUpdate()
    })
}

/**
 * 领取奖励
 * - 钱包地址
 * #TODO: 与 claimRewards 类似，可合成一个
 */
__root__.claimReward = async (_token) => {
  const { address, contract, state } = this
  const walletAddress = storeWallet.address.handled

  const associatedToken = __root__.getAssociatedToken(_token)

  // 限制当前提交待确认的交易只有一份
  associatedToken.state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: i18n.$i18n.global.t('global.msg.collectingReward', [_token.code]) })

  const sendOpts = {
    from: walletAddress,
  }

  const _method = await contract.methods.claim(_token.address)

  try {
    sendOpts.gas = await _method.estimateGas({
      from: walletAddress,
    })
  } catch(err) {
    console.error(err)
  }

    return _method.send(sendOpts)
      .once('transactionHash', transactionHash => {
        notify.handler(transactionHash)

        listenEvent({
          name: 'ClaimTo',
          contract,
          transactionHash
        }).then(data => {
          /* data
            {
              returnValues: {
                agent: "0x"
                reward: "0x"
                tip: "0"
                to: "0x"
                vol: "1110"
              }
            }
          */
          const { returnValues } = data
          const filter = returnValues.agent === walletAddress

          if (!filter) return false

          dismiss() // 销毁
          associatedToken.state.afterUpdate()

          // sync
          // TODO: multi
          // TODO: 考虑从 reward 定位，但 vol 针对的是什么量还未知，看文档
          __root__.claimableReward(_token)
          __root__.claimedReward(_token)
        }).catch(err => {
          dismiss() // 销毁

          associatedToken.state.afterUpdate()
        })
    
      }).catch(err => {
        dismiss() // 销毁

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        associatedToken.state.afterUpdate()
      })
}

  /**
   * 查询待领取奖励数
   * - 钱包地址
   * @param {Object} _token 奖励代币对象
   */
  __root__.claimableReward = async function (_token) {
    const { address, contract } = this
    const result = this.getAssociatedToken(_token)

    if (!storeWallet.isValidated) return false

    // update
    result.claimableReward.state.beforeUpdate()
    multicall.series([
      { call: [address, contract.methods.claimable(storeWallet.address.handled, _token.address).encodeABI()], target: result.claimableReward }
    ])
  }

  /**
   * 查询已领取奖励数
   * - 钱包地址
   * @param {Object} _token 奖励代币对象
   */
  __root__.claimedReward = async function (_token) {
    const { address, contract } = this
    const result = this.getAssociatedToken(_token)

    if (!storeWallet.isValidated) return false

    // update
    result.claimedReward.state.beforeUpdate()
    multicall.series([
      { call: [address, contract.methods.claimed(storeWallet.address.handled, _token.address).encodeABI()], target: result.claimedReward }
    ])
  }

/**
  * 获取待结算奖励数
  * - 查询用户在某矿池中可以领取的奖励
  * @param {Object} _lpt 奖励代币对象
  * @param {number} idx 奖励代币内的奖励 token 索引
  */
 __root__.settleableReward = async function (_lpt, idx) {
  // TODO: 应该自动批量处理
  const { address, contract } = this

  const associatedToken = this.getAssociatedToken(_lpt)
  /* data
    reward: _token.address, // address 该奖励的 token address，异常时返回 0x0000000000000000000000000000000000000000
    vol: 0, // uint256 挖矿奖励数量
    tip: 0, // uint256 结算小费，与 vol 比例为 99:1
   */
  const { vol, tip, reward } = await contract.methods.settleable(_lpt.address, idx).call()

  // TODO:
  const lpt__ = associatedToken.rewardAddresses[idx] = ModelValueAddress.create().setValue(reward)

  // 在 lpt 下的
  // TODO: 这里得先确定 tokenAddresses 内有奖励 token
  const result = _lpt.getAssociatedToken(tokenAddresses[reward])

  result.miningPendingRewards.ether = vol
  result.settleableReward.ether = tip
}

/**
 * 参与流动性池代币结算
 * - 钱包地址
 * @param {number} idx 在 supportedLptAddresses 内的索引
 */
// TODO: 
__root__.settleReward = async function (lptAddress, idx, _itemToken) {
  const { contract, state } = this
  const _lpt = tokenAddresses[lptAddress]
  const walletAddress = storeWallet.address.handled
  // TODO: ?
  const associatedToken = _lpt.getAssociatedToken(_itemToken)


  // 限制当前提交待确认的交易只有一份
  associatedToken.state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: i18n.$i18n.global.t('global.msg.claimingSettlement') })

    const sendOpts = {
      from: walletAddress,
    }

    const _method = await contract.methods.settle(lptAddress, idx)

    try {
      sendOpts.gas = await _method.estimateGas({
        from: walletAddress,
      })
    } catch(err) {
      console.error(err)
    }

  return _method.send(sendOpts)
    .once('transactionHash', transactionHash => {
      notify.handler(transactionHash)

      listenEvent({
        name: 'Settle',
        contract,
        transactionHash
      }).then(data => {
        /* data
          {
            returnValues: {
              agent: "0x"
              gauge: "0x"
              reward: "0x"
              tip: "0"
              vol: "0
            }
          }
        */
        const { returnValues } = data
        const filter = returnValues.agent === walletAddress

        if (!filter) return false

        dismiss() // 销毁
        associatedToken.state.afterUpdate()

        // sync
        __root__.settleableReward(_lpt, idx)
      }).catch(err => {
        dismiss() // 销毁
        associatedToken.state.afterUpdate()
      })
    })
    .catch(err =>{
console.error(err)

      notify.updateError({
        update,
        code: err.code,
        message: err.message
      })

      associatedToken.state.afterUpdate()
    })
}

  /**
   * 获取 UU 内支持的 lpt adress
   * @param {number} idx
   */
  __root__.getLptAddress = function (idx) {
    const { address, contract } = this

    // TODO: beforeUpdate
    multicall.series([
      { call: [address, contract.methods.lpts(idx).encodeABI()], target: __root__.supportedLptAddresses[idx] }
    ])
  }

  /**
    * 获取 lpt 在 UU 池中的数量
    * - 更新 associatedTokens[].balance
    * @param {Object} _token
    */
  __root__.lptBalance = async function (_token) {
    const { address, contract } = this
    const result = this.getAssociatedToken(_token)

    // update
    result.balance.state.beforeUpdate()
    multicall.series([
      { call: [address, contract.methods.lptBalance(_token.address).encodeABI()], target: result.balance }
    ])
  }

/**
  * lpt 销毁 UU
  * TODO:
  * @param {Object} _token
  */
__root__.burn = async function (_token) {
  const { contract, address, state } = this
  const walletAddress = storeWallet.address.handled

  // 限制当前提交待确认的交易只有一份
  state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: i18n.$i18n.global.t('global.msg.burningUU') })

  // update burnGainAmount
  this.getUU2LptVol(_token)

  const sendOpts = {
    from: walletAddress,
  }

  const method = await contract.methods.burn(
    _token.amount.ether,
    _token.address,
    this.getAssociatedToken(_token).burnGainAmount.ether
  )

  try {
    sendOpts.gas = await method.estimateGas({
      from: walletAddress,
    })
  } catch(err) {
    console.error(err)
  }

  return new Promise((resolve, reject) => {
    method.send(sendOpts)
    .once('transactionHash', transactionHash => {
      notify.handler(transactionHash)

      // TODO: 这里还有个 UpdatePrice event
      listenEvent({
        name: 'Transfer',
        contract,
        transactionHash
      }).then(data => {
        /* data
          {
            returnValues: {
              from: "0x"
              to: "0x"
              value: "0"
            }
          }
        */
        const { returnValues } = data
        const filter = returnValues.from === walletAddress

        if (!filter) return false
        dismiss() // 销毁
        state.afterUpdate()
        

        // sync
        // TODO: 不要这么传
        resolve()
      }).catch(err => {
        dismiss() // 销毁
        reject()
        state.afterUpdate()
      })
    })
    .catch(err =>{
      console.error(err)
      
      dismiss() // 销毁
      reject()
      notify.updateError({
        update,
        code: err.code,
        message: err.message
      })

      state.afterUpdate()
    })
  })
  
}
})
