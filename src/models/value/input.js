import BN from 'bignumber.js'

import { formatNumber, isNaN, floor } from '../../utils'
import ModelState from '../base/state'
import ModelValueUint8 from './uint8'
import ModelValueEther from './ether'

import { MAX_INPUT } from '../helpers/constant'

import { trim } from '../../utils'

export default {
  /**
   * - 数据关联 value -> ether <-> handled <- input
   * -                              -> view
   * @param {Object=} opts.decimals 原数据的设定精度
   * @param {string=} opts.value 预设值
   * @param {string=} opts.handled 预设值
   * @param {string=} opts.input 预设值
   * @param {Object=} opts.minInput 最小输入量
   * @param {number=} opts.viewDecimal 显示内容的显示精度
   * @param {Function=} opts.viewMethod 显示内容的舍入方法
   * @param {string=} opts.viewPrefix 显示内容的前缀
   * @param {string=} opts.viewSuffix 显示内容的后缀
   * @return {!Object}
   */
  create ({
    decimals = ModelValueUint8.create(),
    value = undefined,
    handled = undefined,
    input = undefined,
    minInput = null,
    viewDecimal = 6,
    viewMethod = floor,
    viewPrefix = '',
    viewSuffix = '',
  } = {}) {
    const __default__ = {
      address: '',
      ether: '0',
      handled: '0',
      input: '',
      view: '-',
    }
    const __cache__ = {
      decimals: undefined,
      precision: undefined
    }
    const __store__ = {
      ether: __default__.ether,
      handled: __default__.handled,
      input: __default__.input
    }

    const result = {
      // TODO: 添加 min、max uint256 的范围
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
      /**
       * ether 值使用当前的 decimals 进行转换
       * @param {string} val
       * @return {string}
       */
      etherTo (val) {
        const { precision } = this

        return BN(val).div(precision).toString()
      },

      /**
       * IO
       * @type {(string|number)}
       */
      get value () {
        return this.ether
      },
      set value (val) {
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
        const { state } = this
        const result = __store__.ether = val || __default__.handled

        // sync
        __store__.handled = this.etherTo(result)
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
        const { state, precision, decimals } = this
        // 避免空字符串赋值
        let result = __store__.handled = BN(val || __default__.handled).toString()

        // sync
        __store__.ether = BN(result).times(precision).toFixed(0, 1)
        state.afterUpdate()
      },

      /**
       * input 数据
       * - 支持空格
       * @type {string}
       */
      get input () {
        return __store__.input
      },
      set input (val) {
        const { inputLimitedRe } = this
        const result = val

        // 仅限为数值和空格
        if ((!isNaN(result) && inputLimitedRe.test(result)) || result === '') {
          this.handled = __store__.input = result
        }
      },
      /**
       * 输入正则限制
       * @type {RegExp}
       */
      inputLimitedRe: /^[0-9]*(\.[0-9]*)?$/,
      /**
       * input 视觉值
       * - 主动式更新
       * @type {string}
       */
      get inputView () {
        const { input } = this
        let result = ''

        if (input !== '') {
          result = formatNumber(input)
        }

        return result
      },

      /**
       * 是否为焦点
       * @type {boolean}
       */
      isFocus: false,

      /**
       * 最小输入值
       * @type {Object}
       */
      // TODO: 这里的数据同步更新（精度），可能还有问题
      minInput: minInput || ModelValueEther.create({ decimals }),
      /**
       * 最大输入值
       * @type {string}
       */
      maxInput: MAX_INPUT,
      /**
       * 重置最大输入值
       */
      resetMaxInput () {
        this.maxInput = MAX_INPUT
      },

      /**
       * input 数据是否有效
       * - 先更新 input 再调用
       * - TODO: 支持空格的、不支持空格的2种
       * @type {boolean}
       */
      get isValidInput () {
        const { input, minInput, maxInput, isEmptyInput } = this
        let result = true

        // 允许初始空格
        if (isEmptyInput) return result

        const bnInput = BN(input)

        // 不为isNaN，且大于最小值、小于等于最大值
        result = !bnInput.isNaN()
          && bnInput.gt(minInput.handled)
          && bnInput.lte(maxInput)

        return result
      },

      /**
       * input 是否为空
       * @type {boolean}
       */
      get isEmptyInput () {
        const { input } = this

        return input === ''
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
      /** @type {string} */
      get view () {
        const { viewDecimal, state, handledView } = this

        return state.updated
        // TODO: 淘汰 toFixed
          ? viewPrefix + formatNumber(BN(handledView).toFixed(viewDecimal)) + viewSuffix
          : __default__.view
      },

      state: ModelState.create()
    }

    // TODO: 使用 set 来完成
    // 预设
    value != null
      && (result.value = value)
    handled != null
      && (result.handled = handled)
    input != null
      && (result.input = input)

    return result
  }
}