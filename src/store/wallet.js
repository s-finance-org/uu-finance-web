import ModelInitWallet from '../models/helpers/init-wallet'

export default ModelInitWallet.create({
  networkId: process.env.VUE_APP_NETWORK_ID,
  infuraKey: process.env.VUE_APP_INFURA_KEY,
})