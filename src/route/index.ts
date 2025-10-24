// src/route/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/pages/MoviePage.vue') },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: () => import('@/pages/MovieDetailPage.vue'),
    props: true
  },
  // ...other routes
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
