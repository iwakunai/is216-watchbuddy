<template>
  <BaseNavBar />
  <div class="min-h-screen bg-[#0b1220] text-[#eaf0ff]">
    <main class="max-w-[980px] mx-auto p-4">
      <h1 class="text-2xl sm:text-xl font-semibold inline-flex items-center gap-2">
        <span class="bg-gradient-to-r from-white to-[#cfd8ff] bg-clip-text text-transparent">Movies</span>
        <span class="text-[#6b6bff] text-sm">●</span>
      </h1>

      <div v-if="loading" class="flex items-center gap-2 text-[#98a1b3] my-4">
        <span class="w-[18px] h-[18px] rounded-full border-[3px] border-white/10 border-t-[#6b6bff] animate-spin"></span>
        Loading…
      </div>
      <div v-else-if="error" class="my-3 p-3 rounded-lg bg-red-500/10 text-red-200">Error: {{ error }}</div>
      <div v-else-if="movies.length === 0" class="my-3 p-3 rounded-lg bg-white/5 text-[#98a1b3]">No movies found.</div>

      <ul v-else class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 mt-4">
        <li v-for="m in movies" :key="m.id" class="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:-translate-y-1 hover:scale-[1.02] transition shadow-[0_8px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.6)] hover:border-[#6b6bff]/20">
          <div class="w-[72px] h-[104px] rounded-lg overflow-hidden bg-gradient-to-b from-white/5 to-black/10 flex-shrink-0">
            <img v-if="m.poster" :src="m.poster" :alt="m.title" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="flex-1">
            <div class="font-semibold">{{ m.title }}</div>
            <div class="text-sm text-[#98a1b3] mt-1">{{ m.year }}</div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseNavBar from '@/components/BaseNavBar.vue';
import localMovies from '@/assets/movies.json';

type MovieItem = { id: number | string; title: string; year?: number | string; poster?: string };

const movies = ref<MovieItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadMovies() {
  loading.value = true;
  error.value = null;

  try {
    // Read env var explicitly; default to local = true when not set
    const envVal = import.meta.env.VITE_USE_LOCAL_MOVIES;
    const useLocal = typeof envVal === 'string' ? (envVal === 'true') : true;
    const apiUrl = import.meta.env.VITE_MOVIES_API || '';

    if (useLocal) {
      movies.value = (localMovies as MovieItem[]);
      return;
    }

    if (!apiUrl) throw new Error('No API configured');
    const resp = await fetch(apiUrl);
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    movies.value = Array.isArray(data) ? data : [];
  } catch (e: any) {
    error.value = e?.message ?? String(e);
    movies.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadMovies);
</script>

<style scoped>
/* kept empty since you use Tailwind-like utility classes */
</style>
