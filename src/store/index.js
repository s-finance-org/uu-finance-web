import { reactive } from 'vue'
import tokens from './tokens'
import i18n from '../i18n'
// import notify from './notify'
import wallet from './wallet'
// import { infuraWeb3 } from './web3'









import Notify from "bnc-notify"


/**
 * @type {!Object}
 */
const NETWORK_IDS = {
  1: 'Main', // Main Network
  3: 'Ropsten', // Ropsten Test Network
  4: 'Rinkeby', // Rinkeby Test Network
  5: 'Goerli', // Goerli Test Network
  42: 'Kovan', // Kovan Test Network
  100: 'xDai', // xDai POA Network
}





const NETWORK_ID = +process.env.VUE_APP_NETWORK_ID



export const notify = Notify({
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
  networkId: NETWORK_ID,
  desktopPosition: 'topRight',
})

export function notifyHandler(hash) {
  let { emitter } = notify.hash(hash)
  emitter.on('all', transaction => ({
      onclick: () => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank', 'noopener, norefferer')
    })
  )
}

export function notifyNotification(message, type = 'pending') {
  let notificationObject = {
    eventCode: 'notification',
    type: type,
    message: message,
  }

  return notify.notification(notificationObject)
}



 




export default reactive({
  i18n,
  tokens,
  // web3: infuraWeb3,
  wallet
})