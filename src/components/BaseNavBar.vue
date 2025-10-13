<!-- src/components/NavBar.vue -->
<template>
  <header class="site-header">
    <!-- <div class="brand-row">
      <RouterLink to="/" class="brand">MyApp</RouterLink>

      Mobile menu toggle
      <button
        class="menu-toggle"
        type="button"
        
        :aria-controls="navId"
        aria-label="Toggle navigation"
        @click="toggle()"
      > 
      
      
      </button>
    </div> -->

    <!-- Primary navigation -->
    <nav class="primary-nav" aria-label="Primary">
      <ul class="nav-list">
        <!-- :id="navId"
        class="nav-list"
        :data-open="isOpen ? 'true' : 'false'"
      > -->
      

        <!-- <li v-for="item in items" :key="item.to" class="nav-item">
          
          <RouterLink
            :to="item.to"
            class="nav-link"
            
          >
            {{ item.label }}
          </RouterLink>

        </li> -->

        <li v-for="route in $router.options.routes" :key="route.name" class="nav-item">
            <RouterLink :to="route" class="nav-link">{{ route.meta?.label }}</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router';


    
    const isOpen = ref(false)
    // const toggle = () => { isOpen.value = !isOpen.value }

    const navId = 'primary-nav'

    type Item = { label: string; to: string }
    const items: Item[] = [
    { label: 'Home', to: '/' },
    // { label: 'About', to: '/about' },
    { label: 'Profile', to: '/profile' },
    // { label: 'Contact', to: '/contact' }
    ]
</script>

<style scoped>
.site-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
}

.brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-weight: 600;
  text-decoration: none;
  /* color: #111827; */
}

.menu-toggle {
  font-size: 1.25rem;
  line-height: 1;
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
}

.primary-nav {
  margin-top: 0.5rem;
}

/* Basic responsive behavior: collapse to button on small screens */
@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
  .nav-list {
    display: flex !important;
  }
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  display: none; /* collapsed by default on small screens */
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
  /* color: #374151; */
  padding: 0.5rem 0.25rem;
  display: inline-block;
  border-bottom: 2px solid transparent;
}

/* Vue Router's default active classes */
.nav-link.router-link-active {
  /* color: #111827; */
}

.nav-link.router-link-exact-active {
  border-bottom-color: #2563eb; /* highlight exact route */
}
</style>