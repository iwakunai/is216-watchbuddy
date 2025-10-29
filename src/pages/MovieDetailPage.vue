<template>
  <BaseNavBar />
  <div
    class="min-h-screen relative overflow-hidden"
    style="
      background: radial-gradient(
          1200px 400px at 10% 10%,
          rgba(255, 255, 255, 0.02),
          transparent 8%
        ),
        radial-gradient(
          800px 300px at 90% 80%,
          rgba(107, 107, 255, 0.02),
          transparent 6%
        ),
        linear-gradient(180deg, #07080a 0%, #0b1220 50%, #05060a 100%);
    "
  >
    <div class="mx-auto p-4 text-[#eaf0ff]">
      <div v-if="loading" class="py-20 flex justify-center items-center">
        <div
          class="w-12 h-12 mr-4 border-4 border-t-[#6b6bff] border-l-[rgba(255,255,255,0.06)] border-r-[rgba(255,255,255,0.04)] border-b-[rgba(255,255,255,0.02)] rounded-full animate-spin"
        ></div>
        <div class="text-gray-300">Loading movie details...</div>
      </div>

      <div
        v-else-if="error"
        class="p-6 bg-red-800/10 border border-red-600/20 rounded-md"
      >
        <strong class="text-red-200">Error:</strong>
        <div class="text-red-300 mt-2">{{ error }}</div>
      </div>

      <div v-else class="grid gap-8 lg:grid-cols-3">
        <!-- Col 1 -->
        <div
          class="col-span-3 md:col-span-1 rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-white/5 to-black/20"
        >
          <!-- Image -->
          <img
            v-if="movie.poster_path"
            :src="tmdbImage(movie.poster_path, 500)"
            :alt="movie.title"
            class="w-full h-auto object-cover block"
          />
          <!-- TODO: Else to display blank poster instead of text -->
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
                {{ movie.vote_average ? movie.vote_average.toFixed(1) : "—" }}
              </div>
              <div class="text-xs text-[#98a1b3]">TMDB</div>
            </div>

            <div
              class="w-16 h-16 rounded-xl flex flex-col items-center justify-center border border-white/5 bg-gradient-to-b from-white/5 to-black/30 shadow-lg"
            >
              <div class="font-bold text-white text-lg">
                {{ imdbRatingDisplay }}
              </div>
              <div class="text-xs text-[#98a1b3]">IMDb</div>
            </div>
          </div>

          <!-- Under Rating Section -->
          <div class="mt-2 p-3 text text-[#98a1b3]">
            <div>
              <strong>Original Title:</strong> {{ movie.original_title || "-" }}
            </div>
            <div
              v-if="movie.tagline"
              class="mt-2 italic text-sm text-[#a6b0c6]"
            >
              "{{ movie.tagline }}"
            </div>
            <div class="mt-2 text-[#a6b0c6]">
              <strong>Genre(s):</strong> {{ genresDisplay }}
            </div>
          </div>
        </div>

        <!-- Col 2? -->
        <div class="col-span-3 md:col-span-2 grid gap-6">
          <!-- Details -->
          <div class="flex flex-col items-center gap-4">
            <div class="flex-1 items-center">
              <h1
                class="text-3xl md:text-4xl font-extrabold text-white leading-tight"
              >
                {{ movie.title }}
                <span class="text-base font-medium text-[#b6c0d6]"
                  >({{ releaseYear }})</span
                >
              </h1>

              <div
                class="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#98a1b3]"
              >
                <span
                  class="px-2 py-1 rounded-md border border-white/5 bg-white/[0.03]"
                  >{{ certificationDisplay }}</span
                >
                <span>{{ formattedDate }}</span>
                <!-- <span>{{ genresDisplay }}</span> -->
                <span>{{ formattedRuntime }}</span>
              </div>
            </div>
          </div>

          <!-- Col 3 -->
          <div class="grid md:grid-cols-3 gap-6">
            <div class="md:col-span-3">
              <div
                class="inline-block mb-3 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.03] text-[#d6def8]"
              >
                <strong>Vibe:</strong> <span class="ml-2">{{ vibe }}</span>
              </div>

              <div
                class="p-4 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-black/20"
              >
                <h3 class="font-semibold text-lg mb-2">Overview</h3>
                <p class="text-[#d7dde8] leading-relaxed">
                  {{ movie.overview || "No overview available." }}
                </p>

                <div class="mt-4 grid gap-2 sm:grid-cols-2">
                  <div>
                    <div class="text-sm text-[#98a1b3]">Director</div>
                    <div class="mt-1 font-semibold text-white">
                      {{ directorsDisplay || "-" }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-[#98a1b3]">Writer(s)</div>
                    <div class="mt-1 font-semibold text-white">
                      {{ writersDisplay || "-" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Production Info Section -->
          <div class="mt-4 grid md:grid-cols-2 gap-6">
            <!-- Production Info column -->
            <div>
              <h5 class="font-semibold text-lg mb-2">Production Info</h5>
              <div
                class="grid grid-rows-3 gap-x-6 gap-y-2 text-sm text-[#98a1b3]"
              >
                <div class="grid grid-cols-2">
                  <div class="font-semibold text-white text-left">Status:</div>
                  <span class="text-left">{{ movie.status || "-" }}</span>
                </div>

                <div class="grid grid-cols-2">
                  <div class="font-semibold text-white text-left">
                    Original language:
                  </div>
                  <span class="text-left">{{
                    movie.original_language?.toUpperCase() || "-"
                  }}</span>
                </div>

                <div class="grid grid-cols-2">
                  <div
                    v-if="movie.production_companies?.length"
                    class="font-semibold text-white text-left"
                  >
                    Production Companies:
                  </div>
                  <span
                    v-if="movie.production_companies?.length"
                    class="text-left"
                  >
                    {{
                      movie.production_companies
                        .map((c: any) => c.name)
                        .join(", ")
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Box Office column -->
            <div>
              <h5 class="font-semibold text-lg mb-2">Box Office</h5>
              <div
                class="grid grid-rows-3 gap-x-6 gap-y-3 text-sm text-[#98a1b3]"
              >
                <div class="grid grid-cols-2">
                  <div class="font-semibold text-white text-left">Budget:</div>
                  <span class="text-left">{{
                    movie.budget ? "$" + movie.budget.toLocaleString() : "-"
                  }}</span>
                </div>

                <div class="grid grid-cols-2">
                  <div class="font-semibold text-white text-left">Revenue:</div>
                  <span class="text-left">{{
                    movie.revenue ? "$" + movie.revenue.toLocaleString() : "-"
                  }}</span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        
        <!-- TODO: Add show more button, only show top 5 and rest of cast in new page -->
        <!-- Full Cast & Crew Section -->
        <div v-if="allCast.length > 0" class="mt-12 col-span-3">
          <h2
            class="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#cfd8ff] text-transparent bg-clip-text"
          >
            <span>Cast & Crew</span>
          </h2>

          <div
            class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4"
          >
            <div
              v-for="person in allCast"
              :key="person.id"
              class="p-3 rounded-xl bg-gradient-to-b from-white/5 to-black/20 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-[#6b6bff]/20"
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

        <!-- Review Section -->
        <div
          v-if="movie.vote_count && movie.vote_count > 0"
          class="mt-12 col-span-3"
        >
          <h2
            class="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#cfd8ff] text-transparent bg-clip-text"
          >
            Audience Reviews
          </h2>
          <div
            class="p-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-black/20"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="text-center p-4 rounded-lg border border-[#6b6bff]/30 bg-[#6b6bff]/10"
              >
                <div class="text-4xl font-bold text-white">
                  {{ movie.vote_average?.toFixed(1) }}
                </div>
                <div class="text-xs text-[#98a1b3] mt-1">/ 10</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-white">
                  {{ formatVoteCount(movie.vote_count) }} User Reviews
                </div>
                <div class="text-sm text-[#98a1b3]">
                  Popularity: {{ movie.popularity?.toFixed(0) || "N/A" }}
                </div>
              </div>
            </div>
            <MovieReviews :movie-id="movie.id" />
          </div>
        </div>

        <!-- TODO: change to carousel -->
        <!-- Similar Movie Section -->
        <div v-if="similarMovies.length > 0" class="col-span-3 mt-12 mb-8">
          <h2
            class="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#cfd8ff] text-transparent bg-clip-text"
          >
            More Like This
          </h2>
          <div
            class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4"
          >
            <div
              v-for="similar in similarMovies"
              :key="similar.id"
              @click="navigateToMovie(similar.id)"
              class="cursor-pointer rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-black/20 overflow-hidden group transition-all duration-300 hover:border-[#6b6bff]/30 hover:shadow-xl hover:-translate-y-1"
            >
              <img
                v-if="similar.poster_path"
                :src="tmdbImage(similar.poster_path, 342)"
                :alt="similar.title"
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
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <div class="p-3">
                <h3
                  class="font-semibold text-sm text-white truncate group-hover:text-[#6b6bff] transition-colors"
                >
                  {{ similar.title }}
                </h3>
                <div
                  class="flex items-center gap-2 mt-1 text-xs text-[#98a1b3]"
                >
                  <span v-if="similar.vote_average"
                    >⭐ {{ similar.vote_average.toFixed(1) }}</span
                  >
                  <span class="text-[#6b7280]">
                    {{
                      similar.release_date
                        ? new Date(similar.release_date).getFullYear()
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseNavBar from '@/components/NavBar/BaseNavBar.vue';
import MovieReviews from '@/components/Reviews/MovieReviews.vue';

const route = useRoute();
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
// const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || "";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

type Movie = any;
type CastMember = any;

const loading = ref(true);
const error = ref<string | null>(null);
const movie = ref<Movie>({} as Movie);
const credits = ref<any>({} as any);
const imdbRating = ref<string | null>(null);
const similarMovies = ref<any[]>([]);

const movieId = ref<string | null>(String(route.params.id || ""));

watch(
  () => route.params.id,
  (v) => {
    movieId.value = String(v || "");
    if (movieId.value) fetchAll();
  }
);

onMounted(() => {
  if (!movieId.value) {
    error.value = "No movie id provided in the route.";
    loading.value = false;
    return;
  }
  fetchAll();
});

function tmdbImage(path: string, size = 500) {
  const chosen = [92, 154, 185, 342, 500, 780].includes(size) ? size : 500;
  return `${TMDB_IMAGE_BASE}w${chosen}${path}`;
}

const releaseYear = computed(() => {
  if (!movie.value?.release_date) return "";
  return new Date(movie.value.release_date).getFullYear();
});

const formattedDate = computed(() => {
  if (!movie.value?.release_date) return "-";
  const d = new Date(movie.value.release_date);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

const genresDisplay = computed(
  () => movie.value?.genres?.map((g: any) => g.name).join(", ") || "-"
);

const formattedRuntime = computed(() => {
  const m = movie.value?.runtime;
  if (!m || m === 0) return "-";
  const hrs = Math.floor(m / 60);
  const mins = m % 60;
  return `${hrs}h ${mins}m`;
});

const certificationDisplay = computed(() => {
  const rd = movie.value?.release_dates?.results || [];
  if (!rd.length) return "NR";
  const findFor = (country: string) => {
    const item = rd.find((r: any) => r.iso_3166_1 === country);
    if (!item || !item.release_dates?.length) return null;
    const cert = item.release_dates.find(
      (x: any) => x.certification && x.certification.trim() !== ""
    );
    return cert ? cert.certification : null;
  };
  return (
    findFor("SG") ||
    findFor("US") ||
    rd[0]?.release_dates?.[0]?.certification ||
    "NR"
  );
});

const topCast = computed<CastMember[]>(() =>
  credits.value?.cast ? credits.value.cast.slice(0, 5) : []
);

const allCast = computed(() => {
  const cast =
    credits.value?.cast?.slice(0, 15).map((c: any) => ({
      id: c.id,
      name: c.name,
      role: c.character || "Actor",
      profile_path: c.profile_path,
    })) || [];

  // const crew =
  //   credits.value?.crew
  //     ?.filter((c: any) =>
  //       [
  //         "Director",
  //         "Producer",
  //         "Screenplay",
  //         "Writer",
  //         "Director of Photography",
  //         "Editor",
  //       ].includes(c.job)
  //     )
  //     .slice(0, 10)
  //     .map((c: any) => ({
  //       id: c.id,
  //       name: c.name,
  //       role: c.job,
  //       profile_path: c.profile_path,
  //     })) || [];

  // return [...crew, ...cast];
  return [...cast];
});

const directorsDisplay = computed(() => {
  const crew = credits.value?.crew || [];
  const directors = crew
    .filter((c: any) => c.job === "Director")
    .map((d: any) => d.name);
  return [...new Set(directors)].join(", ");
});

const writersDisplay = computed(() => {
  const crew = credits.value?.crew || [];
  const writers = crew
    .filter(
      (c: any) =>
        ["Writer", "Screenplay", "Author", "Screenplay By"].includes(c.job) ||
        c.department === "Writing"
    )
    .map((w: any) => w.name);
  return [...new Set(writers)].join(", ");
});

function inferVibe(movieObj: any, keywordsList: any[]): string {
  const keywords = (keywordsList || []).map((k: any) =>
    (k.name || "").toLowerCase()
  );
  const genres = (movieObj?.genres || []).map((g: any) => g.name.toLowerCase());
  const bag = [...keywords, ...genres].join(" ");

  const mapping: Record<string, string> = {
    horror: "Scary / Tense",
    thriller: "Tense / Suspenseful",
    comedy: "Light / Funny",
    romance: "Warm / Emotional",
    drama: "Thoughtful / Dramatic",
    action: "Exciting / Energetic",
    adventure: "Adventurous / Fun",
    fantasy: "Wonder / Imaginative",
    science: "Curious / Intellectual",
    family: "Comforting / Heartfelt",
  };

  for (const k in mapping) {
    if (bag.includes(k)) return mapping[k] as string;
  }
  if (
    bag.includes("zombie") ||
    bag.includes("monster") ||
    bag.includes("creepy")
  )
    return "Frightening";
  if (bag.includes("survival")) return "Tense / Survival";
  if (bag.includes("satire")) return "Wry / Satirical";
  return "Neutral / Mixed";
}

const vibe = computed(() => {
  const keywords =
    movie.value?.keywords?.keywords || movie.value?.keywords?.results || [];
  return inferVibe(movie.value, keywords);
});

const imdbRatingDisplay = computed(() => {
  if (imdbRating.value) return imdbRating.value;
  if (movie.value?.vote_average)
    return `${movie.value.vote_average.toFixed(1)}`;
  return "-";
});

function formatVoteCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

// TODO: remove?
function getReviewTone(): string {
  const rating = movie.value?.vote_average || 0;
  if (rating >= 8)
    return "exceptional performances, compelling storytelling, and masterful direction";
  if (rating >= 7)
    return "strong performances, engaging plot, and solid execution";
  if (rating >= 6) return "interesting concept and decent performances";
  if (rating >= 5) return "ambitious attempt with mixed results";
  return "unique vision despite some challenges";
}

function navigateToMovie(id: number) {
  window.scrollTo({ top: 0, behavior: "smooth" });
  movieId.value = String(id);
  fetchAll();
}

async function fetchAll() {
  loading.value = true;
  error.value = null;
  movie.value = {};
  credits.value = {};
  imdbRating.value = null;
  similarMovies.value = [];

  if (!TMDB_API_KEY) {
    error.value =
      "TMDB API key not configured. Set VITE_TMDB_API_KEY in your .env.local";
    loading.value = false;
    return;
  }

  try {
    const url = `${TMDB_BASE}/movie/${movieId.value}?api_key=${TMDB_API_KEY}&append_to_response=credits,release_dates,external_ids,keywords,similar`;
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

    movie.value = data;
    credits.value = data.credits || {};
    similarMovies.value = data.similar?.results?.slice(0, 6) || [];

    const imdbId = data?.external_ids?.imdb_id;
    // if (OMDB_API_KEY && imdbId) {
    //   try {
    //     const omb = await fetch(
    //       `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
    //     );
    //     if (omb.ok) {
    //       const oj = await omb.json();
    //       imdbRating.value =
    //         oj?.imdbRating && oj?.imdbRating !== "N/A"
    //           ? `${oj.imdbRating} / 10`
    //           : null;
    //     }
    //   } catch (e) {
    //     console.warn("OMDB fetch error", e);
    //   }
    // }
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}
</script>
