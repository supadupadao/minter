import DeployJetton from '@/views/DeployJetton.vue'
import DevTools from '@/views/DevTools.vue'
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
      path: '/deploy/jetton',
      name: 'DeployJetton',
      component: DeployJetton,
    },
    {
      path: "/manage/:address",
      name: 'ManageJetton',
      component: DevTools,
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
