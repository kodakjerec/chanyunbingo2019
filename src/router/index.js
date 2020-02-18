import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: '展雲賓果2019' },
    component: () => import('../views/Bingo/bingo2')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test/test')
  },
  {
    path: '/lottery',
    name: 'lottery',
    meta: { title: '展雲抽獎' },
    component: () => import('../views/Lottery/lottery')
  },
  {
    path: '/lotterySetting',
    name: 'lotterySetting',
    meta: { title: '展雲抽獎後台' },
    component: () => import('../views/Lottery/lotterySetting')
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
