import ModelState from '../base/state'

/** @type {number} */
const MIN_VALUE = 0
/** @type {number} */
const MAX_VALUE = 255

export default {
  /**
   * @return {!Object}
   */
  create () {
    const __default__ = {
      handled: 0,
      view: '-'
    }
    const __store__ = {
      handled: __default__.handled,
    }

    return {
      type: 'uint8',

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
  }
}
