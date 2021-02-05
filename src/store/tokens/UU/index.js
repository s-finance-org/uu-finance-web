import BN from 'bignumber.js'
import { reactive } from 'vue'

import abi from './abi'

import { ModelToken, ModelValueEther, ModelValueAddress, ModelValueUint8 } from '../../../models'
import { getDotenvAddress, listenEvent } from '../../helpers/methods'
import tokenAddresses from '../token-addresses'

import swaps from '../../swaps'
import storeWallet from '../../wallet'
import notify from '../../notify'
import i18n from '../../../i18n'

export default (ModelToken.create({
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

    return {
      // 待领取奖励数
      claimableReward: ModelValueEther.create(parameters),
      // 已领取奖励数
      claimedReward: ModelValueEther.create(parameters),
      // 合计奖励数
      totalReward: ModelValueEther.create(parameters),

      // 铸造 UU 可获得的量（由不同 token address 区分）
      mintGainAmount: ModelValueEther.create(__root__parameters),
      // 取回将销毁 UU 的量（由不同 token address 区分）
      burnGainAmount: ModelValueEther.create(__root__parameters),




      // TODO: temp lpt 对应的奖励 token
      rewardNum: 0,
      // 临时同步方法
      rewardAddresses: reactive([
        ModelValueAddress.create()
      ]),
      // TODO: 目前只用在反计算的可销毁最大的
      // maxBurnBalanceOf: ModelValueWallet.create(parameters),
    }
  }
}).extend(function (__root__) {
  // 只用于 init()
  const { address, contract } = __root__

  /**
   * 总净值
   * - DAI 计价
   * @type {Object}
   */
  __root__.totalNetValue = ModelValueEther
    .create(__root__.parameters)
    .init(function () {
      swaps.multicall.series([
        { call: [address, contract.methods.totalNetValue().encodeABI()], target: this }
      ])
    })





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

        for (let i =0; i < +handled; i++ ) {
          const _address = ModelValueAddress.create({
            async trigger () {
              const { handled } = this
              // XXX: 目前无法得知 lpt 对应多少奖励币种
              // TODO: temp
              // TODO: 应该先知道 lpt 对应哪些奖励 token
            //  TODO: 目前两个池子都只有一个奖励
                await __root__.settleableReward(tokenAddresses[handled], 0)
                // await __root__.settleableReward(tokenAddresses[handled], 1) // 0x0000000000000000000000000000000000000000
                // await __root__.settleableReward(tokenAddresses[handled], 2)
              
              // XXX: 如果没有在 tokenAddresses 内的，则应该自动创建
              // TODO: 考虑如何 multi
              // await __root__.settleableReward(tokenAddresses[handled], i)
                __root__.lptBalance(tokenAddresses[handled])
            }
          })
          __root__.supportedLptAddresses[i] = _address

          series.push({
            call: [
              address,
              contract.methods.lpts(i).encodeABI()
            ],
            target: __root__.supportedLptAddresses[i]
          })
        }

        swaps.multicall.series(series)
      }
    })
    .init(function () {
      swaps.multicall.series([
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
   * 支持的奖励 token 数量
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

          series.push({
            call: [
              address,
              contract.methods.rewards(i).encodeABI()
            ],
            target: __root__.supportedRewardAddresses[i]
          })
        }

        await swaps.multicall.series(series)
      }
    })
    .init(function () {
      swaps.multicall.series([
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
    await this.getLpt2UUVol(_token)

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
  __root__.getLpt2UUVol = async function (_token) {
    const { contract } = this
    const result = __root__.getAssociatedToken(_token)

    // update
    result.mintGainAmount.state.beforeUpdate()
    // 当短时间内持续查询，会出现异步造成的数据排序混乱（2次请求先获得2再1）
    swaps.multicall.series([
      { call: [address, contract.methods.lpt2uu(_token.address, _token.amount.ether).encodeABI()], target: result.mintGainAmount }
    ])
  }

/**
 * 取回 lpt 将销毁 UU 的量
 * @param {Object} _token
 * @return {Promise}
 */
__root__.getUU2LptVol = async function (_token) {
  const { contract } = this
  const associatedToken = __root__.getAssociatedToken(_token)

  // TODO: multi
  associatedToken.burnGainAmount.state.beforeUpdate()
  const result = associatedToken.burnGainAmount.ether = await contract.methods.uu2lpt(_token.amount.ether, _token.address).call()
  // TODO: 在 multi 未使用之前暂不使用
  // const lptBalance = await contract.methods.lptBalance(_token.address).call()

  // // TODO: why?

  return result
}

/**
 * 获取 lpt 价格
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
  const { contract, state } = __root__
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
 * TODO: 与 claimRewards 类似，可合成一个
 */
__root__.claimReward = async (_token) => {
  const { contract, state } = __root__
  const walletAddress = storeWallet.address.handled

  const associatedToken = __root__.getAssociatedToken(_token)
  console.log('11111')
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
  * 获取待领取奖励数
  * - 钱包地址
  * @param {Object} _token 奖励代币对象
  */
__root__.claimableReward = async function (_token) {
  // TODO: 应该自动批量处理
  const { contract } = this
  const result = this.getAssociatedToken(_token)

  // update
  result.claimableReward.state.beforeUpdate()
  result.claimableReward.ether = await contract.methods.claimable(storeWallet.address.handled, _token.address).call()

  // TODO: 待考虑合并
  result.totalReward.ether = BN(result.claimableReward.ether).plus(result.claimedReward.ether).toFixed(0, 1)
}

/**
  * 获取已领取奖励数
  * - 钱包地址
  * @param {Object} _token 奖励代币对象
  */
__root__.claimedReward = async function (_token) {
  // TODO: 应该自动批量处理
  const { contract } = this
  const result = this.getAssociatedToken(_token)

  // update
  result.claimedReward.state.beforeUpdate()
  result.claimedReward.ether = await contract.methods.claimed(storeWallet.address.handled, _token.address).call()

  result.totalReward.ether = BN(result.claimableReward.ether).plus(result.claimedReward.ether).toFixed(0, 1)
}

/**
  * 获取待结算奖励数
  * - 查询用户在某矿池中可以领取的奖励
  * @param {Object} _lpt 奖励代币对象
  */
 __root__.settleableReward = async function (_lpt, idx) {
  // TODO: 应该自动批量处理
  const { contract } = this

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
    * lpt 在 UU 中的余额
    * - 更新 associatedTokens[].balance
    * @param {Object} _token
    */
  __root__.lptBalance = async function (_token) {
    const { address, contract } = this
    const result = this.getAssociatedToken(_token)

    // update
    result.balance.state.beforeUpdate()

    swaps.multicall.series([
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
  await this.getUU2LptVol(_token)

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
  
}))
