import BigNumber from 'bignumber.js'

import * as helpers from '../../utils/helpers'
import { floor } from '../../utils/math/round'

import ModelState from '../base/state'
import storeWallet from '../../store/wallet'

/**
 * 钱包数据模型
 * TODO: 
 * - 调用 handled、view 时，当 address 变更时才会触发数值更新；如果不调用，则不
 */
export default {
  /**
   * @return {!Object}
   */
  create ({
    decimal = 18,
    viewDecimal = 6,
    viewDefault = '-',
    viewMethod = floor,
    trigger = new Promise((resolve, reject) => {})
  } = {}) {
    const __store__ = {
      address: '',
      ether: '000000000000000000',
      handled: '',
      view: viewDefault,
    }

    return {
      /** @type {number} */
      decimal,
      /** @type {number} */
      get precision () {
        const { decimal } = this

        return Math.pow(10, decimal)
      },

      get adsfasdf () {
        console.log('钱包数据出口被调用，且变更', )
        return storeWallet.address
      },

      /**
       * 钱包地址
       * - 自动关联钱包数据
       * @type {string}
       */
      get address () {
        const { state } = this

        const result = storeWallet.address
console.log(result,  __store__.address !== result)
        // 有效，且与上一个地址不同时才继续
        if (result
            && __store__.address !== result) {

          state.beforeUpdate()
          // sync
          __store__.address = result

          this.trigger(result)
            .then(data => {
              this.ether = data
              this.state.afterUpdate()
            })
        }

        return result
      },

      /**
       * 触发器
       * @type {Function}
       */
      trigger,

      /** @type {string} */
      get ether () {
        const { address } = this

        return __store__.ether
      },
      set ether (val) {
        const { precision } = this
        const result = __store__.ether = val

        // this.handled = 
      },

      /**
       * 处理的数据
       * - 主动式更新
       * @type {string|number}
       */
      get handled () {
        const { ether, precision } = this

        return BigNumber(ether).div(precision).toString()
        // return __store__.handled
      },
      set handled (val) {
        __store__.handled = val
      },

      viewDecimal,
      viewMethod,
      /**
       * 视觉数据
       * - 主动式更新
       * @type {string}
       */
      get view () {
        // FIXME: address
        const { handled, viewDecimal, state } = this
        let result = viewDefault

        if (state.updated) {
          // FIXME: formatNumber toFixed -> round()
          result = __store__.view = helpers.formatNumber(viewMethod(handled, viewDecimal), viewDecimal)
        }

        return result
      },

      state: ModelState.create()
    }
  }
}