import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

import addresses from './helpers/tokenAddresses'

export default ModelToken.create({
  code: 'DAI',
  address: getDotenvAddress('DAI_TOKEN'),
})