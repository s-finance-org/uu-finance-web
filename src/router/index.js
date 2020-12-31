import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home'
import About from '@/views/About'
import Cast from '@/views/Cast'
import Exchange from '@/views/Exchange'
import Yield from '@/views/Yield'
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
        path: 'cast',
        name: 'Cast',
        component: Coming,
      },
      {
        path: 'exchange',
        name: 'Exchange',
        component: Coming
      },
      { path: 'yield',
        name: 'Yield',
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

  document.title = (to.meta.title || process.env.VUE_APP_DEFAULT_TITLE) + suffix

  next()
})

export default router