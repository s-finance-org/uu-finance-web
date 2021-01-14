import ModelState from '../base/state'

/** @type {number} */
const MIN_VALUE = 0
/** @type {number} */
const MAX_VALUE = 255

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
      handled: 0,
      view: '-'
    }
    const __store__ = {
      handled: __default__.handled,
    }

    const result = {
      type: 'uint8',

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
        const { state } = this
        const result = +val

        // 限制在范围内
        if (MIN_VALUE <= result && result <= MAX_VALUE) {
          __store__.handled = result
          state.afterUpdate()
        } else {
          console.error(`[ERROR] Out of range: ${result}`)
        }
      },

      /** @type {string} */
      get view () {
        const { handled, state } = this

        return state.updated
          ? handled + ''
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
