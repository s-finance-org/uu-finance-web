import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'
import UU from './UU'

export default ModelToken.create({
  code: 'SFG',
  address: getDotenvAddress('SFG_TOKEN'),
  priceSource: 'uniswapV2Router2',
  chargeToken: UU
})