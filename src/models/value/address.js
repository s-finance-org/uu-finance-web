import ModelState from '../base/state'
import Web3 from 'web3'

export default {
  /**
   * - 数据关联 value -> handled -> view
   * @param {Object} opts
   * @param {Function=} opts.trigger 触发器
   * @return {!Object}
   */
  create ({
    trigger = null
  } = {}) {
    const __default__ = {
      handled: '',
      view: '-'
    }
    const __store__ = {
      handled: __default__.handled,
      isValidated: false
    }

    return {
      type: 'address',

      /**
       * IO
       * @type {string}
       */
      get value () {
        return this.handled
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
        this.handled = val

        return this
      },

      /**
       * 处理地址
       * - 转为校验和地址
       * @type {string}
       */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state } = this

        if (!Web3.utils.isAddress(val)) return false

        __store__.handled = Web3.utils.toChecksumAddress(val)
        this.trigger && this.trigger()
        state.afterUpdate()
      },

      /**
       * 是否为有效的以太坊地址
       * @type {boolean}
       */
      get isValidated () {
        const { handled } = this

        return Web3.utils.isAddress(handled)
      },

      /**
       * 触发器
       * @type {Function}
       */
      trigger,

      /** @type {string} */
      get view () {
        const { handled, state } = this

        return state.updated
          ? handled
          : __default__.view
      },

      /**
       * 重置
       */
      reset () {
        const { handled } = __default__

        this.handled = handled
        this.state.reset()
      },

      state: ModelState.create()
    }
  }
}