<script setup lang="ts">
import type { Friend } from '@/types/profile'
defineProps<{ friends: Friend[] }>()
</script>

<template>
  <div class="lg:col-span-2 bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center">
        <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
        Friends
      </h3>
      <span v-if="friends.length > 0" class="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
        {{ friends.length }} friends
      </span>
    </div>
    <div v-if="friends.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-6 text-sm">
      No friends yet. Add friends to see them here!
    </div>
    <div v-else>
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 mb-4">
        <div v-for="friend in friends" :key="friend.id" class="text-center group cursor-pointer">
          <div class="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-1.5 overflow-hidden">
            <img v-if="friend.avatar" :src="friend.avatar" :alt="friend.name" class="w-full h-full object-cover" />
          </div>
          <p class="text-xs text-gray-600 font-medium truncate">{{ friend.name }}</p>
        </div>
      </div>
      <button class="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
        + Add Friends
      </button>
    </div>
  </div>
</template>
