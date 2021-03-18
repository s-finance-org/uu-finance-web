import { createRouter, createWebHistory } from 'vue-router'
import globalMessage from '../utils/global/message'
import { isDevelopmentMode } from '../utils/helpers'

import Home from '@/views/Home'
import Test from '@/views/Test'
import Mint from '@/views/Mint'
import Swap from '@/views/Swap'
import Announcement from '@/views/Announcement'
import Claim from '@/views/Claim'
import Coming from '@/views/Coming'

import RootDefault from '@/components/layout/RootDefault'

const routes = [{
  path: '/',
  name: 'RootDefault',
  component: RootDefault,
  children: [
    {
      path: '',
      name: 'Home',
      component: Home
    },
    {
      path: 'mint',
      name: 'Mint',
      component: Mint,
      meta: {
        suffix: ' - Mint'
      }
    },
    {
      path: 'swap',
      name: 'Swap',
      component: Coming,
      meta: {
        suffix: ' - Swap'
      }
    },
    {
      path: 'announcement',
      name: 'Announcement',
      component: Announcement,
      meta: {
        suffix: ' - Announcement'
      }
    },
    {
      path: 'claim',
      name: 'Claim',
      component: Claim,
      meta: {
        suffix: ' - Claim'
      }
    }
  ]
}]

isDevelopmentMode
  && routes[0].children.push({
    path: 'test',
    name: 'Test',
    component: Test
  })

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const suffix = to.meta.suffix || ''

  if (to.matched && to.matched.length) {
    document.title = (to.meta.title || process.env.VUE_APP_DEFAULT_TITLE) + suffix

    next()
  } else {
    // 404
    next({ path: '/' })
    globalMessage.error('404 NOT FOUND')
  }
})

export default router
