<!-- src/components/profile/ListsPanel.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ListFull, MovieItem } from '@/types/profile'
import SearchResults from './lists/SearchResults.vue'
import { searchMulti } from '@/lib/tmdbFetch'

const props = defineProps<{
  userLists: ListFull[]
  selectedList: ListFull | null
}>()

type ListKey = keyof ListFull

const emit = defineEmits<{
  open: [list: ListFull]
  close: []
  'update-setting': [key: ListKey, value: ListFull[ListKey]]
  'delete-list': [id: string]
  'add-movie': [movie: MovieItem]
  'remove-movie': [id: string | number]
  'create-list': [ Partial<ListFull>]
}>()

const isCreateListOpen = ref(false)
const createListForm = ref<Partial<ListFull>>({
  name: '', description: '', public: 'yes', comments: 'yes', sortBy: 'original-asc'
})

const movieSearchQuery = ref('')
const searchedMovies = ref<MovieItem[]>([])
const isSearching = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

async function searchMovies() {
  const q = movieSearchQuery.value.trim()
  
  if (!q) { 
    searchedMovies.value = []
    isSearching.value = false
    return 
  }
  
  // Debounce search
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  isSearching.value = true
  
  searchTimeout = setTimeout(async () => {
    try {
      const results = await searchMulti(q)
      searchedMovies.value = results
    } catch (error) {
      
      searchedMovies.value = []
    } finally {
      isSearching.value = false
    }
  }, 500) // Wait 500ms after user stops typing
}

function submitCreateList() {
  emit('create-list', createListForm.value)
  isCreateListOpen.value = false
}
</script>

<template>
  <div class="space-y-5">
    <div v-if="!selectedList" class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">My Lists</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Create and manage your custom lists</p>
        </div>
        <button class="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors text-sm"
                @click="isCreateListOpen = true">+ Create List</button>
      </div>

      <div v-if="userLists.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-12 text-sm">
        You haven't created any lists yet. Start by creating your first list!
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="list in userLists" :key="list.id"
             @click="emit('open', list)"
             class="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all cursor-pointer group">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-gray-700 transition-colors">{{ list.name }}</h4>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ list.description }}</p>
          <div class="flex items-center justify-between">
            <span class="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ list.itemCount || 0 }} items</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ list.public === 'yes' ? 'Public' : 'Private' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700 mb-5">
        <button @click="emit('close')" class="mb-4 text-gray-700 hover:text-gray-900 dark:text-gray-100 font-medium flex items-center space-x-1 transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Lists</span>
        </button>

        <div class="mb-4">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ selectedList.name }}</h3>
          <p class="text-gray-600 text-sm">{{ selectedList.description }}</p>
        </div>

        <div class="mb-4">
          <span class="text-sm font-medium text-gray-600">{{ selectedList.movies?.length || 0 }} items</span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex items-center space-x-2">
              <label class="text-xs font-medium text-gray-600 whitespace-nowrap">Visibility:</label>
              <select
                :value="selectedList.public"
                @change="emit('update-setting','public', ($event.target as HTMLSelectElement).value)"
                class="border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white/5 dark:bg-gray-900/30"
              >
                <option value="yes">Public</option>
                <option value="no">Private</option>
              </select>
            </div>

            <div class="flex items-center space-x-2">
              <label class="text-xs font-medium text-gray-600 whitespace-nowrap">Sort by:</label>
              <select
                :value="selectedList.sortBy"
                @change="emit('update-setting','sortBy', ($event.target as HTMLSelectElement).value)"
                class="border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white/5 dark:bg-gray-900/30"
              >
                <option value="original-asc">Original (A-Z)</option>
                <option value="original-desc">Original (Z-A)</option>
                <option value="date-added">Date Added</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <button
            @click="emit('delete-list', selectedList.id)"
            class="text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap border border-red-600"
          >
            Delete List
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="lg:col-span-1">
          <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700 lg:sticky lg:top-4">
            <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Add Movies/TV Shows</h4>
            <div class="mb-4 relative">
              <input
                v-model="movieSearchQuery"
                @input="searchMovies"
                type="text"
                placeholder="Search titles..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              <div v-if="isSearching" class="absolute right-3 top-1/2 -translate-y-1/2">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-900"></div>
              </div>
            </div>

            <SearchResults
              :query="movieSearchQuery"
              :results="searchedMovies"
              :is-loading="isSearching"
              @add="movie => emit('add-movie', movie)"
            />
          </div>
        </div>        <div class="lg:col-span-2">
          <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
            <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">
              Items in this list ({{ selectedList.movies?.length || 0 }})
            </h4>

            <div v-if="!selectedList.movies || selectedList.movies.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1 1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <p class="font-medium mb-1">No items yet</p>
              <p class="text-sm">Search and add movies or TV shows to get started!</p>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div v-for="movie in selectedList.movies" :key="movie.id" class="group">
                <div class="relative aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden group-hover:ring-2 group-hover:ring-gray-900 transition-all">
                  <img v-if="movie.poster" :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 left-0 right-0 p-2.5">
                      <button
                        class="w-full bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors"
                        @click.stop="emit('remove-movie', movie.id)"
                      >Remove</button>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2" :title="movie.title">{{ movie.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ movie.type }} • {{ movie.year }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create List Modal -->
      <div v-if="isCreateListOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" @click.self="isCreateListOpen = false">
        <div class="w-full max-w-lg bg-white/5 dark:bg-gray-900/30 rounded-xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100">
            <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">Create New List: Step 1</h4>
            <button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 text-xl" @click="isCreateListOpen = false">✕</button>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
              <input v-model="createListForm.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="My awesome list" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea v-model="createListForm.description" rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" placeholder="Describe your list..."></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Public List?</label>
                <select v-model="createListForm.public" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Show Comments</label>
                <select v-model="createListForm.comments" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Sort By</label>
                <select v-model="createListForm.sortBy" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="original-asc">Original Ascending</option>
                  <option value="original-desc">Original Descending</option>
                  <option value="date-added">Date Added</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 flex justify-end gap-2">
            <button class="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm" @click="isCreateListOpen = false">Cancel</button>
            <button class="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md text-sm" @click="submitCreateList()">Continue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
