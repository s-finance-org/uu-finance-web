import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home'
import About from '@/views/About'
import Cast from '@/views/Cast'
import Exchange from '@/views/Exchange'
import Yield from '@/views/Yield'

import RootDefault from '@/components/layout/RootDefault'

const routes = [
  { path: '/',
    name: 'RootDefault',
    component: RootDefault,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: 'cast',
        name: 'Cast',
        component: Cast,
      },
      {
        path: '/exchange',
        name: 'Exchange',
        component: Exchange
      },
      { path: '/yield',
        name: 'Yield',
        component: Yield
      }
    ]
  },
  { path: '/about',
    name: 'About',
    component: About,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router