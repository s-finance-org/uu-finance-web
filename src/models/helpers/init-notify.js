import Notify from 'bnc-notify'

import i18n from '../../i18n'
import { NETWORK_ID } from './constant'

export default {
  /**
   * @param {Object} opts
   * @param {string} opts.dappId
   * @param {number|string=} opts.networkId 当前配置的网络 ID，默认从 .env 中获取
   * @return {!Object}
   */
  create ({
    dappId,
    networkId = NETWORK_ID
  } = {}) {
    networkId = +networkId

    // TODO: notify 要支持 i18n 自动变更和自定义 https://docs.blocknative.com/notify#i-18-n
    /**
     * @see {@link https://docs.blocknative.com/notify}
     * @type {Object}
     */
    const notify = Notify({
      dappId,
      networkId,
      desktopPosition: 'topRight',
    })

    return {
      /**
       * @param {string} hash
       */
      handler (hash) {
        const { emitter } = notify.hash(hash)

        emitter.on('all', transaction => ({
            onclick () {(window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank', 'noopener, norefferer'))}
          })
        )
      },

      /**
       * @param {Object} opts
       * @param {string=} opts.eventCode
       * @param {string=} opts.type 'hint' (gray), 'pending' (yellow), 'success' (green), 'error' (red)
       * @param {string=} opts.message
      //  * @param {number=} opts.autoDismiss 消息展现时长（毫秒）,0 则不自动消失
       * @return {!Object}
       */
      notification ({
        eventCode = 'notification',
        type = 'pending',
        message = '',
        autoDismiss = 0
      } = {}) {
        return notify.notification({
          eventCode,
          type,
          message,
          autoDismiss
        })
      },

      /**
       * update() 为 err
       * @param {Object} opts
       * @param {Object=} opts.update target
       * @param {string=} opts.message
       * @param {string=} opts.code 错误码，对应 i18n.error
       * @param {number=} opts.autoDismiss 消息展现时长（毫秒）
       */
      updateError ({
        update = null,
        message = '',
        code = '',
        autoDismiss = 4500
      } = {}) {
        
        const type = 'error'
        // i18n 内无对应信息，则使用 message
        // TODO: 要支持 i18n
        message = i18n.$i18n.global.t(`error.${code}`) || message

        const opts = {
          type,
          message,
          autoDismiss
        }

        update
          ? update(opts)
          // 无则创建
          : this.notification(opts)
      }
    }
  }
}