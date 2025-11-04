<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { ReviewItem } from '@/types/profile'

defineProps<{ reviews: ReviewItem[] }>()

const router = useRouter()

function navigateToMovie(review: ReviewItem) {
  const path = review.type === 'movie' ? '/movie' : '/tv'
  router.push(`${path}/${review.movie_id}`)
}
</script>

<template>
  <div v-if="reviews.length === 0" class="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
    You haven't written any reviews yet. Share your thoughts on movies and shows!
  </div>
  <div v-else class="space-y-4">
    <div 
      v-for="review in reviews" 
      :key="review.id" 
      @click="navigateToMovie(review)"
      class="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
    >
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-start space-x-4">
          <div class="w-16 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-md shadow-sm flex-shrink-0 overflow-hidden">
            <img v-if="review.poster" :src="review.poster" :alt="review.title" class="w-full h-full object-cover" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ review.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ review.type }} • {{ review.year }}</p>
            <p class="text-xs text-gray-400 mt-1">Reviewed on {{ review.reviewedDate }}</p>
          </div>
        </div>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">{{ review.reviewText }}</p>
    </div>
  </div>
</template>
