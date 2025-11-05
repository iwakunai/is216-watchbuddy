<template>
  <BaseNavBar />
  <div
    class="min-h-screen relative overflow-hidden"
    style="
    "
  >
    <div class="mx-auto p-4 text-[#eaf0ff]">
      <!-- Loading State -->
      <div v-if="loading" class="py-20 flex justify-center items-center">
        <div
          class="w-12 h-12 mr-4 border-4 border-t-[#6b6bff] border-l-[rgba(255,255,255,0.06)] border-r-[rgba(255,255,255,0.04)] border-b-[rgba(255,255,255,0.02)] rounded-full animate-spin"
        ></div>
        <div class="text-gray-300">Loading person details...</div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="p-6 bg-red-800/10 border border-red-600/20 rounded-md"
      >
        <strong class="text-red-200">Error:</strong>
        <div class="text-red-300 mt-2">{{ error }}</div>
      </div>

      <!-- Person Details -->
      <div v-else class="max-w-6xl mx-auto">
        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Left Column - Profile -->
          <div class="col-span-1">
            <div
              class="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-white/5 to-black/20 sticky top-4"
            >
              <!-- Profile Image -->
              <img
                v-if="person.profile_path"
                :src="tmdbImage(person.profile_path, 500)"
                :alt="person.name"
                class="w-full h-auto object-cover block"
              />
              <div
                v-else
                class="w-full aspect-[2/3] flex items-center justify-center bg-gray-800"
              >
                <svg
                  class="w-24 h-24 text-gray-500"
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

              <!-- Personal Info -->
              <div class="p-4 space-y-3 text-sm">
                <div>
                  <h3 class="font-semibold text-white mb-2">Personal Info</h3>
                </div>

                <div v-if="person.known_for_department">
                  <div class="text-[#98a1b3] text-xs">Known For</div>
                  <div class="text-white font-medium">
                    {{ person.known_for_department }}
                  </div>
                </div>

                <div v-if="person.birthday">
                  <div class="text-[#98a1b3] text-xs">Birthday</div>
                  <div class="text-white">
                    {{ formatDate(person.birthday) }}
                    <span v-if="!person.deathday" class="text-[#98a1b3]">
                      ({{ calculateAge(person.birthday) }} years old)
                    </span>
                  </div>
                </div>

                <div v-if="person.deathday">
                  <div class="text-[#98a1b3] text-xs">Day of Death</div>
                  <div class="text-white">
                    {{ formatDate(person.deathday) }}
                    <span class="text-[#98a1b3]">
                      ({{ calculateAge(person.birthday, person.deathday) }}
                      years old)
                    </span>
                  </div>
                </div>

                <div v-if="person.place_of_birth">
                  <div class="text-[#98a1b3] text-xs">Place of Birth</div>
                  <div class="text-white">{{ person.place_of_birth }}</div>
                </div>

                <div v-if="person.also_known_as?.length">
                  <div class="text-[#98a1b3] text-xs">Also Known As</div>
                  <div class="text-white space-y-1">
                    <div
                      v-for="(name, idx) in person.also_known_as.slice(0, 3)"
                      :key="idx"
                      class="text-sm"
                    >
                      {{ name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Biography and Filmography -->
          <div class="col-span-2 space-y-6">
            <!-- Name and Biography -->
            <div>
              <h1 class="text-4xl font-bold text-white mb-4">
                {{ person.name }}
              </h1>

              <div
                v-if="person.biography"
                class="p-4 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-black/20"
              >
                <h3 class="font-semibold text-lg mb-2">Biography</h3>
                <p
                  class="text-[#d7dde8] leading-relaxed whitespace-pre-line"
                  :class="{ 'line-clamp-6': !showFullBio }"
                >
                  {{ person.biography }}
                </p>
                <button
                  v-if="person.biography.length > 500"
                  @click="showFullBio = !showFullBio"
                  class="mt-3 text-[#6b6bff] hover:text-[#8b8bff] text-sm font-medium"
                >
                  {{ showFullBio ? "Show Less" : "Read More" }}
                </button>
              </div>
            </div>

            <!-- Known For -->
            <div v-if="knownForMovies.length > 0">
              <h2 class="text-2xl font-bold mb-4 text-white">Known For</h2>
              <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div
                  v-for="movie in knownForMovies"
                  :key="movie.id"
                  @click="navigateToMovie(movie.id)"
                  class="flex-shrink-0 w-36 cursor-pointer group"
                >
                  <div
                    class="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-black/20 transition-all duration-300 hover:border-[#6b6bff]/30 hover:shadow-xl hover:-translate-y-1"
                  >
                    <img
                      v-if="movie.poster_path"
                      :src="tmdbImage(movie.poster_path, 342)"
                      :alt="movie.title"
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
                    <div class="p-2">
                      <h4
                        class="text-sm font-semibold text-white truncate group-hover:text-[#6b6bff] transition-colors"
                      >
                        {{ movie.title || movie.name }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Complete Filmography -->
            <div v-if="sortedCredits.length > 0">
              <h2 class="text-2xl font-bold mb-4 text-white">
                {{ person.known_for_department === "Acting" ? "Acting" : "Credits" }}
              </h2>
              <div
                class="p-4 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-black/20"
              >
                <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
                  <div
                    v-for="credit in sortedCredits"
                    :key="credit.credit_id"
                    @click="navigateToMovie(credit.id)"
                    class="flex items-start gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div class="flex-shrink-0 w-12 text-[#98a1b3] text-sm">
                      {{ credit.year || "—" }}
                    </div>
                    <div class="flex-1">
                      <div
                        class="font-medium text-white group-hover:text-[#6b6bff] transition-colors"
                      >
                        {{ credit.title || credit.name }}
                      </div>
                      <div class="text-sm text-[#98a1b3]">
                        {{ credit.role }}
                      </div>
                    </div>
                  </div>
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
import { navigateToMovie } from "@/composables/showDetails";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

const loading = ref(true);
const error = ref<string | null>(null);
const person = ref<any>({});
const credits = ref<any>({});
const showFullBio = ref(false);

const personId = ref<string | null>(String(route.params.id || ""));

watch(
  () => route.params.id,
  (v) => {
    personId.value = String(v || "");
    if (personId.value) fetchPersonDetails();
  }
);

onMounted(() => {
  if (!personId.value) {
    error.value = "No person ID provided in the route.";
    loading.value = false;
    return;
  }
  fetchPersonDetails();
});

function tmdbImage(path: string, size = 500) {
  const chosen = [92, 154, 185, 342, 500, 780].includes(size) ? size : 500;
  return `${TMDB_IMAGE_BASE}w${chosen}${path}`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-SG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateAge(birthday: string, deathday?: string): number {
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

const knownForMovies = computed(() => {
  const combined = [
    ...(credits.value.cast || []),
    ...(credits.value.crew || []),
  ];
  return combined
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);
});

const sortedCredits = computed(() => {
  const allCredits = [];

  // Add cast credits
  if (credits.value.cast) {
    for (const c of credits.value.cast) {
      allCredits.push({
        ...c,
        year: c.release_date
          ? new Date(c.release_date).getFullYear().toString()
          : c.first_air_date
          ? new Date(c.first_air_date).getFullYear().toString()
          : "",
        role: c.character || "Actor",
      });
    }
  }

  // Add crew credits
  if (credits.value.crew) {
    for (const c of credits.value.crew) {
      allCredits.push({
        ...c,
        year: c.release_date
          ? new Date(c.release_date).getFullYear().toString()
          : c.first_air_date
          ? new Date(c.first_air_date).getFullYear().toString()
          : "",
        role: c.job || "Crew",
      });
    }
  }

  // Sort by year descending
  return allCredits.sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return yearB - yearA;
  });
});

async function fetchPersonDetails() {
  loading.value = true;
  error.value = null;
  person.value = {};
  credits.value = {};
  showFullBio.value = false;

  if (!TMDB_API_KEY) {
    error.value =
      "TMDB API key not configured. Set VITE_TMDB_API_KEY in your .env file";
    loading.value = false;
    return;
  }

  try {
    const url = `${TMDB_BASE}/person/${personId.value}?api_key=${TMDB_API_KEY}&append_to_response=movie_credits,tv_credits`;
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

    person.value = data;
    credits.value = data.movie_credits || {};
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
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