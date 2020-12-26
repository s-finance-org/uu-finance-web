// // import { ModelBnOnboard } from '../models'
// import ModelBnOnboard from '../models/blocknative/onboard'
// console.log('ModelBnOnboard', ModelBnOnboard)
// /**
//  * mainnet.infura.io
//  * rinkeby.infura.io
//  * @type {string}
//  */
// const INFURA_ENDPOINTS_DOMIAN = 'rinkeby.infura.io'
// const RPC_URL = `https://${INFURA_ENDPOINTS_DOMIAN}/v3/${process.env.VUE_APP_INFURA_KEY}`

// export default ModelBnOnboard.create({
//   dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
//   wallets: [
//     { walletName: "metamask", preferred: true },
//     { walletName: "walletConnect", preferred: true, infuraKey: process.env.VUE_APP_INFURA_KEY },
//     { walletName: 'trezor', preferred: true, appUrl: process.env.VUE_APP_URL, email: process.env.VUE_APP_CONTACT_EMAIL, rpcUrl: RPC_URL },
//     { walletName: "ledger", preferred: true, rpcUrl: RPC_URL },
//     { walletName: "coinbase" },
//     { walletName: "status" },
//     { walletName: "trust", rpcUrl: RPC_URL },
//     { walletName: "imToken", rpcUrl: RPC_URL },
//     { walletName: "meetone" },
//   ]
// })