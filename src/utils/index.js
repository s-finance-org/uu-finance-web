
export const nativeDate = Date

/**
 * ES5.1 时支持 Date.now
 * 自 UNIX 纪元开始（1970 年 1 月 1 日 00:00:00 (UTC)）到当前时间的毫秒
 * @type {Function}
 */
const nativeNow = nativeDate.now

/**
 * 获得当前的毫秒时间戳
 * @return {number}
 */
export const now = nativeNow

export const nativeNavigator = navigator

export const nativeUserAgent = nativeNavigator.userAgent

export const isIOS = /iPhone|iPad|iPod/.test(nativeUserAgent)
export const isAndroid = /Android/.test(nativeUserAgent)
export const isBlackBerry = /BlackBerry/.test(nativeUserAgent)
export const isWindowsPhone = /Windows Phone/.test(nativeUserAgent)

export const isMobile = isIOS || isAndroid || isBlackBerry || isWindowsPhone

/**
 * 返回表示用户偏好语言的字符串(浏览器 UI 语言)
 * - 只读
 * - 一般大小写结合，部分环境为小写
 * @see {@link https://developer.mozilla.org/docs/Web/API/NavigatorLanguage/language}
 * @type {string}
 */
export const nativeNavigatorLanguage = nativeNavigator.language

/**
 * 是否为数组类型
 * - true  array、Array.prototype
 * @param {*} val
 * @return {boolean}
 */
export const isArray = Array.isArray // IE9+，ES5.1

/**
 * 是否为类对象
 * - true  对象、regexp、函数对象的其他对象，array、除宿主
 * - false function、null、undefined及其他基础数据类型 * @static
 * @param  {*} val
 * @return {boolean}
 */
export const isObjectLike = val => !!val && typeof val === 'object'

const ObjectProto = Object.prototype

export const hasOwn = ObjectProto.hasOwnProperty

/**
 * 遍历集合
 * - 对于 null、undefined 不做任何处理
 * @param  {Object|Array|undefined} obj
 * @param  {Function} callback  callback( val, idx/key, arr/obj )
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

// kebabCase
export const rsHyphenate = /\B([A-Z])/g

/**
 * 将一个字符串转换为 kebab-case(短横线隔开式)
 * - 支持将 PascalCase、camelCase 转换
 * - 所有字母小写
 * @param {string} str
 * @return {string}
 */
export const kebabCase = str => str.replace(rsHyphenate, '-$1').toLowerCase()

/**
 * 格式化千位符
 * TODO: 待优化
 * @param {number|string} val
 * @return {string}
 */
export const formatNumber = val => {
  const list = (val + '').split('.')
  const prefix = list[0].charAt(0) === '-' ? '-' : ''
  let num = prefix ? list[0].slice(1) : list[0]
  let result = ''

  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`
    num = num.slice(0, num.length - 3)
  }

  if (num) {
    result = num + result
  }

  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
}