<script setup lang="ts">
import { ref, watch, h, computed, onMounted } from "vue";
import { useUser } from "@clerk/vue";
import { useRouter } from "vue-router";
import { AIRecommenderService } from "@/services/ai-recommender-service";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Initialize AI service with backend URL
const aiService = new AIRecommenderService("");

// Auth
const { user, isLoaded } = useUser();
const router = useRouter();

// Mood and Genre State
type Mood =
  | "happy"
  | "sad"
  | "excited"
  | "relaxed"
  | "scared"
  | "romantic"
  | "curious"
  | "motivated";
const selectedMood = ref<Mood | null>(null);
const selectedGenres = ref<string[]>([]);

// Data State
const allRecommendations = ref<any[]>([]);
const displayedCount = ref(9);
const recommendations = computed(() =>
  allRecommendations.value.slice(0, displayedCount.value)
);
const hasMore = computed(
  () => displayedCount.value < allRecommendations.value.length
);

const shuffleResult = ref<any | null>(null);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const aiInsight = ref<string>("");
const useAI = ref(true);

// Debug info
const debugInfo = ref<string>("");

// Pagination settings
const INITIAL_DISPLAY = 9;
const LOAD_MORE_INCREMENT = 6;
const MAX_RECOMMENDATIONS = 30;

// Moods Configuration
const moods = [
  {
    value: "happy" as Mood,
    label: "Happy",
    icon: "😁",
    color: "text-yellow-500",
  },
  { value: "sad" as Mood, label: "Sad", icon: "😢", color: "text-blue-500" },
  {
    value: "excited" as Mood,
    label: "Excited",
    icon: "⚡",
    color: "text-orange-500",
  },
  {
    value: "relaxed" as Mood,
    label: "Relaxed",
    icon: "😌",
    color: "text-green-500",
  },
  {
    value: "scared" as Mood,
    label: "Scared",
    icon: "😱",
    color: "text-purple-500",
  },
  {
    value: "romantic" as Mood,
    label: "Romantic",
    icon: "💕",
    color: "text-pink-500",
  },
  {
    value: "curious" as Mood,
    label: "Curious",
    icon: "🤔",
    color: "text-indigo-500",
  },
  {
    value: "motivated" as Mood,
    label: "Motivated",
    icon: "💪",
    color: "text-red-500",
  },
];

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

// TMDB Genre ID Mapping
const genreIdMap: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  Horror: 27,
  Musical: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

// Mood to Genre Mapping
const moodGenreMap: Record<Mood, number[]> = {
  happy: [35, 10751, 16, 10749, 10402],
  sad: [18, 10749, 99],
  excited: [28, 12, 53, 878],
  relaxed: [10749, 99, 16, 14],
  scared: [27, 53, 9648],
  romantic: [10749, 18, 35],
  curious: [99, 9648, 878, 36],
  motivated: [18, 99, 28, 10752],
};

// Mood Icons
const getMoodIcon = (mood: string) => {
  const icons: Record<string, any> = {
    happy: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          }),
        ]
      ),
    sad: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          }),
        ]
      ),
    excited: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M13 10V3L4 14h7v7l9-11h-7z",
          }),
        ]
      ),
    relaxed: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
          }),
        ]
      ),
    scared: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("circle", { cx: "12", cy: "12", r: "9", "stroke-width": "2" }),
          h("circle", { cx: "9", cy: "9.5", r: "0.5", fill: "currentColor" }),
          h("circle", { cx: "15", cy: "9.5", r: "0.5", fill: "currentColor" }),
          h("circle", { cx: "12", cy: "15", r: "2.5", "stroke-width": "1.8" }),
        ]
      ),
    romantic: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
          }),
        ]
      ),
    curious: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          }),
        ]
      ),
    motivated: () =>
      h(
        "svg",
        {
          class: "w-19 h-19",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          }),
        ]
      ),
  };
  return icons[mood] || icons.happy;
};

// Functions
const toggleGenre = (genre: string) => {
  const index = selectedGenres.value.indexOf(genre);
  if (index > -1) {
    selectedGenres.value.splice(index, 1);
  } else {
    selectedGenres.value.push(genre);
  }
};

const getGenreIds = (): number[] => {
  if (selectedGenres.value.length > 0) {
    return selectedGenres.value
      .map((g) => genreIdMap[g])
      .filter((id): id is number => id !== undefined);
  }
  if (selectedMood.value) {
    return moodGenreMap[selectedMood.value];
  }
  return [];
};

// Enhanced fetch with debugging
const fetchRecommendations = async () => {
  if (!TMDB_API_KEY) {
    return;
  }

  isLoading.value = true;
  aiInsight.value = "";
  displayedCount.value = INITIAL_DISPLAY;
  debugInfo.value = `Starting fetch... Mood: ${
    selectedMood.value
  }, Genres: ${selectedGenres.value.join(", ")}`;

  try {
    const genreIds = getGenreIds();

    let genreQuery = "";
    if (selectedGenres.value.length > 0) {
      genreQuery = `&with_genres=${genreIds.join(",")}`;
    } else if (selectedMood.value) {
      const moodGenres = moodGenreMap[selectedMood.value];
      genreQuery = `&with_genres=${moodGenres.join("|")}`;
    }

    const allResults: any[] = [];
    for (let page = 1; page <= 3; page++) {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=${page}${genreQuery}&vote_count.gte=100`
      );

      if (response.ok) {
        const data = await response.json();
        allResults.push(...data.results);
      }
    }

    debugInfo.value = `Fetched ${allResults.length} movies from TMDB`;

    // Use AI to rank movies if available and enabled
    if (
      aiService &&
      useAI.value &&
      (selectedMood.value || selectedGenres.value.length > 0)
    ) {
      debugInfo.value = `AI ranking ${allResults.length} movies...`;

      try {
        const aiStartTime = Date.now();
        const aiResponse = await aiService.getRankedRecommendations({
          mood: selectedMood.value || "",
          genres: selectedGenres.value,
          movies: allResults.slice(0, 30),
        });
        const aiEndTime = Date.now();

        debugInfo.value = `AI ranked ${
          aiResponse.rankedMovies.length
        } movies in ${aiEndTime - aiStartTime}ms`;

        // Sort movies by AI scores
        const movieMap = new Map(allResults.map((m) => [m.id, m]));
        const rankedMovies = aiResponse.rankedMovies
          .map((ranked) => {
            const movie = movieMap.get(ranked.id);
            return movie
              ? {
                  ...movie,
                  aiScore: ranked.score,
                  aiReasoning: ranked.reasoning,
                }
              : null;
          })
          .filter(Boolean)
          .sort((a: any, b: any) => b.aiScore - a.aiScore);

        aiInsight.value = aiResponse.personalizedInsight;

        allRecommendations.value = rankedMovies
          .slice(0, MAX_RECOMMENDATIONS)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.overview,
            thumbnailUrl: item.poster_path
              ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
              : null,
            releaseYear: item.release_date
              ? new Date(item.release_date).getFullYear()
              : null,
            duration: null,
            rating: item.vote_average,
            genres: item.genre_ids
              ?.map(
                (id: number) =>
                  Object.entries(genreIdMap).find(([_, gid]) => gid === id)?.[0]
              )
              .filter(Boolean)
              .join(", "),
            aiScore: item.aiScore,
            aiReasoning: item.aiReasoning,
          }));
      } catch (aiError) {
        debugInfo.value = `AI failed: ${aiError}. Using fallback.`;

        // Fallback to basic sorting
        allRecommendations.value = allResults
          .slice(0, MAX_RECOMMENDATIONS)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.overview,
            thumbnailUrl: item.poster_path
              ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
              : null,
            releaseYear: item.release_date
              ? new Date(item.release_date).getFullYear()
              : null,
            duration: null,
            rating: item.vote_average,
            genres: item.genre_ids
              ?.map(
                (id: number) =>
                  Object.entries(genreIdMap).find(([_, gid]) => gid === id)?.[0]
              )
              .filter(Boolean)
              .join(", "),
          }));
      }
    } else {
      debugInfo.value = "Using basic sorting (AI disabled or unavailable)";

      // Standard sorting without AI
      allRecommendations.value = allResults
        .slice(0, MAX_RECOMMENDATIONS)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.overview,
          thumbnailUrl: item.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
            : null,
          releaseYear: item.release_date
            ? new Date(item.release_date).getFullYear()
            : null,
          duration: null,
          rating: item.vote_average,
          genres: item.genre_ids
            ?.map(
              (id: number) =>
                Object.entries(genreIdMap).find(([_, gid]) => gid === id)?.[0]
            )
            .filter(Boolean)
            .join(", "),
        }));
    }
  } catch (err) {
    debugInfo.value = `Error: ${err}`;
  } finally {
    isLoading.value = false;
  }
};

// Load more recommendations
const loadMore = () => {
  displayedCount.value = Math.min(
    displayedCount.value + LOAD_MORE_INCREMENT,
    allRecommendations.value.length
  );
};

const handleShuffle = async () => {
  if (!TMDB_API_KEY) return;

  try {
    const genreIds = getGenreIds();
    const genreQuery =
      genreIds.length > 0 ? `&with_genres=${genreIds.join(",")}` : "";
    const randomPage = Math.floor(Math.random() * 5) + 1;

    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=${randomPage}${genreQuery}`
    );

    if (response.ok) {
      const data = await response.json();
      const selectedMovie =
        data.results[Math.floor(Math.random() * data.results.length)];

      const detailsResponse = await fetch(
        `${TMDB_BASE_URL}/movie/${selectedMovie.id}?api_key=${TMDB_API_KEY}`
      );

      const details = detailsResponse.ok ? await detailsResponse.json() : null;

      shuffleResult.value = {
        id: selectedMovie.id,
        title: selectedMovie.title,
        description: selectedMovie.overview,
        thumbnailUrl: selectedMovie.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${selectedMovie.poster_path}`
          : null,
        releaseYear: selectedMovie.release_date
          ? new Date(selectedMovie.release_date).getFullYear()
          : null,
        duration: details?.runtime || null,
        rating: selectedMovie.vote_average,
        genres: details?.genres?.map((g: any) => g.name).join(", ") || "",
      };
    }
  } catch (err) {}
};

const navigateToMovie = (id: number) => {
  router.push(`/movie/${id}`);
};

// Watch for changes and fetch recommendations
watch(
  [selectedMood, selectedGenres, useAI],
  () => {
    if (user.value) {
      fetchRecommendations();
    }
  },
  { deep: true }
);

// Initial load
watch([user, isLoaded], ([currentUser, loaded]) => {
  if (loaded && currentUser) {
    fetchRecommendations();
  }
});
</script>

<template>
  <BaseNavBar />
  <div
    class="min-h-screen app-bg dark:bg-gray-1000 text-gray-900 dark:text-gray-100"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Header -->
        <div class="py-6 text-center space-y-4">
          <h1
            class="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight flex items-center justify-center gap-3"
          >
            Get AI-Powered Recommendations
          </h1>
          <p class="text-lg text-gray-400">
            Tell us your mood and preferences, our AI will find the perfect
            movie for you
          </p>

          <!-- Debug Info (only visible in development) -->
          <div
            v-if="debugInfo"
            class="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400 font-mono text-left max-w-2xl mx-auto"
          >
            {{ debugInfo }}
          </div>

          <!-- AI Toggle -->
          <div
            v-if="aiService"
            class="flex items-center justify-center gap-3 pt-2"
          >
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="useAI" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
              <span class="ml-3 text-sm font-medium text-gray-300">
                🤖 AI-Enhanced ({{ useAI ? "ON" : "OFF" }})
              </span>
            </label>
          </div>
          <div v-else class="text-sm text-yellow-500">
            ⚠️ AI service unavailable - check ANTHROPIC_API_KEY in .env
          </div>
        </div>

        <!-- Mood Selection -->
        <div
          class="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-9"
        >
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-1 text-white">
              How are you feeling?
            </h2>
            <p class="text-sm text-gray-400">Select your current mood</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              v-for="mood in moods"
              :key="mood.value"
              @click="
                selectedMood = selectedMood === mood.value ? null : mood.value
              "
              :class="[
                'h-30 rounded-lg border-2 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center gap-2 min-h-[130px] shadow-lg',
                selectedMood === mood.value
                  ? 'border-blue-400 bg-blue-500/20 shadow-blue-500/30'
                  : 'border-slate-600/50 bg-slate-700/40 hover:border-slate-500 hover:shadow-xl',
              ]"
            >
              <component :is="getMoodIcon(mood.value)" :class="[mood.color]" />
              <p class="font-medium text-base text-white">{{ mood.label }}</p>
            </button>
          </div>
        </div>

        <!-- Compact Genre Selection -->
        <details
          class="rounded-xl shadow-xl border border-slate-700/50 bg-slate-800/40 p-0"
        >
          <summary
            class="list-none cursor-pointer flex items-center justify-between gap-4 p-6 rounded-xl hover:bg-slate-700/50 transition-colors"
            role="button"
            aria-label="Toggle genres"
          >
            <div>
              <h2 class="text-xl font-semibold text-white leading-tight">
                Genres
              </h2>
              <p class="text-sm text-gray-400 mt-1">
                Refine recommendations — expand to choose genres
              </p>
            </div>

            <div class="flex items-center gap-3">
              <div
                class="text-xs text-gray-300 px-2 py-1 rounded bg-slate-700/50 border border-slate-600/40"
              >
                {{ selectedGenres.length }} selected
              </div>
              <svg
                class="w-5 h-5 text-gray-300 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </summary>

          <div class="px-4 pb-4 pt-3">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="genre in genres"
                :key="genre"
                @click="toggleGenre(genre)"
                :aria-pressed="selectedGenres.includes(genre)"
                :class="[
                  'px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-150 shadow-sm focus:outline-none',
                  selectedGenres.includes(genre)
                    ? 'bg-blue-500 text-white shadow-blue-500/30 border border-blue-400/30'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/40',
                ]"
              >
                {{ genre }}
              </button>
            </div>

            <div
              class="mt-3 flex items-center justify-between text-xs text-gray-400"
            >
              <div>Choose multiple genres to narrow results.</div>
              <button
                v-if="selectedGenres.length > 0"
                @click="selectedGenres = []"
                class="px-2 py-1 rounded bg-transparent border border-slate-600/40 text-gray-300 hover:bg-slate-700/60 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </details>

        <!-- AI Insight Banner -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="aiInsight"
            class="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-6 border border-blue-700/50 shadow-xl"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <svg
                  class="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-blue-300 mb-1">
                  AI Insight
                </h3>
                <p class="text-gray-300 leading-relaxed">{{ aiInsight }}</p>
              </div>
            </div>
          </div>
        </transition>

        <!-- Shuffle Section -->
        <div
          class="relative overflow-hidden bg-purple-900 rounded-lg p-8 border border-purple-700/50 shadow-2xl"
        >
          <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
            <svg
              class="w-32 h-32 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" stroke-width="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke-width="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2" />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke-width="2"
              />
            </svg>
          </div>

          <div class="relative z-10 flex items-center justify-between gap-8">
            <div class="flex-1 max-w-xl">
              <h2 class="text-xl font-bold mb-2">Find a Random Movie</h2>
              <p class="text-purple-200 text-base mb-0 leading-relaxed">
                Can't decide what to watch? Let our random movie generator pick
                one for you!
              </p>
            </div>

            <button
              @click="handleShuffle"
              class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-base shadow-xl shadow-purple-900/50 hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/70 flex-shrink-0"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
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
          <div
            v-if="shuffleResult"
            class="bg-slate-800/80 backdrop-blur rounded-lg p-5 border border-purple-500/50 shadow-2xl shadow-purple-900/30"
          >
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <h3 class="text-lg font-bold text-purple-300">
                Your Random Pick
              </h3>
            </div>

            <div
              @click="navigateToMovie(shuffleResult.id)"
              class="flex gap-5 cursor-pointer group"
            >
              <div
                class="w-28 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900 shadow-lg ring-2 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all"
              >
                <img
                  v-if="shuffleResult.thumbnailUrl"
                  :src="shuffleResult.thumbnailUrl"
                  :alt="shuffleResult.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <div class="flex-1 min-w-0 space-y-2">
                <h4
                  class="text-xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors"
                >
                  {{ shuffleResult.title }}
                </h4>
                <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {{ shuffleResult.description }}
                </p>

                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <div
                    v-if="shuffleResult.releaseYear"
                    class="flex items-center gap-1"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="font-medium">{{
                      shuffleResult.releaseYear
                    }}</span>
                  </div>
                  <div
                    v-if="shuffleResult.duration"
                    class="flex items-center gap-1"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span class="font-medium"
                      >{{ shuffleResult.duration }}m</span
                    >
                  </div>
                  <div
                    v-if="shuffleResult.rating"
                    class="flex items-center gap-1"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      />
                    </svg>
                    <span class="font-medium text-yellow-500">{{
                      shuffleResult.rating.toFixed(1)
                    }}</span>
                  </div>
                </div>

                <div
                  v-if="shuffleResult.genres"
                  class="flex flex-wrap gap-1.5 pt-1"
                >
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
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white">Recommended for You</h2>
            <div
              v-if="!isLoading && allRecommendations.length > 0"
              class="text-sm text-gray-400"
            >
              Showing {{ recommendations.length }} of
              {{ allRecommendations.length }} movies
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="i in 9"
              :key="i"
              class="bg-slate-800/60 rounded-lg shadow-xl overflow-hidden animate-pulse border border-slate-700/50"
            >
              <div class="aspect-video bg-slate-700" />
              <div class="p-5 space-y-3">
                <div class="h-6 bg-slate-700 rounded" />
                <div class="h-4 bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          </div>

          <!-- Recommendations Grid -->
          <div v-else-if="recommendations.length > 0">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="item in recommendations"
                :key="item.id"
                @click="navigateToMovie(item.id)"
                class="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden cursor-pointer group hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 border border-slate-700/50 hover:scale-105"
              >
                <div class="aspect-video relative overflow-hidden bg-slate-900">
                  <!-- AI Score Badge -->
                  <div
                    v-if="item.aiScore"
                    class="absolute top-2 right-2 z-10 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg"
                  >
                    🤖 {{ Math.round(item.aiScore) }}%
                  </div>

                  <img
                    v-if="item.thumbnailUrl"
                    :src="item.thumbnailUrl"
                    :alt="item.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <svg
                      class="w-12 h-12 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="p-6">
                  <h3
                    class="font-bold text-lg mb-2 line-clamp-1 text-white group-hover:text-blue-400 transition-colors"
                  >
                    {{ item.title }}
                  </h3>

                  <!-- AI Reasoning -->
                  <p
                    v-if="item.aiReasoning"
                    class="text-xs text-blue-400 mb-2 italic line-clamp-2"
                  >
                    💡 {{ item.aiReasoning }}
                  </p>

                  <p
                    class="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed"
                  >
                    {{ item.description }}
                  </p>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <div
                      v-if="item.releaseYear"
                      class="flex items-center gap-1"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {{ item.releaseYear }}
                    </div>
                    <div v-if="item.rating" class="flex items-center gap-1">
                      <svg
                        class="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                      <span class="text-yellow-500">{{
                        item.rating.toFixed(1)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMore" class="flex justify-center mt-8">
              <button
                @click="loadMore"
                :disabled="isLoadingMore"
                class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 shadow-xl shadow-blue-900/50 hover:scale-105 hover:shadow-2xl"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>{{ isLoadingMore ? "Loading..." : "Load More" }}</span>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="bg-slate-800/60 backdrop-blur-sm rounded-lg shadow-xl p-16 text-center border border-slate-700/50"
          >
            <svg
              class="w-16 h-16 text-slate-600 mx-auto mb-4"
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
