import storeWallet from '../../store/wallet'

export default {
  create () {
    const __default__ = {
      
    }
    const __store__ = {
      value: '',
      bytes: '0x0000000000000000000000000000000000000000000000000000000000000000',
      view: '-'
    }

    return {
      type: 'bytes32',

      /** @type {boolean} */
      loading: true,
      beforeUpdate () {
        this.loading = true
      },
      afterUpdate () {
        this.loading = false
      },

      /** @type {string} */
      get value () {
        return __store__.value
      },
      set value (val) {
        const result = __store__.value = val

        this.bytes = result
      },

      /** @type {string} */
      get bytes () {
        return __store__.bytes
      },
      set bytes (val) {
        __store__.bytes = val

        this.afterUpdate()
      },

      /** @type {string} */
      get view () {
        const { bytes, loading } = this
        let result = ''

        if (!loading) {
          result = __store__.view = storeWallet.web3.utils.toAscii(bytes)
        }

        return result
      }
    }
  }
}
