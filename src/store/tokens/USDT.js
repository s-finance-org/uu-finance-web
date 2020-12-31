import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'USDT',
  address: getDotenvAddress('USDT_TOKEN'),
})