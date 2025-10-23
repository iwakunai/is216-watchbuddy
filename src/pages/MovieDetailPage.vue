<template>
  <BaseNavBar />
  <div class="min-h-screen app-bg text-[#eaf0ff]">
    <div class="movie-detail-page max-w-[1200px] mx-auto p-4">
      <div v-if="loading" class="py-20 flex justify-center items-center">
        <div class="loader-ring w-12 h-12 mr-4"></div>
        <div class="text-gray-300">Loading movie details...</div>
      </div>

      <div v-else-if="error" class="p-6 bg-red-800/10 border border-red-600/20 rounded-md">
        <strong class="text-red-200">Error:</strong>
        <div class="text-red-300 mt-2">{{ error }}</div>
      </div>

      <div v-else class="grid gap-8 lg:grid-cols-3">
        <!-- Poster (left) -->
        <div class="col-span-1 poster-card rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-white/3 to-black/20">
          <img
            v-if="movie.poster_path"
            :src="tmdbImage(movie.poster_path, 500)"
            :alt="movie.title"
            class="w-full h-auto object-cover"
          />
          <div v-else class="w-full aspect-[2/3] flex items-center justify-center bg-gray-800 text-gray-400">
            No poster
          </div>

          <!-- small meta under poster -->
          <div class="p-3 text-sm text-[#98a1b3]">
            <div><strong>Original Title:</strong> {{ movie.original_title || '-' }}</div>
            <div v-if="movie.tagline" class="mt-2 italic text-xs text-[#a6b0c6]">"{{ movie.tagline }}"</div>
          </div>
        </div>

        <!-- Main details (middle & right) -->
        <div class="col-span-2 lg:col-span-2 grid gap-6">
          <!-- Top header row -->
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex-1">
              <h1 class="text-3xl md:text-4xl font-extrabold leading-tight text-white">
                {{ movie.title }} <span class="text-base font-medium text-[#b6c0d6]">({{ releaseYear }})</span>
              </h1>

              <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#98a1b3]">
                <span class="badge">{{ certificationDisplay }}</span>
                <span>• {{ formattedDate }}</span>
                <span>• {{ genresDisplay }}</span>
                <span>• {{ formattedRuntime }}</span>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <!-- User Rating (TMDB) -->
              <div class="rating-circle">
                <div class="rating-value">{{ movie.vote_average ? (movie.vote_average.toFixed(1)) : '—' }}</div>
                <div class="rating-label text-xs">TMDB</div>
              </div>

              <!-- IMDB rating (if available) -->
              <div class="imdb-box">
                <div class="imdb-score">{{ imdbRatingDisplay }}</div>
                <div class="text-xs text-[#98a1b3]">IMDb</div>
              </div>
            </div>
          </div>

          <!-- Vibe + Overview -->
          <div class="grid md:grid-cols-3 gap-6">
            <div class="md:col-span-2">
              <div class="vibe-pill mb-3">
                <strong>Vibe:</strong> <span class="ml-2">{{ vibe }}</span>
              </div>

              <div class="overview-panel p-4 rounded-lg bg-white/4 border border-white/6">
                <h3 class="font-semibold text-lg mb-2">Overview</h3>
                <p class="text-[#d7dde8] leading-relaxed">{{ movie.overview || 'No overview available.' }}</p>

                <div class="mt-4 grid gap-2 sm:grid-cols-2">
                  <div>
                    <div class="text-sm text-[#98a1b3]">Director</div>
                    <div class="font-semibold text-white mt-1">{{ directorsDisplay || '-' }}</div>
                  </div>

                  <div>
                    <div class="text-sm text-[#98a1b3]">Writer(s)</div>
                    <div class="font-semibold text-white mt-1">{{ writersDisplay || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cast (right column) -->
            <div class="cast-panel">
              <h4 class="text-lg font-semibold mb-3">Top 5 Cast</h4>
              <div v-if="topCast.length === 0" class="text-sm text-[#98a1b3]">No cast available.</div>
              <ul class="space-y-3">
                <li v-for="c in topCast" :key="c.id" class="flex items-center gap-3">
                  <img v-if="c.profile_path" :src="tmdbImage(c.profile_path, 185)" class="w-12 h-12 rounded-md object-cover" />
                  <div v-else class="w-12 h-12 rounded-md bg-gray-700"></div>
                  <div>
                    <div class="font-medium text-white">{{ c.name }}</div>
                    <div class="text-xs text-[#98a1b3]">{{ c.character || '' }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Optional: full credits or other details -->
          <div class="mt-4 grid md:grid-cols-2 gap-6">
            <div>
              <h5 class="font-semibold text-lg mb-2">Full Cast & Crew</h5>
              <p class="text-sm text-[#98a1b3]">Click "Show more" (you can implement expansion) to display full credits.</p>
            </div>

            <div>
              <h5 class="font-semibold text-lg mb-2">Technical</h5>
              <ul class="text-sm text-[#98a1b3] space-y-1">
                <li><strong>Status:</strong> {{ movie.status || '-' }}</li>
                <li><strong>Original language:</strong> {{ movie.original_language || '-' }}</li>
                <li><strong>Budget:</strong> {{ movie.budget ? `$${movie.budget.toLocaleString()}` : '-' }}</li>
                <li><strong>Revenue:</strong> {{ movie.revenue ? `$${movie.revenue.toLocaleString()}` : '-' }}</li>
              </ul>
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
import BaseNavBar from '@/components/BaseNavBar.vue';

const route = useRoute();
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || '';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

type Movie = any;
type CastMember = any;

const loading = ref(true);
const error = ref<string|null>(null);
const movie = ref<Movie>({} as Movie);
const credits = ref<any>({} as any);
const imdbRating = ref<string|null>(null);

const movieId = ref<string | null>(String(route.params.id || ''));

watch(() => route.params.id, (v) => {
  movieId.value = String(v || '');
  if (movieId.value) fetchAll();
});

onMounted(() => {
  if (!movieId.value) {
    error.value = 'No movie id provided in the route.';
    loading.value = false;
    return;
  }
  fetchAll();
});

function tmdbImage(path: string, size = 500) {
  const chosen = [92,154,185,342,500,780].includes(size) ? size : 500;
  return `${TMDB_IMAGE_BASE}w${chosen}${path}`;
}

const releaseYear = computed(() => {
  if (!movie.value?.release_date) return '';
  return new Date(movie.value.release_date).getFullYear();
});

const formattedDate = computed(() => {
  if (!movie.value?.release_date) return '-';
  const d = new Date(movie.value.release_date);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
});

const genresDisplay = computed(() => (movie.value?.genres?.map((g: any) => g.name).join(', ') || '-'));

const formattedRuntime = computed(() => {
  const m = movie.value?.runtime;
  if (!m || m === 0) return '-';
  const hrs = Math.floor(m / 60);
  const mins = m % 60;
  return `${hrs}h ${mins}m`;
});

const certificationDisplay = computed(() => {
  const rd = movie.value?.release_dates?.results || [];
  if (!rd.length) return 'NR';
  const findFor = (country: string) => {
    const item = rd.find((r: any) => r.iso_3166_1 === country);
    if (!item || !item.release_dates?.length) return null;
    const cert = item.release_dates.find((x: any) => x.certification && x.certification.trim() !== '');
    return cert ? cert.certification : null;
  };
  return findFor('SG') || findFor('US') || (rd[0]?.release_dates?.[0]?.certification || 'NR');
});

const topCast = computed<CastMember[]>(() => (credits.value?.cast ? credits.value.cast.slice(0, 5) : []));

const directorsDisplay = computed(() => {
  const crew = credits.value?.crew || [];
  const directors = crew.filter((c: any) => c.job === 'Director').map((d: any) => d.name);
  return [...new Set(directors)].join(', ');
});

const writersDisplay = computed(() => {
  const crew = credits.value?.crew || [];
  const writers = crew.filter((c: any) => ['Writer','Screenplay','Author','Screenplay By'].includes(c.job) || c.department === 'Writing').map((w: any) => w.name);
  return [...new Set(writers)].join(', ');
});

function inferVibe(movieObj: any, keywordsList: any[]): string {
  const keywords = (keywordsList || []).map((k: any) => (k.name || '').toLowerCase());
  const genres = (movieObj?.genres || []).map((g: any) => g.name.toLowerCase());
  const bag = [...keywords, ...genres].join(' ');

  const mapping: Record<string,string> = {
    horror: 'Scary / Tense',
    thriller: 'Tense / Suspenseful',
    comedy: 'Light / Funny',
    romance: 'Warm / Emotional',
    drama: 'Thoughtful / Dramatic',
    action: 'Exciting / Energetic',
    adventure: 'Adventurous / Fun',
    fantasy: 'Wonder / Imaginative',
    science: 'Curious / Intellectual',
    family: 'Comforting / Heartfelt'
  };

  for (const k in mapping) {
    if (bag.includes(k)) return mapping[k];
  }
  if (bag.includes('zombie') || bag.includes('monster') || bag.includes('creepy')) return 'Frightening';
  if (bag.includes('survival')) return 'Tense / Survival';
  if (bag.includes('satire')) return 'Wry / Satirical';
  return 'Neutral / Mixed';
}

const vibe = computed(() => {
  const keywords = movie.value?.keywords?.keywords || movie.value?.keywords?.results || [];
  return inferVibe(movie.value, keywords);
});

const imdbRatingDisplay = computed(() => {
  if (imdbRating.value) return imdbRating.value;
  if (movie.value?.vote_average) return `${(movie.value.vote_average).toFixed(1)} (TMDB)`;
  return '-';
});

async function fetchAll() {
  loading.value = true;
  error.value = null;
  movie.value = {};
  credits.value = {};
  imdbRating.value = null;

  if (!TMDB_API_KEY) {
    error.value = 'TMDB API key not configured. Set VITE_TMDB_API_KEY in your .env.local';
    loading.value = false;
    return;
  }

  try {
    const url = `${TMDB_BASE}/movie/${movieId.value}?api_key=${TMDB_API_KEY}&append_to_response=credits,release_dates,external_ids,keywords`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

    movie.value = data;
    credits.value = data.credits || {};

    const imdbId = data?.external_ids?.imdb_id;
    if (OMDB_API_KEY && imdbId) {
      try {
        const omb = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
        if (omb.ok) {
          const oj = await omb.json();
          imdbRating.value = oj?.imdbRating && oj?.imdbRating !== 'N/A' ? `${oj.imdbRating} / 10` : null;
        }
      } catch (e) {
        console.warn('OMDB fetch error', e);
      }
    }
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.app-bg {
  background: radial-gradient(1200px 400px at 10% 10%, rgba(255,255,255,0.02), transparent 8%),
              radial-gradient(800px 300px at 90% 80%, rgba(107,107,255,0.02), transparent 6%),
              linear-gradient(180deg, #07080a 0%, #0b1220 50%, #05060a 100%);
  position: relative;
  overflow: hidden;
}

.movie-detail-page { 
  color: #eaf0ff; 
}

.rating-circle {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.35));
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-direction: column;
  border: 1px solid rgba(255,255,255,0.04);
  box-shadow: 0 6px 20px rgba(2,6,23,0.6);
}

.rating-value { 
  font-weight: 700; 
  font-size: 18px; 
  color: #fff; 
}

.rating-label { 
  color: #98a1b3; 
  font-size: 11px; 
}

.imdb-box {
  text-align: center;
  padding: 6px 10px;
  border-radius: 12px;
  background: #0f1724;
  border: 1px solid rgba(255,255,255,0.03);
}

.imdb-score { 
  font-weight: 700; 
  color: #fff; 
}

.badge { 
  padding: 6px 8px; 
  background: rgba(255,255,255,0.03); 
  border-radius: 8px; 
  border: 1px solid rgba(255,255,255,0.03); 
}

.vibe-pill { 
  background: rgba(255,255,255,0.02); 
  padding: 8px 12px; 
  border-radius: 10px; 
  display: inline-block; 
  color: #d6def8; 
  border: 1px solid rgba(255,255,255,0.03); 
}

.overview-panel { 
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2)); 
}

.poster-card img { 
  display: block; 
  width: 100%; 
  height: auto; 
  object-fit: cover; 
}

.cast-panel img { 
  object-fit: cover; 
}

.loader-ring { 
  border-top-color: #6b6bff; 
  border-left-color: rgba(255,255,255,0.06); 
  border-right-color: rgba(255,255,255,0.04); 
  border-bottom-color: rgba(255,255,255,0.02); 
  border-style: solid; 
  border-width: 4px; 
  border-radius: 999px; 
  animation: spin 1s linear infinite; 
}

@keyframes spin { 
  to { 
    transform: rotate(360deg); 
  } 
}

@media (max-width: 900px) {
  .movie-detail-page { 
    padding: 12px; 
  }
  .rating-circle { 
    width: 60px;
    height: 60px; 
  }
  .imdb-box { 
    padding: 6px 8px; 
  }
}
</style>