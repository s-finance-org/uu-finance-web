import { createI18n } from 'vue-i18n'

import enUS from './en/en-US'
import zhCN from './zh/zh-CN'

/**
 *  项目拥有的语言包
 *  @type {!Object}
 */
const languages = {
  "en-US": enUS,
  "zh-CN": zhCN
}

const cacheLocaleKey = '__Global_I18n_locale'

// TODO:
let supports = {}
for(let lang in languages) {
  supports[lang] = languages[lang].__lang__
}

const __store__ = {
  locale: localStorage.getItem(cacheLocaleKey)
    || process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
  supports
}

export default {
  /**
   *  Vue-i18n Object
   *  @type {!Object}
   */
  $i18n: createI18n({
    locale: __store__.locale,
    fallbackLocale: __store__.fallbackLocale,
    messages: languages,
  }),

  /**
   *  获取当前语言的标识
   *  @type {string}
   */
  get locale () {
    // TODO:
    return __store__.locale
    // return this.$i18n.locale
  },
  /**
   *  变更语言环境
   *  @type {string}
   */
  set locale (val) {
    const { cacheLocaleKey } = this
    // TODO: check
    const result = __store__.locale = val

    localStorage.setItem(cacheLocaleKey, result)
  },
  /**
   *  当前语言的 baseLang 信息
   *  - 由 locale 维护
   *  @type {Object}
   */
  get baseLang () {
    // TODO: 要有缺省的 lang 结构
    return this.language.__lang__
  },

  get fallbackLocale () {
    return __store__.fallbackLocale
  },

  /**
   *  支持的语言
   *  @type {!Object}
   */
  get supports () {
    return __store__.supports
  },
  // TODO:
  // isSupportLanguage () {
  // },
  /**
   *  获取当前的语言包
   *  @type {Object}
   */
  get language () {
    const { languages, locale } = this
    // TODO: check support
    return languages[locale]
  },

  languages
}
