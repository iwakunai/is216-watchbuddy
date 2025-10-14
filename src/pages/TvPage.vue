<template>
    <BaseNavBar />
    <div class="min-h-screen bg-[#0b1220] text-[#eaf0ff]">
        <main class="max-w-[980px] mx-auto p-4">
            <h1 class="text-xl font-semibold">TV Shows</h1>

            <div v-if="loading" class="text-[#98a1b3] my-4">Loading…</div>
            <div v-else-if="error" class="my-3 p-3 rounded-lg bg-red-500/10 text-red-200">Error: {{ error }}</div>
            <div v-else-if="shows.length === 0" class="my-3 p-3 rounded-lg bg-white/5 text-[#98a1b3]">No shows found.</div>

            <ul v-else class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4">
                <li v-for="s in shows" :key="s.id" class="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-transform duration-200 ease-out transform hover:-translate-y-1 hover:scale-[1.02]">
                    <div class="w-[64px] h-[96px] rounded-md overflow-hidden bg-black/10 flex-shrink-0">
                        <img v-if="s.poster" :src="s.poster" :alt="s.title" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div class="flex-1">
                        <div class="font-medium">{{ s.title }}</div>
                        <div class="text-sm text-[#98a1b3]">{{ s.year }}</div>
                    </div>
                </li>
            </ul>
        </main>
    </div>
    
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseNavBar from '@/components/BaseNavBar.vue';
import localTv from '@/assets/tv.json';

type TvItem = { id: number | string; title: string; year?: number | string; poster?: string };

const shows = ref<TvItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadTv() {
    try {
        const useLocal = (import.meta.env.VITE_USE_LOCAL_TV === 'true') || true;
        const apiUrl = import.meta.env.VITE_TV_API || import.meta.env.VITE_MOVIES_API || '';

        if (useLocal) {
            shows.value = (localTv as TvItem[]);
            return;
        }

        if (!apiUrl) throw new Error('No API configured');
        const resp = await fetch(apiUrl);
        if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
        const data = await resp.json();
        shows.value = (Array.isArray(data) ? data : []);
    } catch (e: any) {
        error.value = e?.message || String(e);
        shows.value = [];
    } finally {
        loading.value = false;
    }
}

onMounted(loadTv);
</script>

<style scoped>
</style>