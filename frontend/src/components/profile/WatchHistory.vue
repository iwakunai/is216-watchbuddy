<script setup lang="ts">
import type { WatchpartyHistoryItem } from '@/types/profile'

const props = defineProps<{ items: WatchpartyHistoryItem[] }>();
const emit = defineEmits<{ (e: 'open', id: string | number): void }>()
</script>

<template>
  <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
      <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
      Watch Party History
      <span class="ml-2 text-md font-normal text-gray-700 dark:text-gray-400">({{ items.length }})</span>
    </h3>

    <div v-if="items.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-gray-500 dark:text-gray-400 font-medium mb-1">No watch party history yet</p>
      <p class="text-sm text-gray-400">Join a watch party to see your timeline here</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="h in items"
        :key="h.id"
        class="flex flex-col sm:flex-row items-center sm:items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group"
        @click="emit('open', h.id)"
      >
        <div class="relative flex-shrink-0">
          <div class="w-20 h-28 sm:w-24 sm:h-36 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-lg overflow-hidden ring-2 ring-white dark:ring-gray-700">
            <img v-if="h.poster" :src="h.poster" :alt="h.title" class="w-full h-full object-cover" />
          </div>
        </div>
        <div class="flex-1 min-w-0 mt-4 sm:mt-0 sm:ml-6 w-full text-center sm:text-left">
          <p
            class="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate mx-auto sm:mx-0"
            :title="h.title"
          >
            <span class="truncate max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">{{ h.title }}</span>
          </p>
          <div class="mb-2">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full border border-blue-300 text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mx-auto sm:mx-0"
              :title="h.roomName"
            >
              {{ h.roomName }}
            </span>
          </div>
          <div v-if="h.scheduledTime" class="text-sm text-gray-500 dark:text-gray-400 mb-1 text-center sm:text-left">
            Start Time: {{ h.scheduledTime }}
          </div>
          <div v-if="h.duration" class="text-sm text-gray-500 dark:text-gray-400 mb-1 text-center sm:text-left">
            Duration: {{ h.duration }} min
          </div>
          <div class="flex items-center gap-2 justify-center sm:justify-start text-sm text-gray-500 dark:text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Joined on {{ h.lastJoinedAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>