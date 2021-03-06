import ModelInitWallet from '../models/helpers/init-wallet'

export default ModelInitWallet.create({
  infuraKey: process.env.VUE_APP_INFURA_KEY,
  supportedWallets: [
    'metamask',
    'walletConnect',
    'trezor',
    'ledger',
    'trust',
    'imToken',
    'coinbase',
    'status',
    'meetone',
  ]
})
