<template>
  <nav
    :class="[
      'w-full',
      'bg-[#0b1220] border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-opacity-95',
      isOpen ? 'border-b border-gray-200' : 'border-b-0',
    ]"
  >
    <div class="mx-auto px-4">
      <div class="flex items-center justify-between h-16">

        <!-- User Button for Mobile -->
        <div class="flex md:hidden">
          <UserManagement />
        </div>

        <!-- Logo/Brand -->
        <RouterLink
          to="/"
          class="text-xl font-bold text-indigo-500 bg-clip-text"
        >
          <!-- TODO: Replace Text with brand logo -->
          WatchBuddy
        </RouterLink>

        <!-- Links for Desktop -->
        <div class="hidden md:flex">
          <NavLinks />
          <UserManagement />
        </div>

        <!-- Mobile dropdown menu -->
        <button
          class="md:hidden inline-flex items-center justify-center p-2 border border-gray-300 rounded-md"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="primary-menu"
          :aria-expanded="isOpen ? 'true' : 'false'"
          @click="toggle"
        >
          <svg
            class="w-6 h-6 stroke-current text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
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
      </div>

      <!-- Links for mobile on toggle -->
      <div v-if="isOpen" class="md:hidden flex flex-col gap-1 py-2">
        <NavLinks />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
const isOpen = ref(false);
const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* .nav-link {
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
} */
</style>
