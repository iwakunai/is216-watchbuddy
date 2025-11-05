<script setup lang="ts">
import type { MovieItem } from '@/types/profile'

const props = defineProps<{ 
  query: string
  results: MovieItem[]
  isLoading?: boolean
}>()

const emit = defineEmits<{ (e:'add', movie: MovieItem): void }>()
</script>

<template>
  <div v-if="isLoading" class="text-center py-6">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mb-2"></div>
    <p class="text-gray-500 dark:text-gray-400 text-sm">Searching...</p>
  </div>
  <div v-else-if="query.trim() && results.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
    <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="font-medium">No results found</p>
    <p class="text-xs mt-1">Try a different search term</p>
  </div>
  <div v-else-if="results.length > 0" class="space-y-2 max-h-[500px] overflow-y-auto">
    <div v-for="movie in results" :key="movie.id" class="flex items-start space-x-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div class="w-10 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
        <img v-if="movie.poster" :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          No Image
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">{{ movie.title }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span class="inline-block px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 mr-1">
            {{ movie.type === 'movie' ? '🎬 Movie' : '📺 TV' }}
          </span>
          {{ movie.year || 'N/A' }}
        </p>
        <button @click="emit('add', movie)" class="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors w-full">
          + Add to List
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-8 text-gray-400 text-sm">
    <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <p>Search for movies or TV shows</p>
    <p class="text-xs mt-1 text-gray-400">Start typing to see results</p>
  </div>
</template>
