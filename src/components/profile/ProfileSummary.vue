<script setup lang="ts">
import type { Profile } from '@/types/profile'
const props = defineProps<{
  profile: Profile
  joinDate: string
  averageMovieScore: number
  averageTvScore: number
  averageMoodEmoji: string
  totalMoviesWatched: number
  totalShowsWatched: number
  totalBadgesEarned: number
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

        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Average Scores</h3>
          <div class="flex flex-col md:flex-row justify-start gap-6">
            <div class="text-center">
              <div class="w-20 h-20 bg-blue-50 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-100 dark:border-blue-700">
                <span class="text-blue-600 dark:text-blue-400 font-bold text-2xl">{{ averageMovieScore }}%</span>
              </div>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Movies</p>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 bg-purple-50 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-100 dark:border-purple-700">
                <span class="text-purple-600 dark:text-purple-400 font-bold text-2xl">{{ averageTvScore }}%</span>
              </div>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">TV Shows</p>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 bg-amber-50 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-100 dark:border-amber-700">
                <span class="text-3xl">{{ averageMoodEmoji }}</span>
              </div>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Mood</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Activity</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalMoviesWatched }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">Movies Watched</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalShowsWatched }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">Shows Watched</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalBadgesEarned }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">Badges Earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
