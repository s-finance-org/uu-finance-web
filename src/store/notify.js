import ModelInitNotify from '../models/helpers/init-notify'

export default ModelInitNotify.create({
  networkId: process.env.VUE_APP_NETWORK_ID,
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
})