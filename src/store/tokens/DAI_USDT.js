import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'DAI_USDT',
  address: getDotenvAddress('DAI_USDT_TOKEN'),
  isLPT: true,
  isInfiniteAllowance: true,
  // allowances: {

  // },
})