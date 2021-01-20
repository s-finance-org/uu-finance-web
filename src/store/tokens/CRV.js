import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'CRV',
  address: getDotenvAddress('CRV_TOKEN'),
})