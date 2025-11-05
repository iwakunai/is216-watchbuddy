<template>
  <BaseNavBar />
  <div class="min-h-screen relative overflow-hidden">
    <div class="relative overflow-hidden hero-panel border-b border-white/10">
      <div class="max-w-[1600px] mx-auto px-6 py-14">
        <h1 class="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight">
          <span class="hero-title">Discover TV Shows</span>
        </h1>
        <p class="hero-sub text-xl mb-8">
          Explore trending, popular, top-rated, and airing today — your next binge awaits.
        </p>

        <!-- Category Tabs -->
        <div class="flex justify-center items-center gap-3 mt-6 flex-wrap">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-7 py-3.5 rounded-full font-semibold text-base whitespace-nowrap transition-all duration-200 border-2',
              activeCategory === cat.id
                ? 'active-tab'
                : 'inactive-tab',
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-[1600px] mx-auto px-6 py-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 rounded-full loader-ring mb-4"></div>
        <p class="text-[#98a1b3] text-lg">Loading amazing TV shows...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="my-8 p-6 rounded-2xl error-panel">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-200">Error Loading TV Shows</h3>
            <p class="text-red-300/80 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="shows.length === 0" class="my-8 p-12 rounded-2xl empty-panel text-center">
        <svg class="w-16 h-16 mx-auto text-[#98a1b3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 class="text-xl font-semibold text-[#98a1b3]">No TV shows found</h3>
        <p class="text-[#6b7280] mt-2">Try switching to a different category</p>
      </div>

      <!-- TV Shows Grid -->
      <div v-else class="mt-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          <router-link
            v-for="show in shows"
            :key="show.id"
            :to="`/tv/${show.id}`"
            class="group cursor-pointer"
          >
            <!-- Show Card -->
            <div class="show-card">
              <!-- Poster -->
              <div class="relative aspect-[2/3] overflow-hidden poster-wrap">
                <img
                  v-if="show.poster"
                  :src="show.poster"
                  :alt="show.name"
                  class="w-full h-full object-cover poster-img"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>

                <!-- Rating Badge -->
                <div v-if="show.rating" class="rating-badge">
                  <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-sm font-bold text-white">{{ show.rating }}</span>
                </div>

                <div class="poster-gradient"></div>
              </div>

              <!-- Info -->
              <div class="p-4">
                <h3 class="font-bold text-base line-clamp-2 group-hover:text-[#6b6bff] transition-colors leading-snug" :title="show.name">
                  {{ show.name }}
                </h3>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-sm text-[#98a1b3] font-medium">{{ show.year }}</span>
                  <span v-if="show.voteCount" class="text-sm text-[#6b7280] font-medium">{{ formatVotes(show.voteCount) }} votes</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Load More Button -->
        <div v-if="!loading && shows.length > 0" class="flex justify-center mt-10 mb-6">
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

type TVShow = {
  id: number;
  name: string;
  year?: string;
  poster?: string;
  rating?: number;
  voteCount?: number;
};

const categories = [
  { id: 'trending', label: 'Trending', endpoint: 'trending/tv/week' },
  { id: 'popular', label: 'Popular', endpoint: 'tv/popular' },
  { id: 'top_rated', label: 'Top Rated', endpoint: 'tv/top_rated' },
  { id: 'airing_today', label: 'Airing Today', endpoint: 'tv/airing_today' },
  { id: 'on_the_air', label: 'On The Air', endpoint: 'tv/on_the_air' },
];

const activeCategory = ref('trending');
const shows = ref<TVShow[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function loadShows(append = false) {
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

    const category = categories.find((c) => c.id === activeCategory.value);
    if (!category) throw new Error('Invalid category');

    const url = `${TMDB_BASE_URL}/${category.endpoint}?api_key=${TMDB_API_KEY}&page=${currentPage.value}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.status_message || `${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    const results = data.results || [];

    const formattedShows: TVShow[] = results.map((show: any) => ({
      id: show.id,
      name: show.name || show.original_name || 'Untitled',
      year: show.first_air_date ? new Date(show.first_air_date).getFullYear().toString() : 'N/A',
      poster: show.poster_path ? `${TMDB_IMAGE_BASE}${show.poster_path}` : undefined,
      rating: show.vote_average ? Number(show.vote_average.toFixed(1)) : undefined,
      voteCount: show.vote_count,
    }));

    if (append) {
      shows.value = [...shows.value, ...formattedShows];
    } else {
      shows.value = formattedShows;
    }
  } catch (e: any) {
    error.value = e?.message ?? String(e);
    if (!append) {
      shows.value = [];
    }
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function loadMore() {
  currentPage.value++;
  loadShows(true);
}

function formatVotes(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

watch(activeCategory, () => {
  loadShows();
});

onMounted(() => {
  loadShows();
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

.hero-panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  backdrop-filter: blur(6px) saturate(110%);
  box-shadow: 0 6px 30px rgba(2,6,23,0.6) inset;
}

.hero-title {
  background: white;
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
  border-color: #6b6bff;
  color: white;
  box-shadow: 0 8px 24px rgba(107,107,255,0.25);
  transform: scale(1.05);
}

.inactive-tab {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.1);
  color: #98a1b3;
}

.inactive-tab:hover {
  border-color: rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
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

.show-card {
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

.show-card:hover {
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

.show-card:hover .poster-img {
  transform: scale(1.06);
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.55));
  padding: 7px 10px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
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

.show-card:hover .poster-gradient { 
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

.scrollbar-hide::-webkit-scrollbar { 
  display: none; 
}

.scrollbar-hide { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}
</style>