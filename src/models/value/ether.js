import BN from 'bignumber.js'

import { formatNumber, floor } from '../../utils'
import ModelState from '../base/state'
import ModelValueUint8 from './uint8'

export default {
  /**
   * - 数据关联 value -> ether <-> handled -> view
   * @param {Object=} opts.decimals 原数据的设定精度
   * @param {number=} opts.viewDecimal 显示内容的显示精度
   * @param {Function=} opts.viewMethod 显示内容的舍入方法
   * @param {string=} opts.viewPrefix 显示内容的前缀
   * @param {string=} opts.viewSuffix 显示内容的后缀
   * @param {Function=} opts.trigger 触发器
   * @param {Object} opts.stateParams 状态参数
   * @return {!Object}
   */
  create ({
    decimals = ModelValueUint8.create(),
    viewDecimal = 6,
    viewMethod = floor,
    viewPrefix = '',
    viewSuffix = '',
    trigger = null,
    stateParams = {}
  } = {}) {
    const __default__ = {
      address: '',
      ether: '0',
      handled: '0',
      view: '-',
    }
    const __cache__ = {
      decimals: undefined,
      precision: undefined
    }
    const __store__ = {
      ether: __default__.ether,
      handled: __default__.handled
    }

    const result = {
      // TODO: 添加 min、max uint256 的范围
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
       * - 对应 ether
       * @type {(string|number)}
       */
      get value () {
        return this.ether
      },
      set value (val) {
        this.setEther(val)
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
        const result = __store__.ether = val || __default__.ether

        // sync
        __store__.handled = BN(result).div(precision).toString()
        // TODO: 必须是方法
        this.trigger && this.trigger()
        state.afterUpdate()
      },
      /**
       * ether 链式方法赋值
       * @param {string} val
       * @return {Object}
       */
      setEther (val) {
        this.ether = val

        return this
      },

      /**
       * - ether、handled 数据同步
       * - 允许
       * @type {string}
       */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state, precision } = this
        // 避免空字符串赋值
        __store__.handled = BN(val || __default__.handled).toString()

        // sync
        __store__.ether = BN(result).times(precision).toFixed(0, 1)
        // TODO: 必须是方法
        this.trigger && this.trigger()
        state.afterUpdate()
      },
      /**
       * handled 链式方法赋值
       * @param {string} val
       * @type {Function}
       */
      setHandled (val) {
        this.handled = val

        return this
      },

      /**
       * 触发器
       * @type {Function}
       */
      trigger,

      viewDecimal,
      viewMethod,
      viewPrefix,
      viewSuffix,
      /**
       * 视觉处理值
       * - view 的可用数值
       * @type {string}
       */
      get handledView () {
        const { handled, viewDecimal } = this

        return viewMethod(handled, viewDecimal)
      },
      /**
       * 视觉格式化的数据
       * - 格式化
       * @type {string}
       */
      get view () {
        const { handledView, viewDecimal, state } = this

        return state.updated
        // TODO: 淘汰 toFixed
          ? viewPrefix + formatNumber(BN(handledView).toFixed(viewDecimal)) + viewSuffix
          : __default__.view
      },

      state: ModelState.create(stateParams)
    }

    return result
  }
}
