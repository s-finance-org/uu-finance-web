import { ModelToken } from '../../models'

export default ModelToken.create({
  code: 'USDT',
  address: process.env.VUE_APP_USDT_TOKEN,
})