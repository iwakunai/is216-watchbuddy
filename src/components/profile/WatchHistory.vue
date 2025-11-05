<script setup lang="ts">
import type { HistoryItem } from '@/types/profile'

const props = defineProps<{
  items: HistoryItem[]
}>()

const emit = defineEmits<{
  (e: 'open', id: string | number): void
}>()
</script>

<template>
  <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
      <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
      Watch History
    </h3>

    <div v-if="items.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">No watch history yet</p>
      <p class="text-sm text-gray-400">Start watching to see your timeline here</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="h in items" :key="h.id"
          class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group"
          @click="emit('open', h.id)">
        <div class="flex items-center space-x-4 flex-1">
          <div class="relative flex-shrink-0">
            <div class="w-16 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-lg overflow-hidden ring-2 ring-white dark:ring-gray-700">
              <img v-if="h.poster" :src="h.poster" :alt="h.title" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ h.title }}
            </p>
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ h.type === 'movie' ? '🎬 Movie' : '📺 TV Show' }}
              </span>
              <span v-if="h.year" class="text-xs text-gray-500 dark:text-gray-400">{{ h.year }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Watched on {{ h.watchedAt }}</span>
            </div>
          </div>
        </div>
        <div v-if="h.rating" class="flex-shrink-0 ml-4">
          <div class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
            <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="font-bold text-gray-900 dark:text-gray-100">{{ h.rating }}/5</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>