import ModelState from '../base/state'

export default {
  /**
   * - 数据关联 value -> handled -> view
   * @param {Object} opts
   * @param {Promise=} opts.trigger 触发器
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

      /** @type {string} */
      // TODO: 功能 https://piyolab.github.io/sushiether/RunScrapboxCode/?web3=1.0.0-beta.33&code=https://scrapbox.io/api/code/sushiether/web3.js_-_Ethereum_%E3%81%AE%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%82%B5%E3%83%A0%E4%BB%98%E3%81%8D%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B/demo.js
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state } = this

        __store__.handled = val
        // TODO: 校验地址，合法才存入
        this.isValid = true

        this.trigger && this.trigger()

        state.afterUpdate()
      },

      /**
       * 是否有效
       * @type {boolean}
       */
      isValid: false,

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

      state: ModelState.create()
    }
  }
}