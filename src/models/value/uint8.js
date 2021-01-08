import ModelState from '../base/state'

export default {
  /**
   * @param {Object} opts
   * @param {string|number=} opts.value
   * @return {!Object}
   */
  create ({
    value = 0,
  } = {}) {
    // 缺省值
    const __default__ = {
      handled: 0,
      view: '-'
    }
    const __store__ = {
      handled: __default__.handled,
      view: __default__.view
    }

    return {
      type: 'uint8',

      /** @type {number} */
      min: 0,
      /** @type {number} */
      max: 255,

      /**
       * IO
       * @type {string}
       */
      get value () {
        return this.handled
      },
      set value (val) {
        this.handled = val
      },

      /** @type {string|number} */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { min, max, state } = this
        const result = +val
// TODO: 限制在范围内，并提示错误，并修正
        if (min <= result && result <= max) {
          __store__.handled = result

          state.afterUpdate()
        }
      },

      /** @type {string} */
      get view () {
        const { handled, state } = this
        let result = __default__.view

        if (state.updated) {
          result = __store__.view = handled + ''
        }

        return result
      },

      state: ModelState.create()
    }
  }
}
