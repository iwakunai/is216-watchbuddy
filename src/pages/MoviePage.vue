<template>
  <BaseNavBar />
  <!-- root with metallic background -->
  <div class="min-h-screen app-bg text-[#eaf0ff]">
    <!-- Hero Section -->
    <div class="relative overflow-hidden hero-panel border-b border-white/5">
      <div class="max-w-[1200px] mx-auto px-4 py-14">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight">
          <span class="hero-title">
            Discover Movies
          </span>
        </h1>
        <p class="hero-sub text-lg">Explore trending, latest, upcoming, and top-rated films — handpicked & comfy to browse.</p>

        <!-- Category Tabs -->
        <div class="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200',
              activeCategory === cat.id
                ? 'active-tab'
                : 'inactive-tab'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-[1200px] mx-auto p-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 rounded-full loader-ring mb-4"></div>
        <p class="text-[#98a1b3] text-lg">Loading amazing movies...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="my-8 p-6 rounded-2xl error-panel">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-200">Error Loading Movies</h3>
            <p class="text-red-300/80 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="movies.length === 0" class="my-8 p-12 rounded-2xl empty-panel text-center">
        <svg class="w-16 h-16 mx-auto text-[#98a1b3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <h3 class="text-xl font-semibold text-[#98a1b3]">No movies found</h3>
        <p class="text-[#6b7280] mt-2">Try switching to a different category</p>
      </div>

      <!-- Movies Grid (clickable cards that open /movie/:id) -->
      <div v-else class="mt-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <router-link
            v-for="movie in movies"
            :key="movie.id"
            :to="`/movie/${movie.id}`"
            class="group cursor-pointer"
          >
            <!-- Movie Card -->
            <div class="movie-card">
              <!-- Poster -->
              <div class="relative aspect-[2/3] overflow-hidden poster-wrap">
                <img
                  v-if="movie.poster"
                  :src="movie.poster"
                  :alt="movie.title"
                  class="w-full h-full object-cover poster-img"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>

                <!-- Rating Badge -->
                <div v-if="movie.rating" class="rating-badge">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-xs font-semibold text-white">{{ movie.rating }}</span>
                </div>

                <div class="poster-gradient"></div>
              </div>

              <!-- Info -->
              <div class="p-3">
                <h3 class="font-semibold text-sm line-clamp-2 group-hover:text-[#6b6bff] transition-colors" :title="movie.title">
                  {{ movie.title }}
                </h3>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-[#98a1b3]">{{ movie.year }}</span>
                  <span v-if="movie.voteCount" class="text-xs text-[#6b7280]">{{ formatVotes(movie.voteCount) }} votes</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Load More Button (compact version) -->
        <div v-if="!loading && movies.length > 0" class="flex justify-center mt-10 mb-6">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="load-more-btn load-more-sm"
            aria-live="polite"
            :aria-disabled="loadingMore"
          >
            <template v-if="!loadingMore">
              <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v12M8 12l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
              <span class="btn-label">Load more</span>
            </template>

            <template v-else>
              <span class="load-more-spinner" aria-hidden="true"></span>
              <span class="btn-label">Loading</span>
            </template>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import BaseNavBar from '@/components/NavBar/BaseNavBar.vue';

type MovieItem = {
  id: number;
  title: string;
  year?: string;
  poster?: string;
  rating?: number;
  voteCount?: number;
};

const categories = [
  { id: 'trending', label: '🔥 Trending', endpoint: 'trending/movie/week' },
  { id: 'latest', label: '🆕 Latest', endpoint: 'movie/now_playing' },
  { id: 'upcoming', label: '📅 Upcoming', endpoint: 'movie/upcoming' },
  { id: 'top_rated', label: '⭐ Top Rated', endpoint: 'movie/top_rated' },
];

const activeCategory = ref('trending');
const movies = ref<MovieItem[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function loadMovies(append = false) {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
    currentPage.value = 1;
  }
  
  error.value = null;

  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key not configured. Please set VITE_TMDB_API_KEY in your .env file');
    }

    const category = categories.find(c => c.id === activeCategory.value);
    if (!category) throw new Error('Invalid category');

    const url = `${TMDB_BASE_URL}/${category.endpoint}?api_key=${TMDB_API_KEY}&page=${currentPage.value}`;
    
    const resp = await fetch(url);
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.status_message || `${resp.status} ${resp.statusText}`);
    }
    
    const data = await resp.json();
    const results = data.results || [];
    
    const formattedMovies: MovieItem[] = results.map((m: any) => ({
      id: m.id,
      title: m.title || m.original_title || 'Untitled',
      year: m.release_date ? new Date(m.release_date).getFullYear().toString() : 'N/A',
      poster: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : undefined,
      rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : undefined,
      voteCount: m.vote_count,
    }));

    if (append) {
      movies.value = [...movies.value, ...formattedMovies];
    } else {
      movies.value = formattedMovies;
    }
  } catch (e: any) {
    error.value = e?.message ?? String(e);
    if (!append) {
      movies.value = [];
    }
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function loadMore() {
  currentPage.value++;
  loadMovies(true);
}

function formatVotes(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

watch(activeCategory, () => {
  loadMovies();
});

onMounted(() => {
  loadMovies();
});
</script>

<style scoped>
/* Compact Load More button */
.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1;
  border: 1px solid rgba(255,255,255,0.06);
  background: linear-gradient(90deg, rgba(107,107,255,0.12), rgba(139,92,246,0.12));
  color: #f8fbff;
  box-shadow: 0 6px 20px rgba(6,10,18,0.55), 0 2px 8px rgba(107,107,255,0.03);
  transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.load-more-sm { 
  padding: 6px 12px; 
  font-size: 0.86rem; 
  gap: 6px; 
}

.load-more-btn:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 12px 34px rgba(6,10,18,0.6); 
}

.load-more-btn:active { 
  transform: translateY(0); 
}

.load-more-btn[aria-disabled="true"],
.load-more-btn:disabled { 
  opacity: 0.65; 
  cursor: not-allowed; 
  transform: none; 
  box-shadow: none; 
}

.btn-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  stroke: currentColor;
  opacity: 0.95;
  transform: translateY(0.5px);
}

.btn-label { 
  display: inline-block; 
  margin-left: 0; 
}

.load-more-spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.14);
  border-top-color: #eaf0ff;
  animation: load-more-spin 0.9s linear infinite;
  box-sizing: border-box;
  display: inline-block;
}

@keyframes load-more-spin { 
  to { 
    transform: rotate(360deg); 
  } 
}

@media (max-width: 420px) {
  .load-more-btn { 
    padding: 6px 10px; 
    font-size: 0.82rem; 
    gap: 6px; 
  }
}

/* Background */
.app-bg {
  background: radial-gradient(1200px 400px at 10% 10%, rgba(255,255,255,0.02), transparent 8%),
              radial-gradient(800px 300px at 90% 80%, rgba(107,107,255,0.02), transparent 6%),
              linear-gradient(180deg, #07080a 0%, #0b1220 50%, #05060a 100%);
  position: relative;
  overflow: hidden;
}

.app-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(255,255,255,0.03) 0 1px,
    rgba(0,0,0,0) 1px 4px
  );
  pointer-events: none;
}

.hero-panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  backdrop-filter: blur(6px) saturate(110%);
  box-shadow: 0 6px 30px rgba(2,6,23,0.6) inset;
}

.hero-title {
  background: linear-gradient(90deg, #fff, #cfd8ff 30%, #8b5cf6 65%, #6b6bff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
}

.hero-sub {
  color: #a6b0c6;
  opacity: 0.95;
}

.active-tab {
  background: linear-gradient(90deg, #6b6bff, #8b5cf6);
  color: white;
  box-shadow: 0 6px 20px rgba(107,107,255,0.12);
  transform: translateY(-2px);
}

.inactive-tab {
  background: rgba(255,255,255,0.04);
  color: #98a1b3;
}

.active-tab, .inactive-tab {
  border: 1px solid rgba(255,255,255,0.03);
}

.loader-ring {
  border-top-color: #6b6bff;
  border-left-color: rgba(255,255,255,0.06);
  border-right-color: rgba(255,255,255,0.04);
  border-bottom-color: rgba(255,255,255,0.02);
  border-style: solid;
  border-width: 4px;
  animation: spin 1s linear infinite;
}

@keyframes spin { 
  to { 
    transform: rotate(360deg); 
  } 
}

.movie-card {
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.22));
  border: 1px solid rgba(255,255,255,0.03);
  box-shadow:
    0 10px 30px rgba(2,6,23,0.6),
    0 2px 8px rgba(107,107,255,0.04) inset;
  transition: transform .35s cubic-bezier(.2,.9,.2,1), box-shadow .35s;
  transform-origin: center;
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 18px 50px rgba(3,8,30,0.7),
    0 6px 18px rgba(107,107,255,0.08);
}

.poster-wrap {
  position: relative;
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0.15));
}

.poster-img {
  transition: transform 0.6s cubic-bezier(.2,.9,.2,1);
}

.movie-card:hover .poster-img {
  transform: scale(1.06);
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.55));
  padding: 6px 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255,255,255,0.04);
}

.poster-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(1,2,6,0.75), rgba(0,0,0,0.15) 40%, transparent 65%);
  opacity: 1;
  pointer-events: none;
  transition: opacity .3s;
}

.movie-card:hover .poster-gradient { 
  opacity: 0.8; 
}

.error-panel {
  background: linear-gradient(90deg, rgba(255,40,40,0.03), rgba(255,40,40,0.02));
  border: 1px solid rgba(255,40,40,0.06);
}

.empty-panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.03);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide::-webkit-scrollbar { 
  display: none; 
}

.scrollbar-hide { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}
</style>