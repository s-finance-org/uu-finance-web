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

// TODO: notify 要支持 i18n 自动变更和自定义 https://docs.blocknative.com/notify#i-18-n
/**
 * @see {@link https://docs.blocknative.com/notify}
 * @type {Object}
 */
const notify = Notify({
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
  networkId: NETWORK_ID,
  desktopPosition: 'topRight',
})

const handler = hash => {
  const { emitter } = notify.hash(hash)

  emitter.on('all', transaction => ({
      onclick () {(window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank', 'noopener, norefferer'))}
    })
  )
}

const notification = (message, type = 'pending') => {
  const notificationObject = {
    eventCode: 'notification',
    type: type,
    message: message,
  }

  return notify.notification(notificationObject)
}

export default {
  handler,
  notification
}