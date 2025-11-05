<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WatchItem } from '@/types/profile'

const props = defineProps<{
  items: WatchItem[]
}>()

const emit = defineEmits<{
  (e: 'remove', id: string | number): void
  (e: 'open', id: string | number): void
  (e: 'changeStatus', id: string | number, status: 'completed' | 'watching' | 'plan-to-watch', type: 'movie' | 'tv'): void
}>()

type MediaType = 'movies' | 'tv'
type WatchStatus = 'completed' | 'watching' | 'plan-to-watch'

const activeMediaTab = ref<MediaType>('movies')
const activeStatusTab = ref<WatchStatus>('watching')
const sortOrder = ref<'asc' | 'desc'>('desc') // desc = newest first

// Track which item's dropdown is open
const openDropdownId = ref<string | number | null>(null)

function toggleDropdown(itemId: string | number) {
  openDropdownId.value = openDropdownId.value === itemId ? null : itemId
}

function changeItemStatus(item: WatchItem, newStatus: WatchStatus) {
  emit('changeStatus', item.id, newStatus, item.type)
  openDropdownId.value = null
}

function getStatusLabel(status: WatchStatus): string {
  switch (status) {
    case 'completed': return 'Completed'
    case 'watching': return 'Currently Watching'
    case 'plan-to-watch': return 'Plan to Watch'
  }
}

function getStatusOptions(currentStatus: WatchStatus): WatchStatus[] {
  const allStatuses: WatchStatus[] = ['completed', 'watching', 'plan-to-watch']
  return allStatuses.filter(s => s !== currentStatus)
}

const movieCount = computed(() => props.items.filter(item => item.type === 'movie').length)
const tvCount = computed(() => props.items.filter(item => item.type === 'tv').length)

const filteredItems = computed(() => {
  const filtered = props.items.filter(item => {
    const matchesMediaType = activeMediaTab.value === 'movies' 
      ? item.type === 'movie' 
      : item.type === 'tv'
    const matchesStatus = item.status === activeStatusTab.value
    return matchesMediaType && matchesStatus
  })

  // Sort by date added
  return filtered.sort((a, b) => {
    const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0
    const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0
    
    if (sortOrder.value === 'desc') {
      return dateB - dateA // Newest first
    } else {
      return dateA - dateB // Oldest first
    }
  })
})

const statusCounts = computed(() => {
  const filtered = props.items.filter(item => 
    activeMediaTab.value === 'movies' ? item.type === 'movie' : item.type === 'tv'
  )
  return {
    completed: filtered.filter(item => item.status === 'completed').length,
    watching: filtered.filter(item => item.status === 'watching').length,
    planToWatch: filtered.filter(item => item.status === 'plan-to-watch').length
  }
})
</script>

<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    @click="openDropdownId = null"
  >
    <!-- Header with Title and Controls -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Watchlist
        </h3>
        <div class="flex items-center gap-3 text-sm">
          <button
            @click="activeMediaTab = 'movies'; activeStatusTab = 'watching'"
            :class="[
              'px-4 py-1.5 rounded-md font-medium transition-colors',
              activeMediaTab === 'movies'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            Movies {{ movieCount }}
          </button>
          <button
            @click="activeMediaTab = 'tv'; activeStatusTab = 'watching'"
            :class="[
              'px-4 py-1.5 rounded-md font-medium transition-colors',
              activeMediaTab === 'tv'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            TV {{ tvCount }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Sort Order Toggle -->
        <button
          @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
          class="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          :title="sortOrder === 'desc' ? 'Newest First' : 'Oldest First'"
        >
          <span>{{ sortOrder === 'desc' ? 'Newest First' : 'Oldest First' }}</span>
          <svg 
            class="w-5 h-5 transition-transform" 
            :class="{ 'rotate-180': sortOrder === 'asc' }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Status Tabs (Completed, Currently Watching, Plan to Watch) -->
    <div class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-1 px-6">
        <button
          @click="activeStatusTab = 'watching'"
          :class="[
            'px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors relative',
            activeStatusTab === 'watching'
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Currently Watching
          <div 
            v-if="activeStatusTab === 'watching'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
          ></div>
        </button>
        <button
          @click="activeStatusTab = 'plan-to-watch'"
          :class="[
            'px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors relative',
            activeStatusTab === 'plan-to-watch'
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Plan to Watch
          <div 
            v-if="activeStatusTab === 'plan-to-watch'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
          ></div>
        </button>
        <button
          @click="activeStatusTab = 'completed'"
          :class="[
            'px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors relative',
            activeStatusTab === 'completed'
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Completed
          <div 
            v-if="activeStatusTab === 'completed'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
          ></div>
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="p-6">
      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-300 text-lg">
          You haven't added any {{ activeMediaTab === 'movies' ? 'movies' : 'TV shows' }} to your watchlist
        </p>
      </div>

      <!-- List View (MyAnimeList style) -->
      <div v-else class="space-y-3">
        <div 
          v-for="(item, index) in filteredItems" 
          :key="item.id"
          class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer group"
          @click="emit('open', item.id)"
        >
          <!-- Index Number -->
          <div class="flex-shrink-0 w-8 text-center">
            <span class="text-lg font-bold text-gray-400 dark:text-gray-500">{{ index + 1 }}</span>
          </div>

          <!-- Poster -->
          <div class="flex-shrink-0">
            <div class="w-16 h-24 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden shadow-md">
              <img v-if="item.poster" :src="item.poster" :alt="item.title" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                    {{ item.type === 'movie' ? 'Movie' : 'TV' }}
                  </span>
                  <h4 class="font-bold text-gray-900 dark:text-gray-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {{ item.title }}
                  </h4>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span v-if="item.year">{{ item.year }}</span>
                  <span v-if="item.year && item.addedAt">•</span>
                  <span v-if="item.addedAt">Added {{ item.addedAt }}</span>
                </div>
              </div>

              <!-- Status Change Button -->
              <div class="flex-shrink-0 relative">
                <button
                  @click.stop="toggleDropdown(item.id)"
                  class="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium"
                  title="Change status"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
                  </svg>
                  Move to...
                </button>

                <!-- Dropdown Menu -->
                <div 
                  v-if="openDropdownId === item.id"
                  class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
                  @click.stop
                >
                  <button
                    v-for="status in getStatusOptions(item.status!)"
                    :key="status"
                    @click="changeItemStatus(item, status)"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {{ getStatusLabel(status) }}
                  </button>
                </div>
              </div>

              <!-- Remove Button -->
              <div class="flex-shrink-0">
                <button
                  @click.stop="emit('remove', item.id)"
                  class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Remove from watchlist"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>