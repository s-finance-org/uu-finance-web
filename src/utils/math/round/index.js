import baseRound from './baseRound'

/**
 * 向上舍入
 * @param {string|number} num
 * @param {number=} [precision=0]
 * @return {number}
 */
export const ceil = baseRound('ceil')

/**
 * 向下舍入
 * @param {string|number} num
 * @param {number=} [precision]
 * @return {number}
 */
export const floor = baseRound('floor')

/**
 * 四舍五入
 * @param {string|number} num
 * @param {number=} [precision=0]
 * @return {number}
 */
export const round = baseRound('round')