<script setup lang="ts">
import { ref, watch, h } from 'vue'
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

// Mood to Genre Mapping
const moodGenreMap: Record<Mood, number[]> = {
  happy: [35, 10751, 16, 10749, 10402],
  sad: [18, 10749, 99],
  excited: [28, 12, 53, 878],
  relaxed: [10749, 99, 16, 14],
  scared: [27, 53, 9648],
  romantic: [10749, 18, 35],
  curious: [99, 9648, 878, 36],
  motivated: [18, 99, 28, 10752]
}

// Expanded keywords
const moodKeywords: Record<Mood, string[]> = {
  happy: ['feel-good', 'uplifting', 'comedy', 'celebration', 'friendship', 'fun', 'lighthearted', 'cheerful', 'joyful', 'optimistic', 'laugh', 'funny', 'humor', 'delight', 'happy'],
  sad: ['tragedy', 'loss', 'melancholy', 'tearjerker', 'heartbreaking', 'sorrowful', 'grief', 'death', 'separation', 'sad', 'cry', 'tears', 'pain'],
  excited: ['adrenaline', 'intense', 'suspenseful', 'action-packed', 'thrilling', 'fast-paced', 'explosive', 'edge-of-seat', 'high-stakes', 'chase', 'battle', 'fight', 'danger', 'exciting'],
  relaxed: ['peaceful', 'slow-burn', 'contemplative', 'slice-of-life', 'calm', 'tranquil', 'meditative', 'gentle', 'soothing', 'quiet', 'mellow', 'serene', 'cozy'],
  scared: ['horror', 'terrifying', 'creepy', 'supernatural', 'haunted', 'frightening', 'disturbing', 'nightmare', 'monster', 'ghost', 'evil', 'killer', 'dark', 'scary'],
  romantic: ['love', 'romance', 'relationship', 'passion', 'heart', 'dating', 'couples', 'affection', 'soulmate', 'love-story', 'kiss', 'lovers', 'wedding'],
  curious: ['mystery', 'investigation', 'discovery', 'exploration', 'unknown', 'puzzle', 'enigma', 'science', 'knowledge', 'learning', 'secret', 'detective', 'truth'],
  motivated: ['inspiration', 'triumph', 'perseverance', 'success', 'determination', 'achievement', 'hero', 'overcome', 'champion', 'victory', 'dream', 'ambition', 'courage']
}

// Mood Icons
const getMoodIcon = (mood: string) => {
  const icons: Record<string, any> = {
    happy: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    sad: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    excited: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
    ]),
    relaxed: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' })
    ]),
    scared: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('circle', { cx: '12', cy: '12', r: '9', 'stroke-width': '2' }),
      h('circle', { cx: '9', cy: '9.5', r: '0.5', fill: 'currentColor' }),
      h('circle', { cx: '15', cy: '9.5', r: '0.5', fill: 'currentColor' }),
      h('circle', { cx: '12', cy: '15', r: '2.5', 'stroke-width': '1.8' })
    ]),
    romantic: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
    ]),
    curious: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    motivated: () => h('svg', { class: 'w-19 h-19', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
    ])
  }
  return icons[mood] || icons.happy
}

// Return score instead of just mood (so we can rank by accuracy)
const analyzeMoodFromOverview = (overview: string, genres: number[]): { mood: Mood | null, score: number } => {
  if (!overview) {
    // If no overview, use genres only
    const genreScores: Record<Mood, number> = {
      happy: 0, sad: 0, excited: 0, relaxed: 0, 
      scared: 0, romantic: 0, curious: 0, motivated: 0
    }
    
    Object.entries(moodGenreMap).forEach(([mood, genreIds]) => {
      const genreMatches = genres.filter(g => genreIds.includes(g)).length
      genreScores[mood as Mood] += genreMatches * 0.5
    })
    
    const sortedMoods : any = Object.entries(genreScores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0)
    
    return sortedMoods.length > 0 
      ? { mood: sortedMoods[0][0] as Mood, score: sortedMoods[0][1] }
      : { mood: null, score: 0 }
  }
  
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
  
  // Genre weight
  Object.entries(moodGenreMap).forEach(([mood, genreIds]) => {
    const genreMatches = genres.filter(g => genreIds.includes(g)).length
    moodScores[mood as Mood] += genreMatches * 0.5
  })
  
  // Find mood with highest score
  const sortedMoods : any = Object.entries(moodScores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0)
  
  return sortedMoods.length > 0 
    ? { mood: sortedMoods[0][0] as Mood, score: sortedMoods[0][1] }
    : { mood: null, score: 0 }
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

// Fetch more pages and sort by accuracy
const fetchRecommendations = async () => {
  if (!TMDB_API_KEY) return

  isLoading.value = true
  try {
    const genreIds = getGenreIds()
    const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : ''
    
    // Fetch 2 pages instead of 1 for better selection
    const allResults: any[] = []
    for (let page = 1; page <= 2; page++) {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=${page}${genreQuery}`
      )
      
      if (response.ok) {
        const data = await response.json()
        allResults.push(...data.results)
      }
    }
    
    let filteredResults = allResults
    
    if (selectedMood.value && !selectedGenres.value.length) {
      //Analyze and SORT by score
      const moviesWithMood = allResults.map((item: any) => {
        const analysis = analyzeMoodFromOverview(item.overview || '', item.genre_ids || [])
        return {
          ...item,
          detectedMood: analysis.mood,
          moodScore: analysis.score
        }
      })
      
      // Sort: Exact mood matches first (by score), then others
      filteredResults = moviesWithMood.sort((a: any, b: any) => {
        const aIsMatch = a.detectedMood === selectedMood.value
        const bIsMatch = b.detectedMood === selectedMood.value
        
        // Exact matches go first
        if (aIsMatch && !bIsMatch) return -1
        if (!aIsMatch && bIsMatch) return 1
        
        // Within same category, sort by score
        if (aIsMatch && bIsMatch) {
          return b.moodScore - a.moodScore
        }
        
        // Non-matches sorted by rating
        return b.vote_average - a.vote_average
      })
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
  } catch (err) {
    // console.error('Error fetching recommendations:', err)
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
      let selectedMovie = null
      
      if (selectedMood.value && !selectedGenres.value.length) {
        const moviesWithMood = data.results.map((item: any) => {
          const analysis = analyzeMoodFromOverview(item.overview || '', item.genre_ids || [])
          return {
            ...item,
            detectedMood: analysis.mood,
            moodScore: analysis.score
          }
        })
        
        // Prioritize higher scores
        const moodMatches = moviesWithMood
          .filter((item: any) => item.detectedMood === selectedMood.value)
          .sort((a: any, b: any) => b.moodScore - a.moodScore)
        
        if (moodMatches.length > 0) {
          // Pick from top 5 matches randomly
          const topMatches = moodMatches.slice(0, 5)
          selectedMovie = topMatches[Math.floor(Math.random() * topMatches.length)]
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
    // console.error('Error shuffling:', err)
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
  <div class="min-h-screen app-bg dark:bg-gray-1000 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-6xl mx-auto space-y-8">
        
        <!-- Header -->
        <div class="py-6 text-center space-y-14">
          <h1 class="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight flex items-center justify-center gap-3">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Get Recommendations
          </h1>
          <p class="text-lg text-gray-400">
            Tell us your mood and preferences, we'll find the perfect movie for you
          </p>
        </div>

        <!-- Mood Selection -->
        <div class="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-9">
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-1 text-white">How are you feeling?</h2>
            <p class="text-sm text-gray-400">Select your current mood</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              v-for="mood in moods"
              :key="mood.value"
              @click="selectedMood = selectedMood === mood.value ? null : mood.value"
              :class="[
                'h-30 rounded-lg border-2 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-2 min-h-[130px] shadow-lg',
                selectedMood === mood.value
                  ? 'border-blue-400 bg-blue-500/20 shadow-blue-500/30'
                  : 'border-slate-600/50 bg-slate-700/40 hover:border-slate-500 hover:shadow-xl'
              ]"
            >
              <component :is="getMoodIcon(mood.value)" :class="[mood.color]" />
              <p class="font-medium text-base text-white">{{ mood.label }}</p>
            </button>
          </div>
        </div>

        <!-- Genre Selection -->
        <div class="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-8">
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-1 text-white">Select Genres (Optional)</h2>
            <p class="text-sm text-gray-400">Choose one or more genres to refine recommendations</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="genre in genres"
              :key="genre"
              @click="toggleGenre(genre)"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md',
                selectedGenres.includes(genre)
                  ? 'bg-blue-500 text-white shadow-blue-500/40'
                  : 'bg-slate-700/60 text-gray-300 hover:bg-slate-600/60 border border-slate-600/50'
              ]"
            >
              {{ genre }}
            </button>
          </div>
        </div>

        <!-- Shuffle Section -->
        <div class="relative overflow-hidden bg-purple-900 rounded-lg p-8 border border-purple-700/50 shadow-2xl">
          <!-- Decorative Grid Icon -->
          <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
            <svg class="w-32 h-32 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke-width="2"/>
            </svg>
          </div>
          
          <!-- Content in One Row -->
          <div class="relative z-10 flex items-center justify-between gap-8">
            <!-- Left: Text Content -->
            <div class="flex-1 max-w-xl">
              <h2 class="text-xl font-bold mb-2">Find a Random Movie</h2>
              <p class="text-purple-200 text-base mb-0 leading-relaxed">
                Can't decide what to watch? Let our random movie generator pick one for you!
              </p>
            </div>
            
            <!-- Right: Button -->
            <button
              @click="handleShuffle"
              class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-base shadow-xl shadow-purple-900/50 hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/70 flex-shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Shuffle!
            </button>
          </div>
        </div>

        <!-- Shuffle Result -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="shuffleResult" class="bg-slate-800/80 backdrop-blur rounded-lg p-5 border border-purple-500/50 shadow-2xl shadow-purple-900/30">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 class="text-lg font-bold text-purple-300">Your Random Pick</h3>
            </div>
            
            <div 
              @click="navigateToMovie(shuffleResult.id)"
              class="flex gap-5 cursor-pointer group"
            >
              <!-- Movie Poster -->
              <div class="w-28 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900 shadow-lg ring-2 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all">
                <img
                  v-if="shuffleResult.thumbnailUrl"
                  :src="shuffleResult.thumbnailUrl"
                  :alt="shuffleResult.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <!-- Movie Details -->
              <div class="flex-1 min-w-0 space-y-2">
                <h4 class="text-xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {{ shuffleResult.title }}
                </h4>
                <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {{ shuffleResult.description }}
                </p>
                
                <!-- Meta Info -->
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <div v-if="shuffleResult.releaseYear" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="font-medium">{{ shuffleResult.releaseYear }}</span>
                  </div>
                  <div v-if="shuffleResult.duration" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">{{ shuffleResult.duration }}m</span>
                  </div>
                  <div v-if="shuffleResult.rating" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="font-medium text-yellow-500">{{ shuffleResult.rating.toFixed(1) }}</span>
                  </div>
                </div>
                
                <!-- Genre Tags -->
                <div v-if="shuffleResult.genres" class="flex flex-wrap gap-1.5 pt-1">
                  <span
                    v-for="(genre, idx) in shuffleResult.genres.split(',')"
                    :key="idx"
                    class="px-2.5 py-0.5 bg-purple-900/50 text-purple-300 text-xs font-medium rounded border border-purple-700/50"
                  >
                    {{ genre.trim() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Recommendations -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-white">Recommended for You</h2>
          
          <!-- Loading State -->
          <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="i in 6"
              :key="i"
              class="bg-slate-800/60 rounded-lg shadow-xl overflow-hidden animate-pulse border border-slate-700/50"
            >
              <div class="aspect-video bg-slate-700"/>
              <div class="p-5 space-y-3">
                <div class="h-6 bg-slate-700 rounded"/>
                <div class="h-4 bg-slate-700 rounded w-2/3"/>
              </div>
            </div>
          </div>

          <!-- Recommendations Grid -->
          <div v-else-if="recommendations.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-18">
            <div
              v-for="item in recommendations"
              :key="item.id"
              @click="navigateToMovie(item.id)"
              class="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden cursor-pointer group hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 border border-slate-700/50 hover:scale-105 w-80 h-125 p-3 m-2"
            >
              <div class="aspect-video relative overflow-hidden bg-slate-900 w-full h-80">
                <img
                  v-if="item.thumbnailUrl"
                  :src="item.thumbnailUrl"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="p-6">
                <h3 class="font-bold text-lg mb-2 line-clamp-1 text-white group-hover:text-blue-400 transition-colors">{{ item.title }}</h3>
                <p class="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {{ item.description }}
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
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
          <div v-else class="bg-slate-800/60 backdrop-blur-sm rounded-lg shadow-xl p-16 text-center border border-slate-700/50">
            <svg class="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p class="text-gray-400 text-lg">
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



.app-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
}
</style>