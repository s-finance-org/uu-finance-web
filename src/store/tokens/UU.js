import BN from 'bignumber.js'
import { reactive } from 'vue'

import { ModelToken, ModelValueEther, ModelValueAddress } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

import tokenAddresses from './token-addresses'

import swaps from '../swaps'
import storeWallet from '../wallet'
import notify from '../notify'
import i18n from '../../i18n'

const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"lpt","type":"address"},{"indexed":false,"internalType":"address","name":"swap","type":"address"},{"indexed":false,"internalType":"address","name":"depo","type":"address"},{"indexed":false,"internalType":"uint256","name":"nvi","type":"uint256"},{"indexed":false,"internalType":"address","name":"gauge","type":"address"}],"name":"AddLPT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"reward","type":"address"}],"name":"AddReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"address","name":"reward","type":"address"},{"indexed":false,"internalType":"uint256","name":"vol","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tip","type":"uint256"},{"indexed":true,"internalType":"address","name":"agent","type":"address"}],"name":"ClaimTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousGovernor","type":"address"},{"indexed":true,"internalType":"address","name":"newGovernor","type":"address"}],"name":"GovernorshipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"lpt","type":"address"}],"name":"RemoveLPT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"reward","type":"address"},{"indexed":false,"internalType":"uint256","name":"remain","type":"uint256"}],"name":"RemoveReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"agent","type":"address"},{"indexed":true,"internalType":"address","name":"gauge","type":"address"},{"indexed":true,"internalType":"address","name":"reward","type":"address"},{"indexed":false,"internalType":"uint256","name":"vol","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tip","type":"uint256"}],"name":"Settle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"upPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"UpdatePrice","type":"event"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"},{"internalType":"address","name":"swap","type":"address"},{"internalType":"address","name":"depo","type":"address"},{"internalType":"uint256","name":"nvi","type":"uint256"},{"internalType":"address","name":"gauge","type":"address"}],"name":"addLPT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amt","type":"uint256"},{"internalType":"address","name":"lpt","type":"address"},{"internalType":"uint256","name":"minVol","type":"uint256"}],"name":"burn","outputs":[{"internalType":"uint256","name":"vol","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"calcPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"}],"name":"claim","outputs":[{"internalType":"uint256","name":"vol","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"claimTo","outputs":[{"internalType":"uint256","name":"vol","type":"uint256"},{"internalType":"uint256","name":"tip","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"acct","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"claimable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"acct","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"claimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"decrement","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"}],"name":"getConfig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getConfig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getConfig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"governor","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"increment","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"governor_","type":"address"},{"internalType":"address","name":"up_","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"governor_","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialize2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastUpdateTimeSpan","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"},{"internalType":"uint256","name":"vol","type":"uint256"}],"name":"lpt2uu","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"}],"name":"lptBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lptN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"}],"name":"lptPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lpts","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"},{"internalType":"uint256","name":"vol","type":"uint256"},{"internalType":"uint256","name":"minMint","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"amt","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"},{"internalType":"uint256","name":"vol","type":"uint256"}],"name":"netValue","outputs":[{"internalType":"uint256","name":"amt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"}],"name":"netValue","outputs":[{"internalType":"uint256","name":"amt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"}],"name":"removeLPT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"}],"name":"removeReward","outputs":[{"internalType":"uint256","name":"remain","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceGovernorship","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rewards","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"setConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"lpt","type":"address"},{"internalType":"uint256","name":"j","type":"uint256"}],"name":"settle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"acct","type":"address"},{"internalType":"address","name":"lpt","type":"address"},{"internalType":"uint256","name":"j","type":"uint256"}],"name":"settleable","outputs":[{"internalType":"address","name":"reward","type":"address"},{"internalType":"uint256","name":"vol","type":"uint256"},{"internalType":"uint256","name":"tip","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"}],"name":"totalClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNetValue","outputs":[{"internalType":"uint256","name":"amt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newGovernor","type":"address"}],"name":"transferGovernorship","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"}],"name":"tryAddReward","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"up","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"vol","type":"uint256"}],"name":"up2uu","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"upAllowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"volume","type":"uint256"}],"name":"upApprove_","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"upBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"upPermit_","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"upPriceFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"upTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"volume","type":"uint256"}],"name":"upTransferFrom_","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"volume","type":"uint256"}],"name":"upTransfer_","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"updatePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amt","type":"uint256"},{"internalType":"address","name":"lpt","type":"address"}],"name":"uu2lpt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"uu2up","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

// TODO: 最好能自带，要让内部每一层都可以调用 __root__
const __root__ = reactive(ModelToken.create({
  code: 'UU',
  address: getDotenvAddress('UU_TOKEN'),
  abi,
  isInfiniteAllowance: true,
  customSeries () {
    const {
      address,
      contract,
      supportedLptNum,
      supportedRewardNum,
    } = this

    return [
      // 支持的 lpt 数量
      { decodeType: supportedLptNum.type, call: [address, contract.methods.lptN().encodeABI()], target: supportedLptNum },
      // 支持的奖励 token 数量
      { decodeType: supportedRewardNum.type, call: [address, contract.methods.rewardN().encodeABI()], target: supportedRewardNum },
    ]
  },
  // TODO: 要追加而不是覆盖（有默认的）
  associatedTokenModel: {
    create (_token) {
      const { decimals } = _token

      return {
        // 待领取奖励数
        claimableReward: ModelValueEther.create({ decimals }),
        // 已领取奖励数
        claimedReward: ModelValueEther.create({ decimals }),
        // 合计奖励数
        totalReward: ModelValueEther.create({ decimals }),
        // 在 UU 中的余额
        balance: ModelValueEther.create({ decimals }),
        // 铸造 UU 可获得的量（由不同 token address 区分）
        mintGainAmount: ModelValueEther.create({ decimals }),
        // 取回将销毁 UU 的量（由不同 token address 区分）
        burnGainAmount: ModelValueEther.create({ decimals }),
        // 挖矿奖励数量
        miningPendingRewards: ModelValueEther.create({ decimals }),
        // 待结算奖励数
        settleableReward: ModelValueEther.create({ decimals }),
        // TODO: temp lpt 对应的奖励 token
        lptRewards: []
      }
    }
  }
}))

/**
 * 支持的 lpt 数量
 * - supportedLptNum -> supportedLptAddresses
 * @type {Object}
 */
__root__.supportedLptNum = ModelValueEther.create({
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
          if (handled === '0xd9976960b50e0966626673480C70b1da07E5AC1b') {
            await __root__.settleableReward(tokenAddresses[handled], 0)
            await __root__.settleableReward(tokenAddresses[handled], 1)
            await __root__.settleableReward(tokenAddresses[handled], 2)
          }
          // XXX: 如果没有在 tokenAddresses 内的，则应该自动创建
          // TODO: 考虑如何 multi
          // await __root__.settleableReward(tokenAddresses[handled], i)
        }
      })
      __root__.supportedLptAddresses[i] = _address

      series.push({
        decodeType: __root__.supportedLptAddresses[i].type,
        call: [
          address,
          contract.methods.lpts(i).encodeABI()
        ],
        target: __root__.supportedLptAddresses[i]
      })
    }

    await swaps.multicall.batcher(series)
  }
})

/**
 * 支持的 lpt 地址
 * @type {Array}
 */
// TODO: 遍历 lpts()
__root__.supportedLptAddresses = [],

/**
 * 
 */
// TODO: 
__root__.burnMinVol = ModelValueEther.create(),

/**
 * 支持的奖励 token 数量
 * - supportedRewardNum -> supportedRewardAddresses
 * @type {Object}
 */
__root__.supportedRewardNum = ModelValueEther.create({
  async trigger () {
    const { handled } = this
    const { contract, address } = __root__

    // TODO: 这里 handled 是字符串
    // __root__.supportedRewardAddresses = Array(+handled)
    //   .fill(ModelValueAddress.create({
    //     async trigger () {
    //       const { handled } = this
    //       const { associatedTokens } = __root__

    //       // XXX: 如果没有在 tokenAddresses 内的，则应该自动创建
    //       // TODO: 考虑如何 multi
    //       await __root__.claimableReward(tokenAddresses[handled])
    //       await __root__.claimedReward(tokenAddresses[handled])
    //     }
    //   }))

//     const series = __root__.supportedRewardAddresses.map((item, idx) => {
// console.log('idx', idx)
//       return {
//         decodeType: item.type,
//         call: [
//           address,
//           contract.methods.rewards(idx).encodeABI()
//         ],
//         target: item
//       }
//     })
    const series = []

    for (let i =0; i < +handled; i++ ) {
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
        decodeType: __root__.supportedRewardAddresses[i].type,
        call: [
          address,
          contract.methods.rewards(i).encodeABI()
        ],
        target: __root__.supportedRewardAddresses[i]
      })
    }

    await swaps.multicall.batcher(series)
  }
})

/**
 * 支持的奖励 token 地址
 */
// TODO: rewards()
// TODO: temp
// TODO: 过渡品
__root__.supportedRewardAddresses = []

/**
 * TODO: 
 * lpt 铸造 UU
 * @param {Object} _token
 */
__root__.mint = async function (_token) {
  const { contract, address, state } = this
  const walletAddress = storeWallet.address

  // 限制当前提交待确认的交易只有一份
  state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: '正准备拉起' })

  try {
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
    } catch(err) {
      console.error(err)
    }

    return _method.send(sendOpts)
      .once('transactionHash', hash => {
        dismiss()
        notify.handler(hash)
        state.afterUpdate()
      })
      .catch(err =>{
        console.log(err)

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      })
  } catch (err) {
    console.error(err)

    notify.updateError({
      update,
      code: err.code,
      message: err.message
    })

    state.afterUpdate()
  }
},

/**
 * 铸造 UU 可获得的 lpt 量
 * @param {Object} _token
 * @return {Promise}
 */
__root__.getLpt2UUVol = async function (_token) {
  const { contract } = this
  const result = __root__.getAssociatedToken(_token)

  // update
  // TODO: multi
  result.mintGainAmount.state.beforeUpdate()
  result.mintGainAmount.ether = await contract.methods.lpt2uu(_token.address, _token.amount.ether).call()

  // TODO: 在 multi 未使用之前暂不使用
  // const lptBalance = await contract.methods.lptBalance(_token.address).call()

  // // TODO: why?
  // if(minVolEther == lptBalance) {
  //   minVolEther = await contract.methods.lpt2uu(_token.address, minVolEther).call()
  // }

  // TODO: 参考
  // _updatePrice();
  //   amt = lpt2uu(lpt, vol);
  //   require(amt >= minMint, 'Slippage screwed you');
  //   lpt.safeTransferFrom(_msgSender(), address(this), vol);
  //   address gauge = address(getConfig(_gaugeOfLPT_, lpt));
  //   if(gauge != address(0)) {
  //       lpt.safeApprove(gauge, vol);
  //       Gauge(gauge).deposit(vol);
  //   }
  //   _mint(_msgSender(), amt);
  //   _adjustPriceFactor();
}

/**
 * 取回 lpt 将销毁 UU 的量
 * @param {Object} _token
 * @return {Promise}
 */
__root__.getUU2LptVol = async function (_token) {
  const { contract } = this
  const result = __root__.getAssociatedToken(_token)

  // update
  // TODO: multi
  result.burnGainAmount.state.beforeUpdate()
  result.burnGainAmount.ether = await contract.methods.uu2lpt(_token.amount.ether, _token.address).call()
  // TODO: 在 multi 未使用之前暂不使用
  // const lptBalance = await contract.methods.lptBalance(_token.address).call()

  // // TODO: why?
  // if(minVolEther == lptBalance) {
  //   minVolEther = await contract.methods.lpt2uu(_token.address, minVolEther).call()
  // }
},

/**
 * 领取全部奖励
 * - 钱包地址
 * TODO:
 */
__root__.claimAllRewards = async () => {
  const { contract, state } = __root__
  const walletAddress = storeWallet.address

  // 限制当前提交待确认的交易只有一份
  state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: '提交领取全部奖励' })

  try {
    const sendOpts = {
      from: walletAddress,
    }

    const _method = await contract.methods.claim()

    try {
      sendOpts.gas = await _method.estimateGas({
        from: walletAddress,
      })
    } catch(err) {
      console.error(err)
    }

    return _method.send(sendOpts)
      .once('transactionHash', hash => {
        dismiss()
        notify.handler(hash)
        state.afterUpdate()
      })
      .catch(err =>{
        console.log(err)

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      })
  } catch (err) {
    console.error(err)

    notify.updateError({
      update,
      code: err.code,
      message: err.message
    })

    state.afterUpdate()
  }
},

/**
 * 领取奖励
 * - 钱包地址
 * TODO: 与 claimRewards 类似，可合成一个
 */
__root__.claimReward = async (_token) => {
  const { contract, state } = __root__
  const walletAddress = storeWallet.address

  // 限制当前提交待确认的交易只有一份
  state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: `领取${_token.code}奖励` })

  try {
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
      .once('transactionHash', hash => {
        dismiss()
        notify.handler(hash)
        state.afterUpdate()
      })
      .catch(err =>{
        console.log(err)

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      })
  } catch (err) {
    console.error(err)

    notify.updateError({
      update,
      code: err.code,
      message: err.message
    })

    state.afterUpdate()
  }
},

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
  result.claimableReward.ether = await contract.methods.claimable(storeWallet.address, _token.address).call()

  // TODO: 待考虑合并
  result.totalReward.ether = BN(result.claimableReward.ether).plus(result.claimedReward.ether).toFixed(0, 1)
},

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
  result.claimedReward.ether = await contract.methods.claimed(storeWallet.address, _token.address).call()

  result.totalReward.ether = BN(result.claimableReward.ether).plus(result.claimedReward.ether).toFixed(0, 1)
},

/**
  * 获取待结算奖励数
  * - 查询用户在某矿池中可以领取的奖励
  * @param {Object} _token 奖励代币对象
  */
 __root__.settleableReward = async function (_token, idx) {
  // TODO: 应该自动批量处理
  const { contract } = this

  /* data
    reward: _token.address, // address 该奖励的 token address，异常时返回 0x0000000000000000000000000000000000000000
    vol: 0, // uint256 挖矿奖励数量
    tip: 0, // uint256 结算小费，与 vol 比例为 99:1
   */
  const { vol, tip, reward } = await contract.methods.settleable(storeWallet.address, _token.address, idx).call()
  // TODO:
  const lpt__ = this.associatedTokens[_token.address].lptRewards[idx] = reward

  // TODO: 这里的数据应该跟 pool 相关
  const result = this.getAssociatedToken({ address: reward })

  console.log('reward', reward)

  result.miningPendingRewards.ether = vol
  result.settleableReward.ether = tip
},


/**
 * 参与流动性池代币结算
 * - 钱包地址
 * @param {number} idx 在 supportedLptAddresses 内的索引
 */
// TODO: 
__root__.settleReward = async function (lptAddress, idx) {
  const { contract, state } = this
  const walletAddress = storeWallet.address

  // 限制当前提交待确认的交易只有一份
  state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: `领取结算` })

  try {
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
      .once('transactionHash', hash => {
        dismiss()
        notify.handler(hash)
        state.afterUpdate()
      })
      .catch(err =>{
        console.log(err)

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      })
  } catch (err) {
    console.error(err)

    notify.updateError({
      update,
      code: err.code,
      message: err.message
    })

    state.afterUpdate()
  }
},

/**
  * lpt 在 UU 中的余额
  * - 更新 associatedTokens[].balance
  * @param {Object} _token
  */
__root__.lptBalance = async function (_token) {
  // TODO: 应该自动批量处理
  const { contract } = this
  const result = this.getAssociatedToken(_token)

  // update
  result.balance.state.beforeUpdate()
  result.balance.ether = await contract.methods.lptBalance(_token.address).call()
},

/**
  * lpt 销毁 UU
  * TODO:
  * @param {Object} _token
  */
__root__.burn = async function (_token) {
  const { contract, address, state } = this
  const walletAddress = storeWallet.address

  // 限制当前提交待确认的交易只有一份
  state.beforeUpdate()

  const { update, dismiss } = notify.notification({ message: '正准备拉起' })

  try {
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

    return method.send(sendOpts)
      .once('transactionHash', hash => {
        dismiss()
        notify.handler(hash)
        state.afterUpdate()
      })
      .catch(err =>{
        console.log(err)

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      })
  } catch (err) {
    console.error(err)

    notify.updateError({
      update,
      code: err.code,
      message: err.message
    })

    state.afterUpdate()
  }
}


export default __root__