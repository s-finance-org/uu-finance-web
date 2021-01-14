import { reactive } from 'vue'

import swaps from '../swaps'

import DAI from './DAI'
import USDT from './USDT'
import USDC from './USDC'
import UU from './UU'

import DAI_USDC from './DAI_USDC'
import DAI_USDT from './DAI_USDT'

const tokens = reactive({
  DAI,
  USDT,
  USDC,
  UU,

  /* LP token */
  DAI_USDC,
  DAI_USDT,
})

// FIXME: temp
let initiateTokens = []
Object.values(tokens).forEach(item => {
  initiateTokens = initiateTokens.concat(item.initiateSeries)
})
swaps.multicall.batcher(initiateTokens)

export default tokens
