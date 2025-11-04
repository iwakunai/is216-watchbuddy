<script setup lang="ts">
import type { ActivityItem } from '@/types/profile'

const props = defineProps<{
  items: ActivityItem[]
}>()

const emit = defineEmits<{
  (e: 'open', id: string | number): void
}>()
</script>

<template>
  <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
      <span class="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
      Recent Activity
    </h3>

    <div v-if="items.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">No activity yet</p>
      <p class="text-sm text-gray-400">Your recent ratings, reviews, badges and friend actions will show here</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="a in items" :key="a.id"
          class="p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group"
          @click="emit('open', a.id)">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-2xl shadow-sm border border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform">
              <span v-if="a.icon">{{ a.icon }}</span>
              <span v-else>⭐</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ a.title }}
            </p>
            <p v-if="a.description" class="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
              {{ a.description }}
            </p>
            <div class="flex items-center gap-2">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                a.type === 'rating' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                a.type === 'review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                a.type === 'badge' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                a.type === 'friend' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                a.type === 'list' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
              ]">
                {{ a.type.charAt(0).toUpperCase() + a.type.slice(1) }}
              </span>
              <span class="text-xs text-gray-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ a.at }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
