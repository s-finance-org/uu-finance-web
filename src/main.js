import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

// Bootstrap
import '../public/libs/bootstrap/5.0.0.beta1/bootstrap-grid.min.css'
import '../public/libs/bootstrap/5.0.0.beta1/bootstrap-utilities.min.css'

// Antd
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less'
import './themes/index.less'

import store from './store'

const app = createApp(App)

app.mixin(
  {
    computed: {
      $store () {
        return store
      }
    }
  })
  // TODO: 不使用全局加载的方式
  // .use(Antd)
  .use(store.i18n.$i18n)
  .use(router)
  .mount('#app')
