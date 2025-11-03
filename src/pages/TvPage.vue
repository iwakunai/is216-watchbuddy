<template>
  <BaseNavBar />
  <div class="min-h-screen relative overflow-hidden">
    <div class="relative overflow-hidden border-b border-gray-800">
      <div class="mx-auto px-4 py-14">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight">
          <span class="text-white font-extrabold"> Discover Movies </span>
        </h1>
        <p class="text-lg text-gray-400">
          Explore trending, latest, upcoming, and top-rated films — handpicked &
          comfy to browse.
        </p>

        <!-- Category Tabs -->
        <div class="items-center justify-center gap-2 mt-6 scrollbar-hide">
          <button
            class="tv-category-button"
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 border border-gray-700',
              activeCategory === cat.id
                ? 'text-white shadow-md translate-y-[-0.5rem]'
                : 'bg-gray-700 text-gray-300',
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <main class="mx-auto p-4">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div
          class="w-16 h-16 rounded-full border-4 border-t-blue-600 border-l-gray-600 border-r-gray-700 border-b-gray-700 animate-spin mb-4"
        ></div>
        <p class="text-gray-400 text-lg">Loading amazing movies...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="my-8 p-6 rounded-2xl bg-red-900 border border-red-800 text-red-400"
      >
        <div class="flex items-center gap-3">
          <svg
            class="w-6 h-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 class="font-semibold text-red-300">Error Loading Movies</h3>
            <p class="text-red-400/80 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="movies.length === 0"
        class="my-8 p-12 rounded-2xl bg-gray-800 border border-gray-700 text-center text-gray-400"
      >
        <svg
          class="w-16 h-16 mx-auto mb-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
        <h3 class="text-xl font-semibold">No movies found</h3>
        <p class="mt-2 text-gray-500">Try switching to a different category</p>
      </div>

      <!-- Movies Grid -->
      <div
        v-else
        class="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <router-link
          v-for="movie in movies"
          :key="movie.id"
          :to="`/movie/${movie.id}`"
          class="group cursor-pointer rounded-xl overflow-hidden bg-gray-800 border border-gray-700 shadow-lg transition-transform duration-350 hover:-translate-y-2 hover:shadow-xl"
        >
          <div class="relative aspect-[2/3] bg-gray-900">
            <img
              v-if="movie.poster"
              :src="movie.poster"
              :alt="movie.title"
              class="w-full h-full object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-700"
            >
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>

            <div
              v-if="movie.rating"
              class="absolute top-2 right-2 bg-black bg-opacity-75 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-gray-700 text-yellow-400"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="text-xs font-semibold text-white">{{
                movie.rating
              }}</span>
            </div>
          </div>
          <div class="p-3">
            <h3
              class="font-semibold text-sm line-clamp-2 group-hover:text-blue-500 transition-colors"
              :title="movie.title"
            >
              {{ movie.title }}
            </h3>
            <div class="flex items-center justify-between mt-2 text-xs">
              <span class="text-gray-400">{{ movie.year }}</span>
              <span v-if="movie.voteCount" class="text-gray-500"
                >{{ formatVotes(movie.voteCount) }} votes</span
              >
            </div>
          </div>
        </router-link>
      </div>

      <!-- Load More Button -->
      <div
        v-if="!loading && movies.length > 0"
        class="flex justify-center mt-10 mb-6"
      >
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-sm border border-gray-700 bg-blue-900 text-white shadow-md transition-transform duration-120 cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0"
          aria-live="polite"
          :aria-disabled="loadingMore"
        >
          <template v-if="!loadingMore">
            <svg
              class="w-4 h-4 stroke-current opacity-95 translate-y-[0.5px]"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 4v12M8 12l4 4 4-4"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Load more</span>
          </template>
          <template v-else>
            <span
              class="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin inline-block box-border mr-2"
            ></span>
            <span>Loading</span>
          </template>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

type MovieItem = {
  id: number;
  title: string;
  year?: string;
  poster?: string;
  rating?: number;
  voteCount?: number;
};

const categories = [
  { id: "trending", label: "🔥 Trending", endpoint: "trending/movie/week" },
  { id: "latest", label: "🆕 Latest", endpoint: "movie/now_playing" },
  { id: "upcoming", label: "📅 Upcoming", endpoint: "movie/upcoming" },
  { id: "top_rated", label: "⭐ Top Rated", endpoint: "movie/top_rated" },
];

const activeCategory = ref("trending");
const movies = ref<MovieItem[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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
      throw new Error(
        "TMDB API key not configured. Please set VITE_TMDB_API_KEY in your .env file"
      );
    }

    const category = categories.find((c) => c.id === activeCategory.value);
    if (!category) throw new Error("Invalid category");

    const url = `${TMDB_BASE_URL}/${category.endpoint}?api_key=${TMDB_API_KEY}&page=${currentPage.value}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(
        errorData.status_message || `${resp.status} ${resp.statusText}`
      );
    }

    const data = await resp.json();
    const results = data.results || [];

    const formattedMovies: MovieItem[] = results.map((m: any) => ({
      id: m.id,
      title: m.title || m.original_title || "Untitled",
      year: m.release_date
        ? new Date(m.release_date).getFullYear().toString()
        : "N/A",
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

<style scoped></style>
