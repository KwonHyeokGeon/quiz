import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuizView from '../views/QuizView.vue'
import WrongView from '../views/WrongView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/quiz',
    name: 'QuizView',
    component: QuizView,
    props: route => ({
      userName: route.query.userName,
      selectRandom: route.query.selectRandom,
      selectType: route.query.selectType,
      selectCount: route.query.selectCount,
      props: true
    })
  },
  {
    path: '/wrong',
    name: 'WrongView',
    component: WrongView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
