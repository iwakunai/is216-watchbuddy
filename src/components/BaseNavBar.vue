<template>
  <header
    :class="[
      'w-full',
      'bg-indigo-100',
      'md:border-b md:border-gray-200 md:divide-y-0',
      'divide-y divide-gray-200',
      isOpen ? 'border-b border-gray-200' : 'border-b-0',
    ]"
  >
    <!-- Mobile toggle bar -->
    <div class="md:hidden w-full py-2 px-4 grid grid-cols-3 items-center">
      <button
        class="justify-self-start inline-flex items-center justify-center p-2 bg-transparent border border-gray-300 rounded-md"
        type="button"
        aria-label="Toggle navigation"
        aria-controls="primary-menu"
        :aria-expanded="isOpen ? 'true' : 'false'"
        @click="toggle()"
      >
        <!-- Menu Bar SVG -->
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <RouterLink to="/" class="font-semibold no-underline flex items-center justify-center"
        ><img :src="logoImage" alt="WatchBuddy Logo" class="w-8 h-8" /></RouterLink
      >
    </div>

    <!-- Primary Navigation -->
    <nav class="p-2 px-6">
      <div class="md:flex md:items-center md:justify-between">

        <RouterLink to="/" class="hidden md:block">
          <img :src="logoImage" alt="WatchBuddy Logo" class=" h-18" />
        </RouterLink>
        
        <ul
          :class="[
            isOpen ? 'block text-center' : 'hidden',
            'md:flex justify-center',
            'list-none p-0 m-0',
            'space-y-2 md:space-y-0 md:gap-x-6',
          ]"
        >
          <li
            v-for="route in $router.options.routes"
            :key="route.name"
            class="md:m-0"
          >
            <RouterLink
              :to="route"
              class="inline-block no-underline py-0 transparent"
              exact-active-class="border-b-2 border-blue-600"
            >
              {{ route.meta?.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
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
