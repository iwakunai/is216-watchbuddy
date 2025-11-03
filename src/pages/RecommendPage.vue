<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUser } from '@clerk/vue'
import { useRouter } from 'vue-router'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

// Auth
const { user, isLoaded } = useUser()
const router = useRouter()

// Mood and Genre State
type Mood = 'happy' | 'sad' | 'excited' | 'relaxed' | 'scared' | 'romantic' | 'curious' | 'motivated'
const selectedMood = ref<Mood | null>(null)
const selectedGenres = ref<string[]>([])

// Data State
const recommendations = ref<any[]>([])
const shuffleResult = ref<any | null>(null)
const isLoading = ref(false)

// Moods Configuration
const moods = [
  { value: 'happy' as Mood, label: 'Happy', icon: '😁', color: 'text-yellow-500' },
  { value: 'sad' as Mood, label: 'Sad', icon: '😢', color: 'text-blue-500' },
  { value: 'excited' as Mood, label: 'Excited', icon: '⚡', color: 'text-orange-500' },
  { value: 'relaxed' as Mood, label: 'Relaxed', icon: '😌', color: 'text-green-500' },
  { value: 'scared' as Mood, label: 'Scared', icon: '😱', color: 'text-purple-500' },
  { value: 'romantic' as Mood, label: 'Romantic', icon: '💕', color: 'text-pink-500' },
  { value: 'curious' as Mood, label: 'Curious', icon: '🤔', color: 'text-indigo-500' },
  { value: 'motivated' as Mood, label: 'Motivated', icon: '💪', color: 'text-red-500' },
]

// Genres List
const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Musical', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
]

// TMDB Genre ID Mapping
const genreIdMap: Record<string, number> = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Fantasy': 14,
  'Horror': 27,
  'Musical': 10402,
  'Mystery': 9648,
  'Romance': 10749,
  'Science Fiction': 878,
  'Thriller': 53,
  'War': 10752,
  'Western': 37
}

// Mood to Genre Mapping (Layer 2: Genre-Based)
const moodGenreMap: Record<Mood, number[]> = {
  happy: [35, 10751, 16, 10749, 10402], // Comedy, Family, Animation, Romance, Musical
  sad: [18, 10749, 99], // Drama, Romance, Documentary
  excited: [28, 12, 53, 878], // Action, Adventure, Thriller, Sci-Fi
  relaxed: [10749, 99, 16, 14], // Romance, Documentary, Animation, Fantasy
  scared: [27, 53, 9648], // Horror, Thriller, Mystery
  romantic: [10749, 18, 35], // Romance, Drama, Comedy
  curious: [99, 9648, 878, 36], // Documentary, Mystery, Sci-Fi, History
  motivated: [18, 99, 28, 10752] // Drama, Documentary, Action, War
}

// Layer 1: Keyword-Based Mood Detection
const moodKeywords: Record<Mood, string[]> = {
  happy: ['feel-good', 'uplifting', 'comedy', 'celebration', 'friendship', 'fun', 'lighthearted', 'cheerful', 'joyful', 'optimistic'],
  sad: ['tragedy', 'loss', 'melancholy', 'tearjerker', 'emotional', 'heartbreaking', 'sorrowful', 'grief', 'death', 'separation'],
  excited: ['adrenaline', 'intense', 'suspenseful', 'action-packed', 'thrilling', 'fast-paced', 'explosive', 'edge-of-seat', 'high-stakes', 'chase'],
  relaxed: ['peaceful', 'slow-burn', 'contemplative', 'slice-of-life', 'calm', 'tranquil', 'meditative', 'gentle', 'soothing', 'quiet'],
  scared: ['horror', 'terrifying', 'creepy', 'supernatural', 'haunted', 'frightening', 'disturbing', 'nightmare', 'monster', 'ghost'],
  romantic: ['love', 'romance', 'relationship', 'passion', 'heart', 'dating', 'couples', 'affection', 'soulmate', 'love-story'],
  curious: ['mystery', 'investigation', 'discovery', 'exploration', 'unknown', 'puzzle', 'enigma', 'science', 'knowledge', 'learning'],
  motivated: ['inspiration', 'triumph', 'perseverance', 'success', 'determination', 'achievement', 'hero', 'overcome', 'champion', 'victory']
}

// Overview text keywords for mood detection (Layer 3: Text Analysis)
const analyzeMoodFromOverview = (overview: string, genres: number[]): Mood | null => {
  if (!overview) return null
  
  const lowerOverview = overview.toLowerCase()
  const moodScores: Record<Mood, number> = {
    happy: 0, sad: 0, excited: 0, relaxed: 0, 
    scared: 0, romantic: 0, curious: 0, motivated: 0
  }
  
  // Check keywords in overview
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerOverview.includes(keyword)) {
        moodScores[mood as Mood] += 1
      }
    })
  })
  
  // Boost score based on genres
  Object.entries(moodGenreMap).forEach(([mood, genreIds]) => {
    const genreMatches = genres.filter(g => genreIds.includes(g)).length
    moodScores[mood as Mood] += genreMatches * 0.5
  })
  
  // Find mood with highest score
  const sortedMoods = Object.entries(moodScores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0)
  
  return sortedMoods.length > 0 && sortedMoods[0] ? sortedMoods[0][0] as Mood : null
}

// Functions
const toggleGenre = (genre: string) => {
  const index = selectedGenres.value.indexOf(genre)
  if (index > -1) {
    selectedGenres.value.splice(index, 1)
  } else {
    selectedGenres.value.push(genre)
  }
}

const getGenreIds = (): number[] => {
  if (selectedGenres.value.length > 0) {
    return selectedGenres.value
      .map(g => genreIdMap[g])
      .filter((id): id is number => id !== undefined)
  }
  if (selectedMood.value) {
    return moodGenreMap[selectedMood.value]
  }
  return []
}

const fetchRecommendations = async () => {
  if (!TMDB_API_KEY) return

  isLoading.value = true
  try {
    const genreIds = getGenreIds()
    const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : ''
    
    // Fetch more results for better mood matching
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=1${genreQuery}`
    )
    
    if (response.ok) {
      const data = await response.json()
      
      // If mood is selected, analyze and filter by mood
      let filteredResults = data.results
      
      if (selectedMood.value && !selectedGenres.value.length) {
        // Analyze each movie's mood based on overview and genres
        const moviesWithMood = data.results.map((item: any) => ({
          ...item,
          detectedMood: analyzeMoodFromOverview(item.overview || '', item.genre_ids || [])
        }))
        
        // Filter movies that match the selected mood
        filteredResults = moviesWithMood.filter((item: any) => 
          item.detectedMood === selectedMood.value
        )
        
        // If no exact matches, fall back to original results
        if (filteredResults.length === 0) {
          filteredResults = data.results
        }
      }
      
      recommendations.value = filteredResults.slice(0, 9).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.overview,
        thumbnailUrl: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
        releaseYear: item.release_date ? new Date(item.release_date).getFullYear() : null,
        duration: null,
        genres: item.genre_ids?.map((id: number) => 
          Object.entries(genreIdMap).find(([_, gid]) => gid === id)?.[0]
        ).filter(Boolean).join(', ')
      }))
    }
  } catch (err) {
    console.error('Error fetching recommendations:', err)
  } finally {
    isLoading.value = false
  }
}

const handleShuffle = async () => {
  if (!TMDB_API_KEY) return

  try {
    const genreIds = getGenreIds()
    const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : ''
    const randomPage = Math.floor(Math.random() * 5) + 1
    
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=${randomPage}${genreQuery}`
    )
    
    if (response.ok) {
      const data = await response.json()
      
      // If mood is selected, try to find a matching movie
      let selectedMovie = null
      
      if (selectedMood.value && !selectedGenres.value.length) {
        const moviesWithMood = data.results.map((item: any) => ({
          ...item,
          detectedMood: analyzeMoodFromOverview(item.overview || '', item.genre_ids || [])
        }))
        
        const moodMatches = moviesWithMood.filter((item: any) => 
          item.detectedMood === selectedMood.value
        )
        
        if (moodMatches.length > 0) {
          selectedMovie = moodMatches[Math.floor(Math.random() * moodMatches.length)]
        }
      }
      
      // Fall back to random if no mood match
      if (!selectedMovie) {
        selectedMovie = data.results[Math.floor(Math.random() * data.results.length)]
      }
      
      // Fetch movie details for runtime
      const detailsResponse = await fetch(
        `${TMDB_BASE_URL}/movie/${selectedMovie.id}?api_key=${TMDB_API_KEY}`
      )
      
      const details = detailsResponse.ok ? await detailsResponse.json() : null
      
      shuffleResult.value = {
        id: selectedMovie.id,
        title: selectedMovie.title,
        description: selectedMovie.overview,
        thumbnailUrl: selectedMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${selectedMovie.poster_path}` : null,
        releaseYear: selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : null,
        duration: details?.runtime || null,
        genres: details?.genres?.map((g: any) => g.name).join(', ') || ''
      }
    }
  } catch (err) {
    console.error('Error shuffling:', err)
  }
}

const navigateToMovie = (id: number) => {
  router.push(`/movie/${id}`)
}

// Watch for changes and fetch recommendations
watch([selectedMood, selectedGenres], () => {
  if (user.value) {
    fetchRecommendations()
  }
}, { deep: true })

// Initial load
watch([user, isLoaded], ([currentUser, loaded]) => {
  if (loaded && currentUser) {
    fetchRecommendations()
  }
})
</script>

<template>
  <BaseNavBar />
  <div class="min-h-screen bg-white/5 dark:bg-gray-900/30 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-6xl mx-auto space-y-8">
        
        <!-- Header -->
        <div class="text-center space-y-4">
          <h1 class="text-4xl font-bold flex items-center justify-center gap-3">
            <svg class="w-8 h-8 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Get Recommendations
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Tell us your mood and preferences, we'll find the perfect movie for you
          </p>
        </div>

        <!-- Mood Selection -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-1">How are you feeling?</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Select your current mood</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="mood in moods"
              :key="mood.value"
              @click="selectedMood = selectedMood === mood.value ? null : mood.value"
              :class="[
                'p-4 rounded-lg border-2 transition-all hover:scale-105',
                selectedMood === mood.value
                  ? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-700'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              ]"
            >
              <div :class="['text-4xl mb-1', mood.color]">{{ mood.icon }}</div>
              <p class="font-medium text-sm">{{ mood.label }}</p>
            </button>
          </div>
        </div>

        <!-- Genre Selection -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-1">Select Genres (Optional)</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Choose one or more genres to refine recommendations</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="genre in genres"
              :key="genre"
              @click="toggleGenre(genre)"
              :class="[
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105',
                selectedGenres.includes(genre)
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              ]"
            >
              {{ genre }}
            </button>
          </div>
        </div>

        <!-- Shuffle Button -->
        <div class="flex justify-center">
          <button
            @click="handleShuffle"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Feeling Lucky? Shuffle!
          </button>
        </div>

        <!-- Shuffle Result -->
        <div v-if="shuffleResult" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border-2 border-green-500 dark:border-green-600 animate-fade-in">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 class="text-lg font-bold">Random Pick</h3>
          </div>
          <div 
            @click="navigateToMovie(shuffleResult.id)"
            class="flex gap-4 cursor-pointer group"
          >
            <div class="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                v-if="shuffleResult.thumbnailUrl"
                :src="shuffleResult.thumbnailUrl"
                :alt="shuffleResult.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0 space-y-2">
              <h4 class="text-lg font-bold line-clamp-1">{{ shuffleResult.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ shuffleResult.description }}</p>
              <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div v-if="shuffleResult.releaseYear" class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ shuffleResult.releaseYear }}
                </div>
                <div v-if="shuffleResult.duration" class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ shuffleResult.duration }}m
                </div>
              </div>
              <div v-if="shuffleResult.genres" class="flex flex-wrap gap-1.5">
                <span
                  v-for="(genre, idx) in shuffleResult.genres.split(',')"
                  :key="idx"
                  class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs rounded-full"
                >
                  {{ genre.trim() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold">Recommended for You</h2>
          
          <!-- Loading State -->
          <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="i in 6"
              :key="i"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse"
            >
              <div class="aspect-video bg-gray-300 dark:bg-gray-700" />
              <div class="p-4 space-y-2">
                <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded" />
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </div>

          <!-- Recommendations Grid -->
          <div v-else-if="recommendations.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in recommendations"
              :key="item.id"
              @click="navigateToMovie(item.id)"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden cursor-pointer group hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-500 transition-all border border-gray-200 dark:border-gray-700"
            >
              <div class="aspect-video relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  v-if="item.thumbnailUrl"
                  :src="item.thumbnailUrl"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-lg mb-1 line-clamp-1">{{ item.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {{ item.description }}
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div v-if="item.releaseYear" class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ item.releaseYear }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
            <p class="text-gray-600 dark:text-gray-400">
              No recommendations yet. Select a mood or genre to get started!
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
