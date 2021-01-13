import BN from 'bignumber.js'

/** @type {string} */
export const TOKEN_MIN_AMOUNT_ETHER = '1'

/** @type {string} */
export const TOKEN_MAX_AMOUNT_ETHER = BN(2).pow(256).minus(1).toFixed(0, 1)

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