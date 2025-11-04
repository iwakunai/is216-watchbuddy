import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import MoviePage from "@/pages/MoviePage.vue";
import TvPage from "@/pages/TvPage.vue";
import WatchPartyPage from "@/pages/WatchPartyPage.vue";
import MovieDetailPage from "@/pages/MovieDetailPage.vue";
import RecommendPage from "@/pages/RecommendPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import OldProfilePage from "@/pages/oldProfilePage.vue";
import AchievementsPage from "@/pages/AchievementsPage.vue";

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
    path: "/tv/:id",
    name: "TVShowDetail",
    component: () => import('@/pages/TvDetailPage.vue'),
    meta: { label: "TV Show Detail", showInNav: false },
  },
  {
    path: "/recommend",
    name: "recommend",
    component: RecommendPage,
    meta: { label: "Recommend", showInNav: true },
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
    path: "/achievements",
    name: "achievements",
    component: AchievementsPage,
    meta: { label: "Achievements", showInNav: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    meta: { label: "Profile", showInNav: false },
  },
  {
    path: '/person/:id',
    name: 'PersonDetails',
    component: () => import('@/pages/PersonDetails.vue'),
    meta: { label: "Person Details", showInNav: false },
  },
  {
    path: "/achievements",
    name: "achievements",
    component: AchievementsPage,
    meta: { label: "Achievements", showInNav: false },
  },
  {
    path: "/oldprofile",
    name: "oldprofile",
    component: OldProfilePage,
    meta: { label: "Profile", showInNav: false },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});