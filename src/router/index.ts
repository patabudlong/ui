import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TasksView from '../views/TasksView.vue'
import LoginView from '../views/LoginView.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import RegisterView from '@/views/RegisterView.vue'

// Auth guard
const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated && to.name !== 'login') {
    next({ name: 'login' })
  } else if (isAuthenticated && to.name === 'login') {
    next({ name: 'home' }) // Redirect to home if trying to access login while authenticated
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
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginView,
        beforeEnter: requireAuth,
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterView,
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
