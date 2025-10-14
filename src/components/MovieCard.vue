<template>
    <!-- flex-shrink-0 : prevent flex item from shrinking -->
    <div class="movie_card flex-shrink-0 w-[160px]">
        <a href="#">
            <img class="trending_movie_img h-[auto] rounded-md object-cover"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"/>
        </a>
        <div class="text-left mt-2">
            <p class="text-lg font-semibold">{{ movie.title || movie.name }}</p>
            <p class="font-light">{{ movie.release_date }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    movie: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
</style>