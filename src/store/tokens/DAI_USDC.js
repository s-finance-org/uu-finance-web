import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'DAI_USDC',
  address: getDotenvAddress('DAI_USDC_TOKEN'),
  isLPT: true,
  isInfiniteAllowance: true
})