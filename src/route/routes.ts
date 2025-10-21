import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";

import App from "@/App.vue";
import HomePage from "@/pages/HomePage.vue";
import ProfileView from "@/pages/ProfilePage.vue";
import EditProfilePage from "@/pages/EditProfilePage.vue";
import MoviePage from "@/pages/MoviePage.vue";
import TvPage from "@/pages/TvPage.vue";
import WatchPartyPage from "@/pages/WatchPartyPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { label: "Home", showInNav: true },
  },
  {
    path: "/movies",
    name: "movies",
    component: MoviePage,
    meta: { label: "Movies", showInNav: true },
  },
  {
    path: "/tv",
    name: "tv",
    component: TvPage,
    meta: { label: "TV Shows", showInNav: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { label: "Profile", showInNav: true },
  },
  {
    path: "/profile/edit",
    name: "profile-edit",
    component: EditProfilePage,
    meta: { label: "", showInNav: false },
  },
  {
    path: "/watchparty",
    name: "watchparty",
    component: WatchPartyPage,
    meta: { label: "Watch Party", showInNav: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
