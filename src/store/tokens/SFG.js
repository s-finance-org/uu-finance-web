import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'SFG',
  address: getDotenvAddress('SFG_TOKEN'),
})