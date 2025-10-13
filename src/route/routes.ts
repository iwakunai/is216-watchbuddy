import {createMemoryHistory, createRouter, createWebHistory } from 'vue-router'


import App from '@/App.vue';
import HomePage from '@/pages/HomePage.vue';
import ProfileView from "@/pages/ProfilePage.vue";
import MoviePage from '@/pages/MoviePage.vue';
import TvPage from '@/pages/TvPage.vue';
// import path from "path";

// const history = createWebHi

const routes = [
    { path: '/', name: 'home', component: HomePage, 
        meta: { label: 'Home', showInNav: true }},
    { path: '/movies', name: 'movies',component: MoviePage,
        meta: { label: 'Movies', showInNav: true }
    },
    { path: '/tv', name: 'tv', component: TvPage,
        meta: { label: 'TV Shows', showInNav: true }
    },
    { path: '/profile', name: 'profile', component: ProfileView,
        meta: { label: 'Profile', showInNav: true }
    },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})