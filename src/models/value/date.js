import BN from 'BN.js'

import { formatNumber } from '../../utils'
import { floor } from '../../utils/math/round'

const ModelValueDate = {
  /**
   * @return {!Object}
   */
  create ({
    handled = undefined,
    contDecimal = 4,
    contDefault = '-',
    contMethod = floor
  } = {}) {
    const __store__ = {
      handled: '',
      cont: contDefault
    }

    const model = {
      /** @type {boolean} */
      loading: true,
      _update () {
        const { loading } = this

        // init
        if (loading) {
          this.loading = false
        }
      },

      /**
       * Universal data
       * @type {(string|number)}
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
        __store__.handled = val

        this._update()
      },

      contDecimal,
      /** @type {string} */
      get cont () {
        const { handled, contDecimal, loading } = this

        if (!loading) {
          __store__.cont = formatNumber(contMethod(handled, contDecimal))
        }

        return __store__.cont
      }
    }

    return model
  }
}

export default ModelValueDate
