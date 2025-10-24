<template>
    <div class="p-4 flex items-center justify-between border-b border-gray-600">
        <!-- ROOM NAME -->
        <div class="flex-1 text-left">
            <h2 class="text-xl font-semibold truncate">{{ room.name }}</h2>
        </div>

        <!-- TIMER -->
        <div class="flex-1 text-center">
            <p class="inline-block text-xl font-medium border border-gray-400 rounded px-2 py-1">
                {{ formattedTimer }}
            </p>
        </div>

        <!-- USERS + INFO -->
        <div class="flex-1 flex items-center justify-end gap-4">
            <div class="flex items-center gap-1">
                <span>{{ room.joined }} watching</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

// Hardcoded room object
const room = ref({
    roomid: "001",
    name: "OPM EP1",
    movie: "One-Punch Man",
    datetime: "2025-10-25T04:20:00+08:00",
    joined: 199,
    tags: ["Anime", "Fighting"],
    mood: ['🤩', '🤪','🔥']
});

const currentTime = ref(new Date());

const formattedTimer = computed(() => {
    const roomTime = new Date(room.value.datetime).getTime();
    const now = currentTime.value.getTime();

    if (now < roomTime) {
        // Party hasn't started yet
        return "00:00";
    }

    // Time since start in ms
    const diff = now - roomTime;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    // Pad with zeros
    const mm = String(minutes).padStart(2, '0');
    const hh = String(hours).padStart(2, '0');

    return `${hh}:${mm}`;
});

let intervalId: number;
onMounted(() => {
    intervalId = window.setInterval(() => {
        currentTime.value = new Date();
    }, 60000); 
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<style scoped>
</style>