import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { layout: 'empty' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { layout: 'empty' }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/materias-primas',
      name: 'materias-primas',
      component: () => import('@/components/raw-material/RawMaterialList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('@/components/product/ProductList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plano-producao',
      name: 'plano-producao',
      component: () => import('@/components/production-plan/ProductionPlan.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
