import FindJetton from '@/views/FindJetton.vue'
import ManageJetton from '@/views/ManageJetton.vue'
import NewJetton from '@/views/NewJetton.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'NewJetton',
      component: NewJetton,
    },
    {
      path: "/manage",
      name: 'FindJetton',
      component: FindJetton,
    },
    {
      path: "/manage/:address",
      name: 'ManageJetton',
      component: ManageJetton,
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
