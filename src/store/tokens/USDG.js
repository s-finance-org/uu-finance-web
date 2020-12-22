import { ModelToken } from '../../models'
import ABI from './helpers/abi'

export default ModelToken.create({
  code: 'USDG',
  address: process.env.VUE_APP_USDG_TOKEN,
  abi: ABI.ERC20,
})
