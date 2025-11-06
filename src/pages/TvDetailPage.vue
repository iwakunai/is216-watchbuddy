<template>
  <BaseNavBar />
  <div class="min-h-screen relative overflow-hidden" style="">
    <div class="mx-auto p-4 text-[#eaf0ff]">
      <div v-if="loading" class="py-20 flex justify-center items-center">
        <div
          class="w-12 h-12 mr-4 border-4 border-t-[#6b6bff] border-l-[rgba(255,255,255,0.06)] border-r-[rgba(255,255,255,0.04)] border-b-[rgba(255,255,255,0.02)] rounded-full animate-spin"
        ></div>
        <div class="text-gray-300">Loading show details...</div>
      </div>

      <div
        v-else-if="error"
        class="p-6 bg-red-800/10 border border-red-600/20 rounded-md"
      >
        <strong class="text-red-200">Error:</strong>
        <div class="text-red-300 mt-2">{{ error }}</div>
      </div>

      <div v-else class="grid gap-8 lg:grid-cols-3">
        <!-- Poster Column -->
        <div
          class="col-span-3 md:col-span-1 rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-white/5 to-black/20"
        >
          <!-- Poster -->
          <img
            v-if="show.poster_path"
            :src="tmdbImage(show.poster_path, 500)"
            :alt="show.name"
            class="w-full h-auto object-cover block"
          />
          <div
            v-else
            class="w-full aspect-[2/3] flex items-center justify-center bg-gray-800 text-gray-400"
          >
            No poster
          </div>

          <!-- Rating Section -->
          <div class="flex mt-3 items-center justify-center gap-4">
            <div
              class="w-16 h-16 rounded-xl flex flex-col items-center justify-center border border-white/5 bg-gradient-to-b from-white/5 to-black/30 shadow-lg"
            >
              <div class="font-bold text-white text-lg">
                {{ show.vote_average ? show.vote_average.toFixed(1) : "—" }}
              </div>
              <div class="text-xs text-[#98a1b3]">TMDB</div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="mt-2 p-3 text-[#98a1b3]">
            <div class="text-base">
              <strong class="text-white">Original Title:</strong>
              {{ show.original_name || "-" }}
            </div>
            <div
              v-if="show.tagline"
              class="mt-2 italic text-base text-[#a6b0c6]"
            >
              "{{ show.tagline }}"
            </div>
            <div class="mt-2 text-base text-[#a6b0c6]">
              <strong class="text-white">Genre(s):</strong> {{ genresDisplay }}
            </div>
            <div class="mt-2 text-base text-[#a6b0c6]">
              <strong class="text-white">Status:</strong>
              {{ show.status || "-" }}
            </div>
          </div>
        </div>

        <!-- Details Column -->
        <div class="col-span-3 md:col-span-2 gap-[2rem]">
          <div class="flex flex-col items-center gap-[4rem] h-min">
            <div class="flex-1 items-center">
              <h1
                class="text-3xl md:text-4xl font-extrabold text-white text-center leading-tight"
              >
                {{ show.name }}
                <span class="text-base font-medium text-[#b6c0d6]"
                  >({{ firstAirYear }})</span
                >
              </h1>

              

              <div
                class="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-[#98a1b3]"
              >
                <span
                  class="px-2 py-1 rounded-md border border-white/5 bg-white/[0.03] text-center"
                >
                  {{ show.number_of_seasons }} Season{{
                    show.number_of_seasons !== 1 ? "s" : ""
                  }}
                </span>
                <span
                  class="px-2 py-1 rounded-md border border-white/5 bg-white/[0.03] text-center"
                >
                  {{ show.number_of_episodes }} Episodes
                </span>
                <span>{{ formattedDate }}</span>
              </div>

              <!-- Watchlist Button -->
              <WatchListButton
                :user="user"
                :showId="showId"
                :show="show"
                :media="pageType"
              />
            </div>
          </div>

          <!-- Overview Section -->
          <div class="grid md:grid-cols-3 gap-6 mt-6">
            <div class="md:col-span-3">
              <div
                class="p-5 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-black/20"
              >
                <h3 class="font-bold text-xl mb-3 text-white">Overview</h3>
                <p class="text-[#d7dde8] leading-relaxed text-base">
                  {{ show.overview || "No overview available." }}
                </p>

                <div class="mt-4 grid gap-2 sm:grid-cols-2">
                  <div>
                    <div class="text-base text-[#98a1b3]">Created By</div>
                    <div class="mt-1 font-semibold text-white text-base">
                      <span
                        v-for="(creator, idx) in show.created_by"
                        :key="creator.id"
                        @click="navigateToPerson(creator.id)"
                        class="cursor-pointer hover:text-[#6b6bff] transition-colors"
                      >
                        {{ creator.name
                        }}<span v-if="idx < show.created_by.length - 1"
                          >,
                        </span>
                      </span>
                      <span
                        v-if="!show.created_by || show.created_by.length === 0"
                        >-</span
                      >
                    </div>
                  </div>
                  <div>
                    <div class="text-base text-[#98a1b3]">Network</div>
                    <div class="mt-1 font-semibold text-white text-base">
                      {{ networkDisplay || "-" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Production Info -->
          <div class="mt-4 grid md:grid-cols gap-6">
            <div>
              <h5 class="font-bold text-xl mb-3 text-white">Show Info</h5>
              <div class="grid gap-3 text-base text-[#98a1b3]">
                <div class="grid grid-cols-2">
                  <div class="font-semibold text-white text-center">Type:</div>
                  <span class="text-center">{{ show.type || "-" }}</span>
                </div>
                <div class="grid grid-cols-2">
                  <div class="font-semibold text-white text-center">
                    Original Language:
                  </div>
                  <span class="text-center">{{
                    show.original_language?.toUpperCase() || "-"
                  }}</span>
                </div>
                <div
                  v-if="show.production_companies?.length"
                  class="grid grid-cols-2"
                >
                  <div class="font-semibold text-white text-center">
                    Production:
                  </div>
                  <span class="text-center">
                    {{
                      show.production_companies
                        .map((c: any) => c.name)
                        .join(", ")
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trailer Section - Compact below Show Info -->
          <div v-if="trailerKey" class="mt-6">
            <h5 class="font-bold text-xl mb-3 text-white">Trailer</h5>
            <div
              class="relative group cursor-pointer px-12"
              @click="showTrailerModal = true"
            >
              <div
                class="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-black/20"
              >
                <img
                  :src="`https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`"
                  :alt="`${show.name} Trailer`"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <!-- Dark overlay -->
                <div
                  class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"
                ></div>

                <!-- Play button -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="w-16 h-16 rounded-full bg-[#6b6bff] group-hover:bg-[#8b8bff] transition-all duration-300 flex items-center justify-center shadow-xl group-hover:scale-110"
                  >
                    <svg
                      class="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <!-- Trailer label -->
                <div
                  class="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10"
                >
                  <span class="text-white font-semibold text-xs"
                    >▶ Watch Trailer</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trailer Modal -->
        <div
          v-if="showTrailerModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          @click="showTrailerModal = false"
        >
          <div class="relative w-full max-w-5xl" @click.stop>
            <!-- Close button -->
            <button
              @click="showTrailerModal = false"
              class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Video iframe -->
            <div
              class="relative aspect-video rounded-lg overflow-hidden shadow-2xl"
            >
              <iframe
                v-if="showTrailerModal"
                :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>

        <!-- Cast Section -->
        <div v-if="allCast.length > 0" class="mt-12 col-span-3">
          <h2
            class="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#cfd8ff] text-transparent bg-clip-text"
          >
            Cast
          </h2>
          <div
            class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4"
          >
            <div
              v-for="person in allCast"
              :key="person.id"
              @click="navigateToPerson(person.id)"
              class="p-3 rounded-xl bg-gradient-to-b from-white/5 to-black/20 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-[#6b6bff]/20 cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-[60px] h-[60px] rounded-md overflow-hidden bg-white/5 flex-shrink-0"
                >
                  <img
                    v-if="person.profile_path"
                    :src="tmdbImage(person.profile_path, 185)"
                    :alt="person.name"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center bg-gray-700"
                  >
                    <svg
                      class="w-8 h-8 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-white text-sm">
                    {{ person.name }}
                  </div>
                  <div class="text-xs text-[#98a1b3] mt-1">
                    {{ person.role }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="show.vote_count && show.vote_count > 0"
          class="mt-12 col-span-3"
        >
          <h2
            class="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#cfd8ff] text-transparent bg-clip-text"
          >
            Audience Reviews
          </h2>
          <div
            class="grid items-center p-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-black/20"
          >
            <div class="flex justify-center items-center gap-4 mb-4">
              <div
                class="text-center p-4 rounded-lg border border-[#6b6bff]/30 bg-[#6b6bff]/10"
              >
                <div class="text-4xl font-bold text-white">
                  {{ show.vote_average?.toFixed(1) }}
                </div>
                <div class="text-xs text-[#98a1b3] mt-1">/ 10</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-white">
                  {{ formatVoteCount(show.vote_count) }} User Reviews
                </div>
                <div class="text-sm text-[#98a1b3]">
                  Popularity: {{ show.popularity?.toFixed(0) || "N/A" }}
                </div>
              </div>
            </div>
            <TvReviews :tvId="show.id" />
          </div>
        </div>

        <!-- Similar Shows -->
        <div v-if="similarShows.length > 0" class="col-span-3 mt-12 mb-8">
          <h2
            class="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#cfd8ff] text-transparent bg-clip-text"
          >
            More Like This
          </h2>
          <div
            class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4"
          >
            <div
              v-for="similar in similarShows"
              :key="similar.id"
              @click="navigateToShow(similar.id)"
              class="cursor-pointer rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-black/20 overflow-hidden group transition-all duration-300 hover:border-[#6b6bff]/30 hover:shadow-xl hover:-translate-y-1"
            >
              <img
                v-if="similar.poster_path"
                :src="tmdbImage(similar.poster_path, 342)"
                :alt="similar.name"
                class="w-full aspect-[2/3] object-cover"
              />
              <div
                v-else
                class="w-full aspect-[2/3] flex items-center justify-center bg-gray-800"
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div class="p-3">
                <h3
                  class="font-semibold text-sm text-white truncate group-hover:text-[#6b6bff] transition-colors"
                >
                  {{ similar.name }}
                </h3>
                <div
                  class="flex items-center gap-2 mt-1 text-xs text-[#98a1b3]"
                >
                  <span v-if="similar.vote_average"
                    >⭐ {{ similar.vote_average.toFixed(1) }}</span
                  >
                  <span class="text-[#6b7280]">
                    {{
                      similar.first_air_date
                        ? new Date(similar.first_air_date).getFullYear()
                        : ""
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUser } from "@clerk/vue";
import { formatVoteCount } from "@/composables/review";
import {
  navigateToPerson,
  navigateToShow,
  tmdbImage,
} from "@/composables/showDetails";
import type { MediaType } from "@/composables/watchlist";

const route = useRoute();
const { user } = useUser();
const pageType: MediaType = "tv";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE = "https://api.themoviedb.org/3";

const loading = ref(true);
const error = ref<string | null>(null);
const show = ref<any>({});
const credits = ref<any>({});
const similarShows = ref<any[]>([]);
const trailerKey = ref<string | null>(null);
const showTrailerModal = ref(false);

const showId = ref<string>(String(route.params.id || ""));

watch(
  () => route.params.id,
  (v) => {
    showId.value = String(v || "");
    if (showId.value) fetchAll();
  }
);

// Watch for user to be loaded and then load watchlist status
watch(
  () => user.value,
  (newUser) => {
    if (newUser && showId.value) {
      // loadWatchlistStatus();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!showId.value) {
    error.value = "No show id provided in the route.";
    loading.value = false;
    return;
  }
  fetchAll();
});

const firstAirYear = computed(() => {
  if (!show.value?.first_air_date) return "";
  return new Date(show.value.first_air_date).getFullYear();
});

const formattedDate = computed(() => {
  if (!show.value?.first_air_date) return "-";
  const d = new Date(show.value.first_air_date);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

const genresDisplay = computed(
  () => show.value?.genres?.map((g: any) => g.name).join(", ") || "-"
);

const networkDisplay = computed(() => {
  if (!show.value?.networks?.length) return "-";
  return show.value.networks.map((n: any) => n.name).join(", ");
});

const allCast = computed(() => {
  const cast =
    credits.value?.cast?.slice(0, 15).map((c: any) => ({
      id: c.id,
      name: c.name,
      role: c.character || "Actor",
      profile_path: c.profile_path,
    })) || [];
  return cast;
});

async function fetchAll() {
  loading.value = true;
  error.value = null;
  show.value = {};
  credits.value = {};
  similarShows.value = [];
  trailerKey.value = null;
  showTrailerModal.value = false;

  if (!TMDB_API_KEY) {
    error.value =
      "TMDB API key not configured. Set VITE_TMDB_API_KEY in your .env file";
    loading.value = false;
    return;
  }

  try {
    const url = `${TMDB_BASE}/tv/${showId.value}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar`;
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

    show.value = data;
    credits.value = data.credits || {};
    similarShows.value = data.similar?.results?.slice(0, 6) || [];

    // Extract trailer
    if (data.videos?.results?.length > 0) {
      const trailer = data.videos.results.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        trailerKey.value = trailer.key;
      }
    }
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}
</script>
