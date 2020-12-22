import ModelWeb3 from '../models/web3'

export default ModelWeb3.create({
  network: 'rinkeby',
  infuraKey: process.env.VUE_APP_INFURA_KEY
})