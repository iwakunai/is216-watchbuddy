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

<style scoped>
.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  color: #98a1b3;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.nav-link:hover {
  color: #eaf0ff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-active {
  color: #6b6bff;
  background: rgba(107, 107, 255, 0.1);
}
</style>
