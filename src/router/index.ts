import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/materias-primas',
    },
    {
      path: '/materias-primas',
      name: 'materias-primas',
      component: () => import('@/components/raw-material/RawMaterialList.vue'),
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('@/components/product/ProductList.vue'),
    },
    {
      path: '/plano-producao',
      name: 'plano-producao',
      component: () => import('@/components/production-plan/ProductionPlan.vue'),
    },
  ],
})

export default router
