<template>
  <div class="flex flex-col md:flex-row items-center gap-1">
    <RouterLink
      v-for="route in navRoutes"
      :key="route.path"
      :to="route.path"
      class="nav-link"
      :exact-active-class="route.path === '/' ? 'nav-link-active' : ''"
      active-class="nav-link-active"
    >
      {{ route.meta.label }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { router } from "@/route/routes"; // Adjust path if needed

// Filter routes to show in navigation
const routes = router.getRoutes();
const navRoutes = routes.filter((route) => route.meta?.showInNav);
</script>

<style scoped></style>
