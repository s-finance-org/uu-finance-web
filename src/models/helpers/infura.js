import Web3 from 'web3'

import { DEFAULT_NETWORK_ID } from './constant'

const INFURA_ENDPOINTS_DOMIAN = {
  1: 'mainnet.infura.io',
  4: 'rinkeby.infura.io'
}

/**
 * 转为 Infura 专用的 domain
 * @param {number} networkId
 * @return {string}
 */
const toEndpointsDomain = networkId => INFURA_ENDPOINTS_DOMIAN[networkId] || INFURA_ENDPOINTS_DOMIAN[DEFAULT_NETWORK_ID]

export default {
  /**
   * @param {number|string} param 当前配置的网络 ID
   * @param {string} infuraKey
   * @return {!Object}
   */
  create ({
    networkId = DEFAULT_NETWORK_ID,
    infuraKey = '',
  } = {}) {
    const NETWORK_ID = +networkId || DEFAULT_NETWORK_ID
    const RPC_URL = `https://${toEndpointsDomain(NETWORK_ID)}/v3/${infuraKey}`

    return {
      web3: new Web3(RPC_URL),
      RPC_URL
    }
  }
}