import BN from 'bignumber.js'
import { reactive } from 'vue'

import { formatNumber, floor } from '../../utils'
import ModelState from '../base/state'
import ModelValueUint8 from './uint8'

import swaps from '../../store/swaps'

export default {
  /**
   * @param {number=} opts.amount 查询时的参考数量
   * @param {string=} opts.source 价格来源，默认 coingecko
   *                  - coingecko API 查询 TODO: 需找到对应 key
   *                  - uniswapV2Router2 合约查询，需在 uniswap 上有
   * @return {@Object}
   */
  create ({
    targetToken = {},
    chargeToken = null,
    amount = 1,
    source = 'coingecko',
    decimals = ModelValueUint8.create(),
    viewDecimal = 6,
    viewMethod = floor,
    viewPrefix = '',
    viewSuffix = '',
    trigger = () => new Promise((resolve, reject) => {}),
    stateParams = {}
  } = {}) {
    const __default__ = {
      address: '',
      ether: '0',
      handled: '0',
      view: '-',
    }
    const __cache__ = {
      decimals: undefined,
      precision: undefined
    }
    const __store__ = {
      ether: __default__.ether,
      handled: __default__.handled
    }

    // TODO: 1DAI = x.xx USDT 这里换算精度是 计价币
    decimals = chargeToken.decimals

    const result = ({
      /**
       * 初始化列队
       */
      initiateSeries () {
        switch (source) {
          case 'uniswapV2Router2':
            swaps.uniswapV2Router2.getPrice(
              this,
              targetToken,
              chargeToken
            )
            break
            // TODO: 要支持 coingecko
            // case 'coingecko':

          default:
        }
      },

      /**
       * 链式方法初始事件
       * - this 指为根
       * @param {Function} callback(this)
       * @return {!Object} this
       */
      init (callback) {
        callback.apply(this, [this])

        return this
      },

      // TODO: 添加 min、max uint256 的范围
      /**
       * Value type
       * @type {string}
       */
      type: 'uint256',

      /** @type {Object} */
      decimals,
      // TODO: 设为通用方法
      /** @type {number} */
      get precision () {
        const { decimals } = this
        let result = __cache__.precision

        // 没变动则从缓存获取
        if (__cache__.decimals !== decimals.handled) {
          __cache__.decimals = decimals.handled
          result = __cache__.precision = Math.pow(10, decimals.handled)
        }

        return result
      },

      setValue (val) {
        this.ether = val
      },

      /**
       * - ether、handled 数据同步
       * @type {string}
       */
      get ether () {
        return __store__.ether
      },
      set ether (val) {
        const { state, precision } = this
        const result = __store__.ether = val || __default__.ether

        // sync
        __store__.handled = BN(result).div(precision).toString()
        this.trigger()
        state.afterUpdate()
      },

      /**
       * - ether、handled 数据同步
       * - 允许
       * @type {string}
       */
      get handled () {
        return __store__.handled
      },
      set handled (val) {
        const { state, precision } = this
        // 避免空字符串赋值
        // TODO: 检查
        const result = __store__.handled = BN(val || __default__.handled).toString()

        // sync
        __store__.ether = BN(result).times(precision).toFixed(0, 1)
        // TODO: 必须是方法
        this.trigger()
        state.afterUpdate()
      },

      /**
       * 触发器
       * @type {Function}
       */
      trigger,

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
        const { handledView, viewDecimal, state } = this

        return state.updated
        // TODO: 淘汰 toFixed
          ? viewPrefix + formatNumber(BN(handledView).toFixed(viewDecimal)) + viewSuffix
          : __default__.view
      },

      state: ModelState.create(stateParams)
    })

    // TODO: 是否还有很好的方案
    result.initiateSeries()
    return result
  }
}
