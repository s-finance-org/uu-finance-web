import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'SFINANCE_USD5',
  address: getDotenvAddress('SFINANCE_USD5_TOKEN'),
  icon: 'SFG_USD5',
  isLpt: true,
  isInfiniteAllowance: true
})