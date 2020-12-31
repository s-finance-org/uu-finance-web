import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'UU',
  address: getDotenvAddress('UU_TOKEN'),
})