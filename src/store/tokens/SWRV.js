import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'SWRV',
  address: getDotenvAddress('SWRV_TOKEN')
})
