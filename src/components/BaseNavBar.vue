<template>
    <header class="site-header bg-indigo-100">
        <RouterLink to="/">
          <img 
            :src="logoImage"
            class="h-16 px-4"
          >
        </RouterLink>

      <!-- Mobile menu toggle -->
      <div class="brand-row">
        <RouterLink to="/" class="brand">WatchBuddy</RouterLink>
        <button
          class="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          @click="toggle()"
        > 
        Mobile Button
        </button>
      </div>
    
      <!-- Primary navigation -->
      <nav class="primary-nav" aria-label="Primary">
        <ul class="nav-list" :data-open="isOpen ? 'true' : 'false'">

          <li v-for="route in $router.options.routes" :key="route.name" class="nav-item">
            <RouterLink :to="route" class="nav-link">{{ route.meta?.label }}</RouterLink>
          </li>
        </ul>
      </nav>
      
    </header>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import logoImage from '@/assets/logo/logo.png'
// import { RouterLink } from 'vue-router';
const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }

</script>

<style scoped>
.site-header {
  width: 100%;
  margin: 0;
  padding: 10px 1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* box-sizing: border-box; */
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

/* START Mobile Responsive Stuff */
.brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-weight: 600;
  text-decoration: none;
}

.menu-toggle {
  font-size: 1.25rem;
  line-height: 1;
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
}
/* END Mobile Responsive Stuff */

.primary-nav {
  margin-top: 0;
}

/* Basic responsive behavior: collapse to button on small screens */
@media (min-width: 768px) {
  .brand-row {
    display: none;
  }

  .nav-list {
    display: flex !important;
  }
}

@media (max-width: 767px) {
  .logo-section {
    display: none;
  }
}

.nav-list {
  list-style: none;
  padding: 0;
  display: none;
  /* collapsed by default on small screens */
}

/* Toggle open state via data attribute */
.nav-list[data-open="true"] {
  display: block;
}

.nav-item {
  margin-right: 1rem;
}

/* Link styles */
.nav-link {
  text-decoration: none;
  padding: 0.5rem 0.25rem;
  display: inline-block;
}

/* Vue Router's default active classes */
/* .nav-link.router-link-active {
  color: #111827;
} */

.nav-link.router-link-exact-active {
  border-bottom: 2px solid transparent;
  border-bottom-color: #2563eb;
  /* highlight exact route */
}
</style>