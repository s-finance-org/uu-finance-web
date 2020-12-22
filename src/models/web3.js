import Web3 from 'web3'

export default {
  /**
   * @return {!Object}
   */
  create ({
    network = 'mainnet',
    infuraKey = ''
  } = {}) {
    const NETWORKS = {
      mainnet: 'mainnet.infura.io',
      rinkeby: 'rinkeby.infura.io'
    }
    // TODO: network 不在范围内时，将采用的；没有key 时
    // TODO: 采用默认的值来解决这问题
    const INFURA_URL = `https://${NETWORKS[network]}/v3/${infuraKey}`

    return new Web3(INFURA_URL)
  }
}