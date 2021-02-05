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

    return {
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

      state: ModelState.create()
    }
  }
}
