import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'CURVE_3CRV',
  address: getDotenvAddress('CURVE_3CRV_TOKEN'),
  icon: 'CRV_DAI',
  isLpt: true,
  poolName: 'Curve.fi 3pool',
  acquisitionUrl: 'https://www.curve.fi/3pool/deposit',
  isInfiniteAllowance: true
})