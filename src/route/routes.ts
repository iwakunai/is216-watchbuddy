import {createMemoryHistory, createRouter, createWebHistory } from 'vue-router'


import App from '@/App.vue';
import HomePage from '@/pages/HomePage.vue';
import ProfileView from "@/pages/ProfilePage.vue";
// import path from "path";

// const history = createWebHi

const routes = [
  { path: '/', component: HomePage},
  { path: '/profile', component: ProfileView},
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})