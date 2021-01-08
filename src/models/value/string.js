import ModelState from '../base/state'

export default {
  /**
   * @param {Object} opts
   * @param {string|number=} opts.value
   * @return {!Object}
   */
  create ({
    value = '',
  } = {}) {
    // 缺省值
    const __default__ = {
      handled: '',
      view: '-'
    }
    const __store__ = {
      handled: __default__.handled,
      view: __default__.view
    }

    return {
      type: 'string',

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

      /** @type {string} */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state } = this

        __store__.handled = val + ''

        state.afterUpdate()
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