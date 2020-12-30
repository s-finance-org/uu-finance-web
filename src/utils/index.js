/**
 * ES5.1 时支持 Date.now
 * 自 UNIX 纪元开始（1970 年 1 月 1 日 00:00:00 (UTC)）到当前时间的毫秒
 * @type {Function}
 */
const nativeNow = Date.now

/**
 * 获得当前的毫秒时间戳
 * @return {number}
 */
export const now = nativeNow

export const nativeUserAgent = navigator.userAgent

export const isIOS = /iPhone|iPad|iPod/.test(nativeUserAgent)
export const isAndroid = /Android/.test(nativeUserAgent)
export const isBlackBerry = /BlackBerry/.test(nativeUserAgent)
export const isWindowsPhone = /Windows Phone/.test(nativeUserAgent)

export const isMobile = isIOS || isAndroid || isBlackBerry || isWindowsPhone

/**
 *  是否为数组类型
 *  - true  array、Array.prototype
 *  @param {*} val
 *  @return {boolean}
 */
export const isArray = Array.isArray // IE9+，ES5.1

/**
 *  是否为类对象
 *  - true  对象、regexp、函数对象的其他对象，array、除宿主
 *  - false function、null、undefined及其他基础数据类型 *  @static
 *  @param  {*} val
 *  @return {boolean}
 */
export const isObjectLike = val => !!val && typeof val === 'object'

const ObjectProto = Object.prototype

export const hasOwn = ObjectProto.hasOwnProperty

/**
 *  遍历集合
 *  - 对于 null、undefined 不做任何处理
 *  @param  {Object|Array|undefined} obj
 *  @param  {Function} callback  callback( val, idx/key, arr/obj )
 */
export const forEach = (obj, callback) => {
  if (obj == null) return false

  // 将非对象类型转为对象
  if (!isObjectLike(obj)) {
    obj = [obj]
  }

  if (isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      callback.call(null, obj[i], i, obj)
    }
  } else {
    for (const key in obj) {
      if (hasOwn.call(obj, key)) {
        callback.call(null, obj[key], key, obj)
      }
    }
  }
}

/**
 * 字符串脱敏
 * @param {string} val
 * @param {number=} [opts.prePlainLength]
 * @param {number=} [opts.postPlainLength]
 * @param {number=} [opts.maskLength]
 * @param {string=} [opts.maskSymbol]
 * @return {string}
 */
export const desensitize = (
    val,
    { prePlainLength = 2,
      postPlainLength = 2,
      maskLength = 4,
      maskSymbol = '*'
    } = {}
  ) => {
  const reg = new RegExp(`(.{${prePlainLength}})(.*)(.{${postPlainLength}})`)
  return val.replace(
    reg,
    (match, before, maskPart, after) => {
      return `${before}${maskLength > 0 ? maskSymbol.repeat(maskLength) : maskPart.split('').map(() => maskSymbol).join('')}${after}`
    }
  )
}

/**
 * 地址缩短器
 * @param {string} val
 * @return {string}
 */
export const addressShortener = val => desensitize(val, { prePlainLength: 6, postPlainLength: 4, maskLength: 3, maskSymbol: '.' } )