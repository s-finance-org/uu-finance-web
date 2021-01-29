import BN from 'bignumber.js'

import { formatNumber, floor } from '../../utils'

import ModelState from '../base/state'
import ModelValueUint8 from './uint8'
import storeWallet from '../../store/wallet'

/**
 * 钱包数据模型
 */
export default {
  /**
   * - 数据关联 storeWallet.address -> address -> ether -> handled -> handledView -> view
   * @param {Object} opts
   * @param {Object=} opts.decimals 原数据的设定精度
   * @param {number=} opts.viewDecimal 显示内容的显示精度
   * @param {Function=} opts.viewMethod 显示内容的舍入方法
   * @param {string=} opts.viewPrefix 显示内容的前缀
   * @param {string=} opts.viewSuffix 显示内容的后缀
   * @param {Function=} opts.trigger 触发器
   * @return {!Object}
   */
  create ({
    decimals = ModelValueUint8.create(),
    viewDecimal = 6,
    viewMethod = floor,
    viewPrefix = '',
    viewSuffix = '',
    trigger = () => new Promise((resolve, reject) => {}),
  } = {}) {
    // 缺省值
    const __default__ = {
      address: '',
      ether: Array(decimals.handled).fill(0).join(''),
      handled: '0',
      view: '-',
    }
    const __store__ = {
      address: __default__.address,
      ether: __default__.ether,
    }

    return {
      /** @type {Object} */
      decimals,
      // TODO: 可考虑给 precision 加缓存，但会因为还未初始 token decimals 完成前产生无效的初始数据，要做区分
      /** @type {number} */
      get precision () {
        const { decimals } = this

        return Math.pow(10, decimals.handled)
      },



      /**
       * 钱包地址
       * - 自动关联钱包数据
       * @type {string}
       */
      get address () {
        // NOTE: 这里不 { state } = this 先调用，是 state 的变更会再次触发本流程
        const result = storeWallet.address.handled

// TODO: 在获取第一次数据成功后，再次获取则不会 trigger()，如果用户交易完成（block），则对应值应该更新
        // 有效
        if (storeWallet.isValidated) {
          // 与上一个地址不同时才继续
          if (__store__.address !== result
              // 数据已经过期，且不在 busy 中
              || this.state.isExpired && !this.state.busy) {
            this.state.beforeUpdate()

            // sync
            __store__.address = result

            this.trigger &&
              this.trigger(result)
                .then(data => {
                  console.log('[update] --------- wallet ether:')
                  // sync
                  this.ether = data
                  this.state.afterUpdate()
                })
          }
        } else {
          // 当钱包没连接、断开时
          __store__.address = result

          // 重置
          this.state.reset()
        }

        return result
      },

      /**
       * 触发器
       * @type {Function}
       */
      trigger,

      /** @type {string} */
      get ether () {
        const { address, state } = this

        return state.initialized
          ? __store__.ether
          : __default__.ether
      },
      set ether (val) {
        this.setEther(val)
      },
      /**
       * ether 链式方法赋值
       * @param {string} val
       * @return {Object}
       */
      setEther (val) {
        __store__.ether = val

        return this
      },

      /**
       * 处理的数据
       * - 主动式更新
       * @type {string|number}
       */
      get handled () {
        const { ether, precision, state } = this

        return state.initialized
          ? BN(ether).div(precision).toString()
          : __default__.handled
      },

      viewDecimal,
      viewMethod,
      viewPrefix,
      viewSuffix,
      /**
       * 视觉处理值
       * - view 的可用数值
       * @type {string}
       */
      get handledView () {
        const { handled, viewDecimal } = this

        return viewMethod(handled, viewDecimal)
      },
      /**
       * 视觉格式化的数据
       * - 格式化
       * @type {string}
       */
      get view () {
        const { state, handledView } = this

        return state.updated
          ? viewPrefix + formatNumber(handledView) + viewSuffix
          : __default__.view
      },

      // 钱包数据有效期
      state: ModelState.create({ expireSec: 5 })
    }
  }
}
