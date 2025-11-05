<script setup lang="ts">
import type { Profile } from '@/types/profile'

const props = defineProps<{
  profile: Profile
  joinDate: string
  totalMoviesWatched: number
  totalShowsWatched: number
}>()
</script>

<template>
  <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
    <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
      <div class="flex-shrink-0">
        <div class="relative">
          <img :src="profile.avatarDataUrl || profile.defaultAvatar" alt="Profile Picture"
               class="w-24 h-24 rounded-full object-cover bg-gray-200 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-700" />
          <div class="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
        </div>
      </div>

      <div class="flex-1 w-full">
        <h2 class="text-2xl font-bold mb-1 dark:text-gray-100">{{ profile.username || 'Username' }}</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6 text-sm">Member since {{ joinDate }}</p>

        <div>
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Activity</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalMoviesWatched }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">Movies Watched</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalShowsWatched }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">Shows Watched</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
