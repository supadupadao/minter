import ManageJetton from '@/views/ManageJetton.vue'
import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
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
