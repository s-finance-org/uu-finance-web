import { ModelToken } from '../../models'

export default ModelToken.create({
  code: 'DAI',
  address: process.env.VUE_APP_DAI_TOKEN,
})