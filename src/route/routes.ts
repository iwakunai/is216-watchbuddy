// src/router/routes.ts
import { createRouter, createWebHistory } from "vue-router";

const HomePage = () => import('@/pages/HomePage.vue');
const MoviePage = () => import('@/pages/MoviePage.vue');
const TvPage = () => import('@/pages/TvPage.vue');
const ProfileView = () => import('@/pages/ProfilePage.vue');
const WatchPartyPage = () => import('@/pages/WatchPartyPage.vue');
const MovieDetailPage = () => import('@/pages/MovieDetailPage.vue');

const routes = [
  { 
    path: "/", 
    name: "Home", 
    component: HomePage, 
    meta: { label: "Home", showInNav: true } 
  },
  { 
    path: "/movies", 
    name: "movies", 
    component: MoviePage, 
    meta: { label: "Movies", showInNav: true } 
  },
  { 
    path: "/movie/:id", 
    name: "MovieDetail", 
    component: MovieDetailPage, 
    meta: { label: "Movie Detail", showInNav: false } 
  },
  { 
    path: "/tv", 
    name: "tv", 
    component: TvPage, 
    meta: { label: "TV Shows", showInNav: true } 
  },
  { 
    path: "/profile", 
    name: "profile", 
    component: ProfileView, 
    meta: { label: "Profile", showInNav: true } 
  },
  { 
    path: "/watchparty", 
    name: "watchparty", 
    component: WatchPartyPage, 
    meta: { label: "Watch Party", showInNav: true } 
  },
  { 
    path: "/:pathMatch(.*)*", 
    redirect: "/" 
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});