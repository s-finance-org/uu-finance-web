import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { kebabCase } from './utils'

// Bootstrap
import '../public/libs/bootstrap/5.0.0.beta1/bootstrap-grid.min.css';
import '../public/libs/bootstrap/5.0.0.beta1/bootstrap-utilities.min.css';

// Antd
import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.less';
import './themes/index.less';

import store from './store'

const app = createApp(App)

const requireComponent = require.context(
  './components/tokens',
  false, // 是否查询其子目录
  /[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const config = requireComponent(fileName)
  const body = config.default || config
  const name = body.name
    || kebabCase(fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
      )

  app.component(name, body)
})

app.mixin({
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
