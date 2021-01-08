import BigNumber from 'bignumber.js'

import { formatNumber } from '../../utils'
import { floor } from '../../utils/math/round'
import ModelState from '../base/state'
import ModelValueUint8 from './uint8'

export default {
  /**
   * @return {!Object}
   */
  create ({
    decimals = ModelValueUint8.create(),
    ether = undefined, // TODO: 待思考
    handled = undefined, // TODO: 待思考
    viewDecimal = 6,
    viewMethod = floor,
    viewPrefix = '',
    viewSuffix = '',
  } = {}) {
    // 缺省值
    const __default__ = {
      address: '',
      ether: Array(decimals.handled).fill(0).join(''),
      handled: '',
      view: '-',
    }
    const __store__ = {
      ether: __default__.ether,
      handled: __default__.handled,
    }

    const model = {
      type: 'uint256',

      /** @type {Object} */
      decimals,
      /** @type {number} */
      get precision () {
        const { decimals } = this

        return Math.pow(10, decimals.handled)
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

      /** @type {string} */
      get ether () {
        return __store__.ether
      },
      set ether (val) {
        const { precision } = this
        const result = __store__.ether = val

        this.handled = BigNumber(result).div(precision).toString()
      },

      /** @type {string} */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state } = this

        __store__.handled = val

        state.afterUpdate()
      },

      viewDecimal,
      viewMethod,
      /** @type {string} */
      get view () {
        const { handled, viewDecimal, state } = this
        let result = __default__.view

        if (state.updated) {
          result = viewPrefix + formatNumber(viewMethod(handled, viewDecimal)) + viewSuffix
        }

        return result
      },

      state: ModelState.create()
    }

    ether != null
      && (model.ether = ether)

    return model
  }
}