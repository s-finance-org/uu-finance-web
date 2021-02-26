import { createI18n } from 'vue-i18n'
import { nativeNavigatorLanguage, queryUriParse, nativeLocation, localStorage } from '../utils'

import enUS from './en/en-US'
import zhCN from './zh/zh-CN'

/**
 * 项目拥有的语言包
 * @type {!Object}
 */
// TODO: 
const languages = {
  'en-us': enUS,
  'zh-cn': zhCN
}

const cacheLocaleKey = '__Global_i18n_locale'

// TODO:
let supports = {}
for(let lang in languages) {
  supports[lang] = languages[lang].__lang__
}

// 支持由 locale= 控制 i18n
const urlParams = queryUriParse(nativeLocation.search)

const __store__ = {
  //  url param 指定
  // TODO:
  locale: urlParams.locale && urlParams.locale.toLowerCase()
    // 缓存 i18n 标识
    || localStorage.get(cacheLocaleKey)
    // 浏览器环境标识
    || nativeNavigatorLanguage.toLowerCase()
    // 项目缺省标识
    || process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
  supports
}

export default {
  /**
   * Vue-i18n Object
   * @type {!Object}
   */
  $i18n: createI18n({
    locale: __store__.locale,
    fallbackLocale: __store__.fallbackLocale,
    messages: languages,
  }),

  /**
   * 获取当前语言的标识
   * @type {string}
   */
  get locale () {
    // TODO:
    return __store__.locale
  },
  /**
   * 变更语言环境
   * @type {string}
   */
  set locale (val) {
    // Check
    const result = __store__.locale = this.isSupportLanguage(val)
      ? val
      : process.env.VUE_APP_I18N_LOCALE

    localStorage.set(cacheLocaleKey, result)
  },
  /**
   * 当前语言的 baseLang 信息
   * - 由 locale 维护
   * @type {Object}
   */
  get baseLang () {
    // TODO: 要有缺省的 lang 结构
    return this.language.__lang__
  },

  get fallbackLocale () {
    return __store__.fallbackLocale
  },

  /**
   * 支持的语言
   * @type {!Object}
   */
  get supports () {
    return __store__.supports
  },
  /**
   * 项目是否支持的语言标识
   * @param {*} id
   * @return {boolean}
   */
  isSupportLanguage (id) {
    const { supports } = __store__

    // TODO: 需严格校验
    return !!supports[id]
  },
  /**
   * 获取当前的语言包
   * @type {Object}
   */
  get language () {
    const { languages, locale } = this
    // TODO: check support
    return languages[locale]
  },

  // 项目拥有的语言包
  languages
}
