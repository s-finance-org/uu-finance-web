import { reactive } from 'vue'

import ModelCoinETH from '../../models/coin/eth'

export default reactive({
  ETH: ModelCoinETH.create()
})
