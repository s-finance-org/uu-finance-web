import notify from '../../store/notify'

export default {
  /**
   * @param {number=} opts.autoDismiss 消息展现时长（毫秒）
   * @return {!Object}
   */
  create ({
    autoDismiss = 4500
  } = {}) {
    const __default__ = {
      message: ''
    }
    const __store__ = {
      message: __default__.message,
      // dismissCountDown: 0
    }

    return {
      // get hasMessage () {
      //   const { message } = this

      //   return !!message
      // },

      /**
       * 错误正文
       * @type {string}
       */
      get message () {
        return __store__.message
      },
      set message (val) {
        const result = __store__.message = val

        this.dismiss()
      },

      /**
       * 消息展现时长（毫秒）
       * @type {number}
       */
      autoDismiss,

      /**
       * 清除
       */
      dismiss () {
        // TODO:

        // 初始化
        __store__.message = __default__.message
      },

      /**
       * 处理错误
       * @param {Object} err
       */
      handler (err) {
        // TODO: 如果能带 notify.notification 所产生的 update，则带入
        if (!err) return false

        if (err.message && err.message.length < 100) {
          this.message = err.message
        }

        if(err.name === 'EthAppPleaseEnableContractData'
            || err.message.includes('insufficient')) {
          notify.updateError({
            message: err.message,
            type: 'error'
          })
        }
      }

      // get dismissCountDown () {
      //   return __store__.dismissCountDown
      // },
      // set dismissCountDown (val) {
      //   const result = __store__.dismissCountDown = val

      //   if (result === 0) {
      //     __store__.message = ''
      //   }
      // }
      // countDownChanged (val) {
      //   __store__.dismissCountDown = val
      // },
    }
  }

}