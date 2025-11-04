<!-- src/components/profile/overview/BadgeCard.vue -->
<script setup lang="ts">
import type { Badge } from '@/types/profile'
defineProps<{ badge: Badge }>()
</script>

<template>
  <div class="text-center relative group cursor-pointer">
    <div
      class="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-all ring-4"
      :class="[
        badge.earned
          ? 'bg-gradient-to-br from-amber-100 to-amber-200 ring-amber-50 group-hover:scale-110'
          : 'bg-gradient-to-br from-gray-300 to-gray-400 ring-gray-300 opacity-50'
      ]"
    >
      <span :class="badge.earned ? 'text-4xl' : 'text-4xl grayscale'">{{ badge.icon }}</span>
    </div>
    <p class="text-xs font-semibold text-gray-700">{{ badge.name }}</p>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ badge.earned ? 'Earned' : 'Locked' }}</p>

    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
      <div class="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl max-w-xs whitespace-normal">
        <p class="font-bold mb-1">{{ badge.name }}</p>
        <p class="text-gray-300">{{ badge.description }}</p>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
      </div>
    </div>
  </div>
</template>
