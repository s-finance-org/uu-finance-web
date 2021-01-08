import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'USDC',
  address: getDotenvAddress('USDC_TOKEN'),
})