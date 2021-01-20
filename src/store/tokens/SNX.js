import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'SNX',
  address: getDotenvAddress('SNX_TOKEN'),
})