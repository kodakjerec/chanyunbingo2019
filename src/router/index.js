import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/bingo2020',
    name: 'bingo2020',
    meta: { title: '展雲賓果2020' },
    component: () => import('../views/Bingo2020/bingo')
  },
  {
    path: '/',
    name: 'bingo2021',
    meta: { title: '展雲賓果2021' },
    component: () => import('../views/Bingo2021/bingo')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test/test')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router
