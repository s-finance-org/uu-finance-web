import { multicall } from '../swaps'

import DAI from './DAI'
import USDT from './USDT'
import UU from './UU'


const tokens = {
  DAI,
  USDT,
  UU

  /* LP token */
}



// FIXME:
let aaa = []
Object.values(tokens).forEach(item => {
  aaa = aaa.concat(item.initiateSeries)
})

multicall.batcher(aaa)

export default tokens
