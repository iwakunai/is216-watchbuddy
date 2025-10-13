<template>
    <!-- flex-shrink-0 : prevent flex item from shrinking -->
    <div class="movie_card flex-shrink-0 w-[160px]">
        <a href="#">
            <img class="trending_movie_img h-[auto] rounded-md object-cover" :src="movie.img"/>
        </a>
        <div class="text-left mt-2">
            <p class="text-lg font-semibold">{{ movie.title }}</p>
            <p class="font-light">{{ movie.releaseDate }}</p>
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