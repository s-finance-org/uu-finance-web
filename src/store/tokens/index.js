import { reactive } from 'vue'

import swaps from '../swaps'
import tokenAddresses from './token-addresses'

import DAI from './DAI'
import USDT from './USDT'
import USDC from './USDC'
import UU from './UU'
import CRV from './CRV'
import SNX from './SNX'
import SFG from './SFG'
import SWRV from './SWRV'

import DAI_USDC from './DAI_USDC'
import DAI_USDT from './DAI_USDT'
import SFINANCE_USD5 from './SFINANCE_USD5'
import CURVE_3CRV from './CURVE_3CRV'

/**
 * 以 token code 为 key 的数据集
 * @type {!Object}
 */
const tokens = reactive({
  DAI,
  USDT,
  USDC,
  UU,
  CRV,
  SNX,
  SFG,
  SWRV,

  /* LP token */
  DAI_USDC, // test
  DAI_USDT, // test
  SFINANCE_USD5,
  CURVE_3CRV
})

// FIXME: temp
let initiateTokens = []
Object.values(tokens).forEach(token => {
  if (token && token.address) {
    tokenAddresses[token.address] = token

    initiateTokens = initiateTokens.concat(token.initiateSeries)
  }

})
swaps.multicall.batcher(initiateTokens)

export default tokens
