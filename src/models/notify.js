import Notify from 'bnc-notify'

import web3 from '../store/web3'

export default {
  async create ({
    
    desktopPosition = 'topRight'
  }) {

const notify = Notify({
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
  networkId: +process.env.VUE_APP_BLOCKNATIVE_NETWORK_ID,
})

// get users' account address
const accounts =  window.ethereum.enable()
console.log(accounts[0])
// send a transaction
web3.eth
  .sendTransaction({
    from: accounts[0],
    to: '0x792ec62e6840bFcCEa00c669521F678CE1236705',
    value: '100000'
  })
  // listen for transaction hash
  .on('transactionHash', hash => {
    // pass the hash to notify.hash function for transaction updates and notifications
    const { emitter } = notify.hash(hash)

    // use emitter to listen to transaction events
    emitter.on('txSent', console.log)
    emitter.on('txPool', console.log)
    emitter.on('txConfirmed', console.log)
    emitter.on('txSpeedUp', console.log)
    emitter.on('txCancel', console.log)
    emitter.on('txFailed', console.log)
    emitter.on('all', console.log)
  })

    return notify
  }
}