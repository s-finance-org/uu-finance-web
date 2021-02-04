import BN from 'bignumber.js'

/** @type {string} */
export const TOKEN_MIN_AMOUNT_ETHER = '1'

/** @type {string} */
export const TOKEN_MAX_AMOUNT_ETHER = BN(2).pow(256).minus(1).toFixed(0, 1)

/** @type {string} */
// TODO: 最大值待定
export const MAX_INPUT = BN(2).pow(128).minus(1).toFixed(0, 1)

/**
 * 无限授权量的的最小阈值
 * - 允许最大量的 TOKEN_MAX_AMOUNT_ETHER 减半为目标（已用掉一半授权）
 * @type {string}
 */
export const TOKEN_INFINITE_MIN_AMOUNT_ETHER = BN(TOKEN_MAX_AMOUNT_ETHER).div(2).toString()

/**
 * 缺省的网络 ID
 * @type {number}
 */
export const DEFAULT_NETWORK_ID = 1

/**
 * .env 指定的网络 id
 * @type {number}
 */
export const NETWORK_ID = process.env.VUE_APP_NETWORK_ID || DEFAULT_NETWORK_ID

/**
 * 对应网络配置
 * @type {!Object}
 */
export const NETWORK_NAMES = {
  1: 'Main', // Main Network
  3: 'Ropsten', // Ropsten Test Network
  4: 'Rinkeby', // Rinkeby Test Network
  5: 'Goerli', // Goerli Test Network
  42: 'Kovan', // Kovan Test Network
  100: 'xDai' // xDai POA Network
}

/**
 * 缺省空地址
 * @type {string}
 */
export const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'
