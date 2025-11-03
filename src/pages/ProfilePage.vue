<template>
  <div class="min-h-screen bg-gray-50 text-black">
    <BaseNavBar />
    
    <!-- Profile Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">PROFILE</h1>
        <!-- <RouterLink to="/profile/edit" class="bg-blue-600 hover:bg-blue-700  px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-white">
          Edit profile
        </RouterLink> -->
      </div>

      <!-- Profile Summary -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <!-- Profile Picture -->
          <div class="flex-shrink-0">
            <img :src="profile.avatarDataUrl || defaultAvatar" alt="pfp" class="w-24 h-24 rounded-full object-cover bg-gray-300" />
          </div>

          <!-- Username -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-semibold text-black mb-4">{{ profile.username || 'Username' }}</h2>
          </div>

          <!-- Statistics Circles -->
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <!-- Average Movie Score -->
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span class="text-green-600 font-bold text-lg">{{ averageMovieScore }}%</span>
              </div>
              <p class="text-sm text-gray-600">Average Movie Score</p>
            </div>

            <!-- Average TV Score -->
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span class="text-blue-600 font-bold text-lg">{{ averageTvScore }}%</span>
              </div>
              <p class="text-sm text-gray-600">Average TV Score</p>
            </div>

            <!-- Average Mood -->
            <div class="text-center">
              <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span class="text-yellow-600 text-2xl">{{ averageMoodEmoji }}</span>
              </div>
              <p class="text-sm text-gray-600">Average Mood</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- Top Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Most Watched Genres -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Most Watched Genres</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Action</span>
                <span class="text-sm text-gray-500">25 movies</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Comedy</span>
                <span class="text-sm text-gray-500">18 movies</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Drama</span>
                <span class="text-sm text-gray-500">15 movies</span>
              </div>
            </div>
          </div>

          <!-- Most Watched Moods -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Most Watched Moods</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">😊 Happy</span>
                <span class="text-sm text-gray-500">22 movies</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">😢 Sad</span>
                <span class="text-sm text-gray-500">12 movies</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">😱 Thrilled</span>
                <span class="text-sm text-gray-500">8 movies</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Favourites -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Favourites</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-16 bg-gray-200 rounded"></div>
                <div>
                  <p class="font-medium text-gray-900">Inception</p>
                  <p class="text-sm text-gray-500">2010</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-12 h-16 bg-gray-200 rounded"></div>
                <div>
                  <p class="font-medium text-gray-900">Parasite</p>
                  <p class="text-sm text-gray-500">2019</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Friends -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Friends</h3>
              <span class="text-sm text-gray-500">12 friends</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              <div v-for="i in 8" :key="i" class="text-center">
                <div class="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <p class="text-xs text-gray-600">Friend {{ i }}</p>
              </div>
            </div>
            <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors">
              + Add Friends
            </button>
          </div>
        </div>

        <!-- Badges -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Badges</h3>
          <p class="text-sm text-gray-600 mb-4">
            Badges for completed watch parties and/or challenges (e.g. watch 4 Marvel movies in a row or watch a movie with > 10 friends)
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="i in 6" :key="i" class="text-center">
              <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span class="text-yellow-600 text-2xl">🏆</span>
              </div>
              <p class="text-xs text-gray-600">Badge {{ i }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lists Tab -->
      <div v-if="activeTab === 'lists'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-2xl font-semibold text-gray-900">My Lists</h3>
            <button
              class="bg-blue-600 hover:bg-blue-700  px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-white"
              @click="isCreateListOpen = true"
            >
              Create List
            </button>
          </div>
          <p class="text-gray-600">You haven't created any lists.</p>
        </div>

        <!-- Create List Modal -->
        <div
          v-if="isCreateListOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          @click.self="isCreateListOpen = false"
        >
          <div class="w-full max-w-2xl bg-white rounded-xl shadow-lg">
            <div class="flex items-center justify-between px-6 py-4 border-b">
              <h4 class="text-lg font-semibold text-gray-900">Create New List: Step 1</h4>
              <button class="text-gray-500 hover:text-gray-700" @click="isCreateListOpen = false">✕</button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input v-model="createListForm.name" type="text" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="My awesome list" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="createListForm.description" rows="3" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe your list"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Public List?</label>
                  <select v-model="createListForm.public" class="w-full border rounded-lg px-3 py-2">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Show Comments</label>
                  <select v-model="createListForm.comments" class="w-full border rounded-lg px-3 py-2">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select v-model="createListForm.sortBy" class="w-full border rounded-lg px-3 py-2">
                    <option value="original-asc">Original Ascending</option>
                    <option value="original-desc">Original Descending</option>
                    <option value="date-added">Date Added</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="px-6 py-4 border-t flex justify-end gap-3">
              <button class="px-3 py-1.5 rounded-md border text-sm" @click="isCreateListOpen = false">Cancel</button>
              <button class="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm" @click="submitCreateList()">Continue</button>
            </div>
          </div>
        </div>
      </div>

      <!-- My Ratings Tab -->
      <div v-if="activeTab === 'ratings'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 class="text-2xl font-semibold text-gray-900">My Ratings</h3>
              <div class="mt-1 text-sm text-gray-600 flex items-center gap-4">
                <button class="px-2 py-1 rounded border" :class="ratingsView==='movies' ? 'bg-gray-100' : ''" @click="ratingsView='movies'">Movies {{ ratingsCounts.movies }}</button>
                <button class="px-2 py-1 rounded border" :class="ratingsView==='tv' ? 'bg-gray-100' : ''" @click="ratingsView='tv'">TV {{ ratingsCounts.tv }}</button>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Filter by:</span>
                <select v-model="ratingsFilters.filterBy" class="border rounded-lg px-3 py-2 text-sm">
                  <option value="mood">Mood</option>
                  <option value="genre">Genre</option>
                  <option value="date">Date Added</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Order:</span>
                <select v-model="ratingsFilters.order" class="border rounded-lg px-3 py-2 text-sm">
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mt-6 text-gray-700" v-if="ratingsView==='movies' && ratingsCounts.movies===0">You haven't rated any movies.</div>
          <div class="mt-6 text-gray-700" v-else-if="ratingsView==='tv' && ratingsCounts.tv===0">You haven't rated any TV shows.</div>
        </div>
      </div>

      <!-- My Watchlists Tab -->
      <div v-if="activeTab === 'watchlists'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 class="text-2xl font-semibold text-gray-900">My Watchlist</h3>
              <div class="mt-1 text-sm text-gray-600 flex items-center gap-4">
                <button class="px-2 py-1 rounded border" :class="watchlistView==='movies' ? 'bg-gray-100' : ''" @click="watchlistView='movies'">Movies {{ watchlistCounts.movies }}</button>
                <button class="px-2 py-1 rounded border" :class="watchlistView==='tv' ? 'bg-gray-100' : ''" @click="watchlistView='tv'">TV {{ watchlistCounts.tv }}</button>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Filter by:</span>
                <select v-model="watchlistFilters.filterBy" class="border rounded-lg px-3 py-2 text-sm">
                  <option value="mood">Mood</option>
                  <option value="genre">Genre</option>
                  <option value="date">Date Added</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Order:</span>
                <select v-model="watchlistFilters.order" class="border rounded-lg px-3 py-2 text-sm">
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mt-6 text-gray-700" v-if="watchlistView==='movies' && watchlistCounts.movies===0">You haven't added any movies to your watchlist</div>
          <div class="mt-6 text-gray-700" v-else-if="watchlistView==='tv' && watchlistCounts.tv===0">You haven't added any TV shows to your watchlist</div>
        </div>
      </div>
    </div>

    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'lists', name: 'Lists' },
  { id: 'ratings', name: 'My Ratings' },
  { id: 'watchlists', name: 'My Watchlists' }
]

// Lists modal state and form
const isCreateListOpen = ref(false)
const createListForm = ref({
  name: '',
  description: '',
  public: 'yes',
  comments: 'yes',
  sortBy: 'original-asc'
})
const submitCreateList = () => {
  // Placeholder submit; integrate with backend later
  isCreateListOpen.value = false
}

// Ratings and Watchlist states
const ratingsCounts = ref({ movies: 0, tv: 0 })
const ratingsFilters = ref({ filterBy: 'mood', order: 'desc' })

const watchlistCounts = ref({ movies: 0, tv: 0 })
const watchlistFilters = ref({ filterBy: 'mood', order: 'desc' })

// Toggle views for Ratings and Watchlist
const ratingsView = ref<'movies' | 'tv'>('movies')
const watchlistView = ref<'movies' | 'tv'>('movies')

// Load profile from localStorage
const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" fill="%23e5e7eb"/></svg>'
const profile = ref<{ username?: string; avatarDataUrl?: string }>({})
onMounted(() => {
  const saved = localStorage.getItem('wb_profile')
  if (saved) profile.value = JSON.parse(saved)
})

// Averages derived from ratings (placeholder; integrate real data later)
const averageMovieScore = computed(() => 0)
const averageTvScore = computed(() => 0)
const averageMoodEmoji = computed(() => '😊')

// Edit profile moved to dedicated page
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
