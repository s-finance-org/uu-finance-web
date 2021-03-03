import BN from 'bignumber.js'

import abi from './abi'
import ModelSwap from '../../../models/swap'
import multicall from '../multicall'

export default ModelSwap.create({
  code: 'uniswapV2Router2',
  dotenvAddressName: 'UNISWAP_V2_ROUTER2_SWAP',
  abi
}).extend(function (__root__) {
  /**
   * @param {number} amountIn unit256
   * @param {Array} path address[]
   * @return {Array} [amountIn, totalPrice]
   */
  this.getAmountsOut = async (amountIn, path) => {
    const { contract } = this
    let result = []

    try {
      result = await contract.methods.getAmountsOut(amountIn, path).call()
    } catch (err) {
      console.error('uniswapV2Router2 getAmountsOut()', err)
    }

    return result
  }

  /**
   * @param {Object} targetPrice ModelValue
   * @param {Object} targetToken 目标 token
   * @param {Object} chargeToken 计价 token
   * @param {string=} amount
   */
  this.getPrice = (targetPrice, targetToken, chargeToken, amount = 1) => {
    const { contract, address } = this
    const amountInWei = BN(amount).times(targetToken.precision).toString()
    const path = [targetToken.address, chargeToken.address]

    multicall.series([{
      decodeType: 'uint256[]',
      call: [
        address,
        // 卖出资产，得到的中间资产和最终资产的数量
        contract.methods.getAmountsOut(amountInWei, path).encodeABI()
      ],
      target: {
        // 解构 uniswapV2Router2 数据结构
        setValue (val) {
          targetPrice.setValue(BN(val[1]).dividedBy(amount).toString())
        }
      }
    }])
  }
})
