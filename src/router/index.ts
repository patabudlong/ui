import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TasksView from '../views/TasksView.vue'
import LoginView from '../views/LoginView.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Auth guard
const requireAuth = (to: any, from: any, next: any) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: requireAuth,
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView,
    beforeEnter: requireAuth,
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirect: '/auth/login',
      },
      {
        path: 'login',
        name: 'login',
        component: LoginView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
