<template>
    <header class="site-header">
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
// import { RouterLink } from 'vue-router';
const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }

</script>

<style scoped>
.site-header {
  width: 100%;
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  display: flex;
  /* place-items: center; */
  justify-content: center;
  align-items: center;
  /* box-sizing: border-box; */
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