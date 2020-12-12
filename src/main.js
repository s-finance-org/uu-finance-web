import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';

import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.less';
import './themes/index.less'

import store from './store'

createApp(App)
  .mixin({
    computed: {
      $store () {
        return store
      }
    }
  })
  .use(Antd)
  .use(store.i18n.$i18n)
  .use(router)
  .mount('#app')
