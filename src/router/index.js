import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue';

import Home from '@/views/Home'
import About from '@/views/About'
import Mint from '@/views/Mint'
import Swap from '@/views/Swap'
import Claim from '@/views/Claim'
import Coming from '@/views/Coming'

import RootDefault from '@/components/layout/RootDefault'

const routes = [
  { path: '/',
    name: 'RootDefault',
    component: RootDefault,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'mint',
        name: 'Mint',
        component: Mint,
      },
      {
        path: 'swap',
        name: 'Swap',
        component: Swap
      },
      { path: 'claim',
        name: 'Claim',
        component: Coming
      }
    ]
  },
  { path: '/about',
    name: 'About',
    component: Coming,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const suffix = to.meta.suffix || ''

  if (!to.matched || to.matched.length === 0) {
    // 404
    next({ path: '/' })
    message.error(`404 NOT FOUND`)
  } else {
    document.title = (to.meta.title || process.env.VUE_APP_DEFAULT_TITLE) + suffix

    next()
  }
})

export default router