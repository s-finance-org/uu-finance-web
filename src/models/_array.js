import ModelState from './base/state'

export default {
  /**
   * @param {Object} opts
   * @param {string|number} opts.value 预设值
   * @return {!Object}
   */
  create ({
    value = undefined,
  } = {}) {
    const __default__ = {
      handled: '',
      view: '-'
    }
    const __store__ = {
      handled: __default__.handled
    }

    const result = {
      type: 'string',

      /**
       * IO
       * @type {string|number}
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

        return state.updated
          ? handled
          : __default__.view
      },

      state: ModelState.create()
    }

    // 预设
    value != undefined
      && (result.value = value)

    return result
  }
}