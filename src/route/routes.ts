import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import ProfileView from "@/pages/ProfilePage.vue";
import EditProfilePage from "@/pages/EditProfilePage.vue";
import MoviePage from "@/pages/MoviePage.vue";
import TvPage from "@/pages/TvPage.vue";
import WatchPartyPage from "@/pages/WatchPartyPage.vue";
import MovieDetailPage from "@/pages/MovieDetailPage.vue";
import LoginPage from "@/components/NavBar/UserManagement.vue";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "Home",
    component: HomePage,
    meta: { label: "Home", showInNav: false },
  },
  {
    path: "/movies",
    name: "movies",
    component: MoviePage,
    meta: { label: "Movies", showInNav: true },
  },
  {
    path: "/movie/:id",
    name: "MovieDetail",
    component: MovieDetailPage,
    meta: { label: "Movie Detail", showInNav: false },
  },
  {
    path: "/tv",
    name: "tv",
    component: TvPage,
    meta: { label: "TV Shows", showInNav: true },
  },
  {
    path: "/watchparty",
    name: "watchparty",
    component: WatchPartyPage,
    meta: { label: "Watch Party", showInNav: true },
  },
  {
    path: '/watchparty/room/:roomid',
    name: 'PartyRoom',
    component: () => import('@/pages/PartyRoom.vue'),
    meta: { label: "Party Room", showInNav: false },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { label: "Profile", showInNav: false },
  },
  {
    path: "/profile/edit",
    name: "profile-edit",
    component: EditProfilePage,
    meta: { label: "", showInNav: false },
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   redirect: "/",
  //   meta: { label: "", showInNav: false },
  // },
  
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
