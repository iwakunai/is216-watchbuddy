<script setup lang="ts">
import type { WatchItem } from '@/types/profile'

const props = defineProps<{
  items: WatchItem[]
}>()

const emit = defineEmits<{
  (e: 'remove', id: string | number): void
  (e: 'open', id: string | number): void
}>()
</script>

<template>
  <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
      <span class="w-1 h-6 bg-green-600 rounded-full mr-3"></span>
      My Watchlist
    </h3>

    <div v-if="items.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">Your watchlist is empty</p>
      <p class="text-sm text-gray-400">Add movies or shows to watch later</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="it in items" :key="it.id" class="group">
        <div class="relative aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-lg ring-2 ring-transparent group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all cursor-pointer transform group-hover:scale-105"
             @click="emit('open', it.id)">
          <img v-if="it.poster" :src="it.poster" :alt="it.title" class="w-full h-full object-cover" />
          
          <!-- Bookmark Badge -->
          <div class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            ✓
          </div>
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-0 left-0 right-0 p-3">
              <button class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
                      @click.stop="emit('remove', it.id)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
        
        <!-- Info Below Poster -->
        <div class="mt-2 px-1">
          <p class="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" :title="it.title">
            {{ it.title }}
          </p>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-gray-500 dark:text-gray-400">{{ it.type === 'movie' ? '🎬' : '📺' }} {{ it.type }}</span>
            <span v-if="it.year" class="text-gray-400">•</span>
            <span v-if="it.year" class="text-gray-500 dark:text-gray-400">{{ it.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>