import BN from 'bignumber.js'

import { formatNumber } from '../../utils'
import { floor } from '../../utils/math/round'
import ModelState from '../base/state'
import ModelValueUint8 from './uint8'

export default {
  /**
   * - 数据关联 value -> ether <-> handled -> view
   * @param {Object=} opts.decimals 原数据的设定精度
   * @param {string=} opts.value 预设值
   * @param {string=} opts.handled 预设值
   * @param {number=} opts.viewDecimal 显示内容的显示精度
   * @param {Function=} opts.viewMethod 显示内容的舍入方法
   * @param {string=} opts.viewPrefix 显示内容的前缀
   * @param {string=} opts.viewSuffix 显示内容的后缀
   * @return {!Object}
   */
  create ({
    decimals = ModelValueUint8.create(),
    value = undefined,
    handled = undefined,
    viewDecimal = 6,
    viewMethod = floor,
    viewPrefix = '',
    viewSuffix = '',
  } = {}) {
    const __default__ = {
      address: '',
      ether: Array(decimals.handled).fill(0).join(''),
      handled: '',
      view: '-',
    }
    const __cache__ = {
      decimals: undefined,
      precision: undefined
    }
    const __store__ = {
      ether: __default__.ether,
      handled: __default__.handled,
    }

    const result = {
      type: 'uint256',

      /** @type {Object} */
      decimals,
      // TODO: 设为通用方法
      /** @type {number} */
      get precision () {
        const { decimals } = this
        let result = __cache__.precision

        // 没变动则从缓存获取
        if (__cache__.decimals !== decimals.handled) {
          __cache__.decimals = decimals.handled
          result = __cache__.precision = Math.pow(10, decimals.handled)
        }

        return result
      },

      /**
       * IO
       * @type {(string|number)}
       */
      get value () {
        return this.ether
      },
      set value (val) {
        this.ether = val
      },

      /**
       * - ether、handled 数据同步
       * @type {string}
       */
      get ether () {
        return __store__.ether
      },
      set ether (val) {
        const { state, precision } = this
        const result = __store__.ether = val

        // sync
        __store__.handled = BN(result).div(precision).toString()
        state.afterUpdate()
      },

      /**
       * - ether、handled 数据同步
       * @type {string}
       */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state, precision } = this
        const result = __store__.handled = val

        // sync
        __store__.ether = BN(result).times(precision).toString()
        state.afterUpdate()
      },

      viewDecimal,
      viewMethod,
      viewPrefix,
      viewSuffix,
      /** @type {string} */
      get view () {
        const { handled, viewDecimal, state } = this
console.log('----- view')
        return state.updated
          ? viewPrefix + formatNumber(BN(viewMethod(handled, viewDecimal)).toFixed(viewDecimal)) + viewSuffix
          : __default__.view
      },

      state: ModelState.create()
    }

    // 预设
    value != null
      && (result.value = value)
    handled != null
      && (result.handled = handled)

    return result
  }
}