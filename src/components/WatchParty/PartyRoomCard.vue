<template>
    
    <div class="bg-white/5 p-4 rounded-lg text-center shadow-md">

        <!-- MOVIE INFORMATION -->
        <div class="movie-info mr-10 truncate">
            <p class="font-semibold text-lg text-left line-clamp-2">{{ room.name }}</p>
            <p class="text-left">Name: {{ room.movie }}</p>
            <p class="text-left">Date Time: {{ room.datetime }}</p>
            <p class="text-left">Status: {{ room.status }}</p>
            <p v-if="room.waiting > 0" class="text-left">Waiting: {{ room.waiting }}</p>
            <p v-if="room.watching > 0" class="text-left">In-Room: {{ room.watching }}</p>
        </div>

        <!-- MOVIE TAGS -->
        <div class="text-left">
            <p class="inline-block px-3 py-1 mt-3 mr-2 rounded-full text-sm bg-white/10 border border-white/20 text-gray-200"
            v-for="tag in room.tags">
                {{ tag }}
            </p>
        </div>

        <!-- LAST COLUMN -->
        <div class="flex items-center justify-between mt-2 mb-2">
            <!-- MOVIE MOOD -->
            <div class="flex -space-x-5.5 text-3xl">
                <span v-for="emoji in room.mood">{{ emoji }}</span>
            </div>
            <!-- BUTTON [ JOIN | WAIT ] -->
            <button v-if="room.waiting > 0" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Wait</button>
            <button v-if="room.watching > 0" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Join</button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    room: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
</style>