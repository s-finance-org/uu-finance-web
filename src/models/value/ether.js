import BN from 'bignumber.js'
import { reactive } from 'vue'

import { formatNumber, floor } from '../../utils'
import ModelState from '../base/state'
import ModelValueUint8 from './uint8'

export default {
  /**
   * - 数据关联 value -> ether <-> handled -> view
   * @param {Object=} opts.decimals 原数据的设定精度
   * @param {number=} opts.addition 加成
   * @param {number=} opts.viewDecimal 显示内容的显示精度
   * @param {Function=} opts.viewMethod 显示内容的舍入方法
   * @param {string=} opts.viewPrefix 显示内容的前缀
   * @param {string=} opts.viewSuffix 显示内容的后缀
   * @param {Function=} opts.trigger 触发器
   * @param {Function=} opts.referrer 引用器
   * @param {Object} opts.stateParams 状态参数
   * @return {!Object}
   */
  create ({
    decimals = ModelValueUint8.create(),
    addition = 1,
    viewDecimal = 6,
    viewMethod = floor,
    viewPrefix = '',
    viewSuffix = '',
    trigger = () => new Promise((resolve, reject) => {}),
    referrer = () => new Promise((resolve, reject) => {}),
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

    return reactive({
      /**
       * 链式方法初始事件
       * - this 指为根
       * @param {Function} callback(this)
       * @return {!Object} this
       */
      init (callback) {
        callback.apply(this, [this])

        return this
      },

      // TODO: 添加 min、max uint256 的范围
      /**
       * Value type
       * @type {string}
       */
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
        this.setValue(val)
      },
      /**
       * value 链式方法赋值
       * @param {string} val
       * @return {Object}
       */
      setValue (val) {
        this.ether = val

        return this
      },

      /**
       * 加成
       * TODO: 所有 addition 相关的做重复处理
       * @type {number}
       */
      addition,
      get additionEther () {
        const { addition } = this

        return BN(__store__.ether).times(addition).toFixed(0)
      },
      get additionHandled () {
        const { addition } = this

        return BN(__store__.handled).times(addition).toString()
      },


      /**
       * - ether、handled 数据同步
       * - state 管理
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
        state.afterUpdate()
        this.trigger()
      },

      /**
       * - ether、handled 数据同步
       * - state 管理
       * @type {string}
       */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state, precision } = this
        // 避免空字符串赋值
        // TODO: 检查
        const result = __store__.handled = BN(val || __default__.handled).toString()

        // sync
        __store__.ether = BN(result).times(precision).toFixed(0, 1)
        this.trigger()
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
       * - value 更新后会触发的
       * @type {Function}
       */
      trigger,

      /**
       * 引用器
       * - 调用后会检查条件，再改写自身
       * @type {Function}
       */
      referrer,

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
      get additionHandledView () {
        const { additionHandled, viewDecimal } = this

        return viewMethod(additionHandled, viewDecimal)
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
      get additionView () {
        const { additionHandledView, viewDecimal, state } = this

        return state.updated
        // TODO: 淘汰 toFixed
          ? viewPrefix + formatNumber(BN(additionHandledView).toFixed(viewDecimal)) + viewSuffix
          : __default__.view
      },

      state: ModelState.create(stateParams)
    })
  }
}
