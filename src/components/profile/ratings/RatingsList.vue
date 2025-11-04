<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RatingItem } from '@/types/profile'

defineProps<{ ratings: RatingItem[] }>()

const router = useRouter()

function navigateToMovie(rating: RatingItem) {
  const path = rating.type === 'movie' ? '/movie' : '/tv'
  router.push(`${path}/${rating.movie_id}`)
}
</script>

<template>
  <div v-if="ratings.length === 0" class="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
    You haven't rated any content yet. Start watching and rating!
  </div>
  <div v-else class="space-y-3">
    <div 
      v-for="rating in ratings" 
      :key="rating.id" 
      @click="navigateToMovie(rating)"
      class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
    >
      <div class="flex items-center space-x-4">
        <div class="w-16 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-md shadow-sm flex-shrink-0 overflow-hidden">
          <img v-if="rating.poster" :src="rating.poster" :alt="rating.title" class="w-full h-full object-cover" />
        </div>
        <div>
          <p class="font-semibold text-gray-900 dark:text-gray-100">{{ rating.title }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ rating.type }} • {{ rating.year }}</p>
          <p class="text-xs text-gray-400 mt-1">Rated on {{ rating.ratedDate }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="flex items-center space-x-1">
          <span v-for="i in 5" :key="i" class="text-xl">
            {{ i <= rating.rating ? '⭐' : '☆' }}
          </span>
        </div>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">{{ rating.rating }}/5</span>
      </div>
    </div>
  </div>
</template>
  