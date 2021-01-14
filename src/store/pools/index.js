import { reactive } from 'vue'

import swaps from '../swaps'

import DAI_USDT from './DAI_USDT'

const pools = reactive({
  DAI_USDT,
})


// FIXME:
// let aaa = []
// Object.values(tokens).forEach(item => {
//   aaa = aaa.concat(item.initiateSeries)
// })

// multicall.batcher(aaa)

export default pools
