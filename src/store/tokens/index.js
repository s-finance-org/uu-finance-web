import { multicall } from '../swaps'

// TODO:
import __UNKNOW__ from './__UNKNOW__'

import DAI from './DAI'
import USDT from './USDT'
import USDC from './USDC'
import UU from './UU'

import DAI_USDC from './DAI_USDC'
import DAI_USDT from './DAI_USDT'

const tokens = {
  DAI,
  USDT,
  USDC,
  UU,

  /* LP token */
  DAI_USDC,
  DAI_USDT,
}


// FIXME:
let aaa = []
Object.values(tokens).forEach(item => {
  aaa = aaa.concat(item.initiateSeries)
})

multicall.batcher(aaa)

export default tokens
