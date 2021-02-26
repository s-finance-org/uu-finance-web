
const MAX_SAFE_PRECISION_LENGTH = 292

export const ObjectProto = Object.prototype
export const ObjectToString = ObjectProto.toString
const hasOwnProperty = ObjectProto.hasOwnProperty

/**
 * 检查对象是否有该 key
 * @param {Object} obj
 * @param {string} key
 * @return {boolean}
 */
export const hasOwn = (obj, key) => hasOwnProperty.call(obj, key)

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

/* Window */
export const hasWindowSupport = typeof window !== 'undefined'

/**
 * 原生 window
 * @type   {Object}
 */
export const nativeWindow = hasWindowSupport ? window : {}
export const nativeLocation = nativeWindow.location || {}

/**
 * 是否为数组类型
 * - true array、Array.prototype
 * @param {*} val
 * @return {boolean}
 */
export const isArray = Array.isArray // IE9+，ES5.1

/**
 * 是否为类对象
 * - true 对象、regexp、函数对象的其他对象，array、除宿主
 * - false function、null、undefined及其他基础数据类型 * @static
 * @param {*} val
 * @return {boolean}
 */
export const isObjectLike = val => !!val && typeof val === 'object'

/**
 * 遍历集合
 * - 对于 null、undefined 不做任何处理
 * @param {Object|Array|undefined} obj
 * @param {Function} callback callback( val, idx/key, arr/obj )
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
      if (hasOwn(obj, key)) {
        callback.call(null, obj[key], key, obj)
      }
    }
  }
}

export const nativeObjectKeys = Object.keys

/**
 * 返回由对象自身可枚举属性名的数组
 * - 如果不符合条件，则返回空数组
 * @param {*} val
 * @return {!Array}
 */
export const keys = val =>
  // NOTE: 解决 ES5 中 原生 Object.keys() 不会强制转换为 Object 的现象
  nativeObjectKeys(Object(val))

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
 * 转为指定小数位数的数字字符串
 * - 默认 round，而非原生的四舍五入
 * @param {string|number} num
 * @param {number=} precision
 * @return {string}
 */
// TODO: 针对超大数的支持
export const toFixed = (num, precision, method = round) => method(num, precision).toFixed(precision)

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

/**
 * 获得内置类型名称
 * @param	{*} val
 * @return {string}
 */
export const baseTag = val => ObjectToString.call(val)

/**
 * 是否是一个原型对象
 * 	- 纯 js 对象
 * @param {*} val
 * @return {boolean}
 */
export const isPlainObject = val => baseTag(val) === '[object Object]'

/**
 * 转为字符串
 * - undefined、null 转为 ''
 * - 对象和数组被转为 JSON 字符串
 * @param {*} val
 * @param {number} [spaces]  指定 JSON 缩进用的空白字符串
 * @return {!string}
 */
export const toString = (val, spaces = 2) =>val == null
  ? ''
  : isArray(val) || (isPlainObject(val) && val.toString === ObjectToString)
    ? JSON.stringify(val, null, spaces)
    : String(val)

/**
 * 移除首尾的空格并返回字符串
 * @param  {*} val
 * @return {!string}
 */
export const trim = val => toString(val).trim() // ES5.1

/**
 * 是否为数字类型
 * - true  数字、16进制、科学计数、小数点、负数、Infinity、NaN
 * - 这里不能把 NaN 判定为 false
 * - 按照 `ToNumber` 官方设定，undefined 会转为 NaN
 * - 而如果这里把 NaN 判定不为数值，则不符合转换
 * @param {*} val
 * @return {boolean}
 */
export const isNumber = val => typeof val === 'number'

export const nativeIsNaN = window.isNaN

/**
 * 是否为 NaN
 * - 这里的定义会出现混淆，优先按照标准
 * - true  NaN、Number.NaN、0 / 0
 * - false 空数组、空字符串、对象、null、布尔值、undefined、数字、16进制、科学计数、小数点、负数、Infinity、数字字符串
 * - isNaN与isNumeric的区别，在于[ 0 ]、Infinity、'2017/04/10'、'2017-04-10'会被 isNaN 认为是数字，而 isNumeric 认为不是
 * - 不能用 ==、=== 来判断是否为 NaN
 * - val !== val 为 true 的表达式，只有NaN
 * - Number.isNaN不会强制将参数转换成数字，只有在参数是真正的数字类型，且值为 NaN 的时候才会返回 true
 * - 对 Map、Set 等类型判定为 false
 * @see http://www.ecma-international.org/ecma-262/6.0/#sec-isnan-number|isNaN
 * @param {*} val
 * @return {boolean}
 */
export const isNaN = val => isNumber(val) && nativeIsNaN(val)

/**
 * 转整数
 * @param {*} val
 * @return {number}
 */
export const toInteger = val => parseInt(val, 10)

/**
 * baseClamp
 * @param {number} num
 * @param {number=} lower
 * @param {number=} upper
 * @return {number}
 */
function baseClamp (num, lower, upper) {
  if (num === num) {
    lower !== undefined
      && num < lower
      && (num = lower, 1)
    || upper !== undefined
      && num > upper
      && (num = upper)
  }

  return num
}

/**
 * @param {number} precision
 * @return {number}
 */
function baseRevisePrecision (precision) {
  return baseClamp(precision, -MAX_SAFE_PRECISION_LENGTH, MAX_SAFE_PRECISION_LENGTH)
}

/**
 * - lodash
 * @see {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/round}
 * @param {string} methodName ceil、floor、round
 * @return {Function(number,number):number}
 */
export const baseRound = (methodName) => {
  var func = Math[methodName]

  return (num, precision = 0) => {
    precision = baseRevisePrecision(toInteger(precision))
    if (precision) {
      let pair = `${num}e`.split('e')
      const val = func(`${pair[0]}e${+pair[1] + precision}`)

      pair = `${val}e`.split('e')
      return +`${pair[0]}e${+pair[1] - precision}`
    }

    return func(num)
  }
}

/**
 * 向上舍入
 * @param {string|number} num
 * @param {number=} precision
 * @return {number}
 */
export const ceil = baseRound('ceil')

/**
 * 向下舍入
 * @param {string|number} num
 * @param {number=} precision
 * @return {number}
 */
export const floor = baseRound('floor')

/**
 * 四舍五入
 * @param {string|number} num
 * @param {number=} precision
 * @return {number}
 */
export const round = baseRound('round')

/**
 * 是否为字符串类型
 * @param {*} val
 * @return {boolean}
 */
export const isString = val => typeof val === 'string'

/**
 * 空对象
 * - 不继承原型
 * - #TODO: name
 * @return {!Object}
 */
export const emptyObject = () => Object.create(null)

/**
 * 分割字符
 * - 必须要有一个分割符
 * @see split-on-first
 * @param {*} string
 * @param {*} separator
 * @return {!Array}
 */
export const splitOnFirst = (string, separator) => {
  const result = []

  if (!(isString(string) && isString(separator))
    || string === ''
    || separator === ''
  ) return result

  // 是否存在
  const separatorIndex = string.indexOf(separator)

  if (separatorIndex === -1) return result

  return [
    string.slice(0, separatorIndex),
    string.slice(separatorIndex + separator.length)
  ]
}

/**
 * Uri解析
 * @see query-string
 * @param {*} query 查询的字符串
 * @param {Object} opts
 * @param {boolean=} opts.decode 是否解码
 * @param {boolean=} opts.parseNumbers 如果 value 是数值类型，则解析为数值类型，而不是字符串类型
 * @param {boolean=} opts.parseBooleans 如果 value 是布尔类型，则解析为布尔类型，而不是字符串类型
 * @return {!Object}
 */
export const queryUriParse = (query, {
  decode = true,
  parseNumbers = false,
  parseBooleans = false
} = {}) => {
  // TODO:
  function parseValue (value) {
    if (parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
      value = Number(value)
    } else if (parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
      value = value.toLowerCase() === 'true'
    }

    return value
  }

  const result = emptyObject()

  if (!isString(query)) return result

  query = query.trim().replace(/^[?#&]/, '')

  if (!query) return result

  for (const param of query.split('&')) {
    if (param === '') continue

    let [key, value] = splitOnFirst(decode ? param.replace(/\+/g, ' ') : param, '=')

    key = decode
      ? decodeURIComponent(key)
      : key

    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    value = value === undefined
      ? null
      : decode
        ? decodeURIComponent(value)
        : value

    if (result[key] === undefined) {
      result[key] = value
    } else {
      result[key] = [].concat(result[key], value)
    }
  }

  for (const key of keys(result)) {
    const value = result[key]
    // TODO:
    if (typeof value === 'object' && value !== null) {
      for (const k of keys(value)) {
        value[k] = parseValue(value[k])
      }
    } else {
      result[key] = parseValue(value)
    }
  }

  return result
}

/**
 * 目标对象弥补缺省值
 * - 浅拷贝
 * - 目标属性为 null、undefined 才弥补
 * @param {Object=} target
 * @param {Object=} defs 缺省对象
 * @return {!Object}
 */
export const defaults = (target = {}, defs = {}) => {
  var key
  // TODO: 
  // 非原型属性
  for (key in defs) {
    if (hasOwn(defs, key)) {
      // 目标属性为 null、undefined
      if (target[key] == null) target[key] = defs[key]
    }
  }

  return target
}

/**
 * baseArrayEach
 * - 可断言的 forEach
 * @param {Array} arr
 * @param {!Function} iteratee 迭代器
 * @return {Array} 返回自身
 */
function baseArrayEach (arr, iteratee) {
  const len = arr.length
  let idx = 0

  while (idx < len) {
    if (iteratee(arr[idx], idx++, arr) === false) {
      break
    }
  }

  return arr
}



export const nativeSessionStorage = nativeWindow.sessionStorage
export const nativeLocalStorage = nativeWindow.localStorage
export const nativeJsonStringify = JSON.stringify
export const nativeJsonParse = JSON.parse

/**
 * baseStorage
 * @param {Object} storage
 * @return {!Object}
 */
function baseStorage (storage) {
  return {
    /**
     * 写入
     * @param {(Object|string)} key
     * @param {*} val
     */
    set (key, val) {
      if (typeof key === 'object') {
        const arr = keys(key)
        let val = ''
        let idx = arr.length

        while (idx--) {
          val = nativeJsonStringify(key[arr[idx]])
          // 排除 undefined、null
          storage.setItem(arr[idx], val != null ? val : '')
        }
      } else {
        storage.setItem(key, nativeJsonStringify(val))
      }
    },

    /**
     * 读取
     * - 需要注意，获取时要 .data 才是最终数据
     * @param {(Object|string)} key
     * @return {*}
     */
    get (key) {
      let val = ''

      if (isArray(key)) {
        const result = {}
        let idx = key.length
        let sub = ''

        while (idx--) {
          sub = key[idx]
          val = nativeJsonParse(storage.getItem(sub))

          result[sub] = val != null ? val : ''
        }
        return result
      } else {
        val = nativeJsonParse(storage.getItem(key))

        return val != null ? val : ''
      }
    },

    /**
     * 删除指定的 key
     * @param {(Array|string)} key
     */
    remove (key) {
      if (Array.isArray(key)) {
        baseArrayEach(key, storage.removeItem)
      } else {
        storage.removeItem(key)
      }
    },

    /**
     * 清掉对应 storage 的所有缓存
     */
    clear () {
      storage.clear()
    }
  }
}

export const localStorage = baseStorage(nativeLocalStorage)
export const sessionStorage = baseStorage(nativeSessionStorage)

// /**
//  * 请求
//  * @type {!Object}
//  */
// export const request =  {
//   // TODO: defaults
//   __req (method, originalUrl, params = {}, {
//     cache = 'no-cache',
//     credentials = 'same-origin',
//     headers = {
//       'content-type': 'application/json'
//     },
//     mode = 'cors',
//     redirect = 'follow',
//     referrer = 'no-referrer'
//   } = {}) {
//     const opts = {
//       /**
//        * - *default, no-cache, reload, force-cache, only-if-cached
//        */
//       cache,
//       /**
//        * - include, same-origin, *omit
//        */
//       credentials,
//       headers: new Headers({
//         'Content-Type': 'application/json'
//       }),
//       /**
//        * - *GET, POST, PUT, DELETE, etc
//        */
//       method,
//       /**
//        * - no-cors, cors, *same-origin
//        */
//       mode,
//       /**
//        * - manual, *follow, error
//        */
//       redirect,
//       /**
//        * - *client, no-referrer
//        */
//       referrer
//     }
//     let isCacheExpired = false
//     let url = originalUrl

//     switch (method) {
//       case 'POST':
//         opts.body = JSON.stringify(params)
//         break
//       case 'GET':
//       default:
//         var reQueryString = /\?/
//         url = originalUrl + (reQueryString.test(originalUrl) ? '&' : '?') + '_=' + now()
//     }

//     // 是否有配置缓存
//     if (this._cacheExpire > 0) {
//       // NOTE: params 内不应含有带时效性强的时间戳等值
//       // TODO: 未支持语言 locale
//       const name = `__${method}_${JSON.stringify(params)}_${originalUrl}`
//       const ls = localStorage.get(name)

//       this._cacheName = name
//       if (ls && ls['__EXPIREDATE__'] > now()) {
//         return new Promise((resolve, reject) => {
//           resolve(ls.data)
//         })
//       } else {
//         isCacheExpired = true
//       }
//     }

//     return fetch(url, opts)
//       .then(response => response.json())
//       .then(data => {
//         if (isCacheExpired) {
//           const timestamp = now()

//           localStorage.set(this._cacheName, {
//             '__EXPIREDATE__': timestamp + this._cacheExpire * 1000,
//             '__CREATEDDATE__': timestamp,
//             data
//           })
//         }

//         return data
//       })
//   },

//   /**
//    * 配置
//    * - 链式方法
//    * @param {Object} opts
//    * @param {number=} expire 有效时长（秒）
//    * @return {!Object}
//    */
//   settings ({
//     expire = 86400
//   } = {}) {
//     this._cacheExpire = expire

//     return this
//   },
//   /**
//    * @type {number}
//    */
//   _cacheExpire: 0,
//   _cacheName: '',

//   /**
//    * @param {string} url
//    * @param {Object} params
//    * @return {Promise}
//    */
//   get (url, params, opts) { return this.__req('GET', url, params, opts) },
//   /**
//    * @param {string} url
//    * @param {Object} params
//    * @return {Promise}
//    */
//   post (url, params, opts) { return this.__req('GET', url, params, opts) },
// }
