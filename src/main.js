import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import '../public/libs/bootstrap/5.0.0.beta1/bootstrap-grid.min.css';
import '../public/libs/bootstrap/5.0.0.beta1/bootstrap-utilities.min.css';

import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.less';
import './themes/index.less';

import store from './store'


import { createI18n } from 'vue-i18n'

const messages = {
  en: {
      hello: 'hello world'
  },
  ja: {
      hello: 'こんにちは、世界'
  }
}

const i18n = createI18n({
  locale: 'zh-CN', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})

createApp(App)
  .mixin({
    computed: {
      $store () {
        return store
      }
    }
  })
  .use(Antd)
  // .use(store.i18n.$i18n)
  .use(i18n)
  .use(router)
  .mount('#app')
