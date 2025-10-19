<template>
    <div class="px-10 my-8 "> 
        <div id="watch-party-heading" class="flex">
            <h2 class="text-2xl font-semibold text-left mb-4">Watch Parties</h2>
            <!-- <div id="mood-based" class="text-2xl mx-4">😎 😢 🤩 😴</div> -->
        </div>
        <div class="flex overflow-x-auto space-x-8 pb-3">
            <div v-for="room in watchRooms" :key="room.movie"
            class="bg-white/5 p-4 rounded-lg text-center shadow-md">
                <div class="movie-info mr-10 truncate">
                    <p class="font-semibold text-lg text-left line-clamp-2">{{ room.movie }}</p>
                    <p class="text-left">Date Time: {{ room.datetime }}</p>
                    <p class="text-left">Status: {{ room.status }}</p>
                    <p v-if="room.waiting > 0" class="text-left">Waiting: {{ room.waiting }}</p>
                    <p v-if="room.watching > 0" class="text-left">Watching: {{ room.watching }}</p>
                </div>
                <div class="flex items-center justify-between mt-4 mb-2">
                    <div class="flex -space-x-5.5 text-3xl">
                        <span>😎</span>
                        <span>😢</span>
                        <span>🤩</span>
                    </div>
                    <button class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Join</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const watchRooms = ref([
    { movie: "One-Punch Man", datetime: "16 Oct 7.30PM SGT", status: "Not Started", waiting: 199, watching: 0}, 
    { movie: "Monster: The Ed Gein Story", datetime: "20 Oct 5.30AM SGT", status: "Started", waiting: 0, watching: 235}, 
    { movie: "Mission: Impossible - The Final Reckoning", datetime: "24 Oct 3.30PM SGT", status: "Not Started", waiting: 78, watching: 0}, 
]);
</script>

<style scoped>
</style>