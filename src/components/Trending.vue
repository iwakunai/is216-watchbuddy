<template>
    <div>
        <p class="py-2 text-3xl font-semibold text-left mb-4">Trending</p>

        <!-- overflow-x-auto : horizontal scrolling -->
        <!-- space-x-8 : spacing in between the movie cards -->
        <!-- pb-3 : bottom padding -->
        <div class="flex overflow-x-auto space-x-8 pb-3">
            <MovieCard 
                v-for="movie in movies"
                :key="movie.id"
                :movie="movie"
            />
        </div>

    </div>
</template>

<script setup lang="ts">
import MovieCard from './MovieCard.vue'
import { ref } from 'vue'

const movies = ref([
    { id: 1, title: 'One-Punch Man', releaseDate: 'Oct 05, 2015', img: '/images/opm.webp' },
    { id: 2, title: 'TRON: Ares', releaseDate: 'Oct 09, 2025', img: '/images/ares.webp' },
    { id: 3, title: 'The Conjuring: Last Rites', releaseDate: 'Sep 04, 2025', img: '/images/conjuring.webp' },
    { id: 4, title: 'The Chair Company', releaseDate: 'Oct 12, 2025', img: '/images/chaircompany.webp' },
    { id: 5, title: 'Monster: The Ed Gein Story', releaseDate: 'Oct 03, 2025', img: '/images/monster.webp' },
    { id: 6, title: 'Mission: Impossible - The Final Reckoning', releaseDate: 'May 17, 2025', img: '/images/missionimp.webp' },
    { id: 7, title: 'The Fantastic 4: First Steps', releaseDate: 'Jul 24, 2025', img: '/images/fan4.webp' },
    { id: 8, title: 'xXx', releaseDate: 'Aug 09, 2002', img: '/images/x3.webp' },
    { id: 9, title: 'Peacemaker', releaseDate: 'Jan 13, 2022', img: '/images/peacemaker.webp' },
    { id: 10, title: 'The Woman in Cabin 10', releaseDate: 'Oct 10, 2025', img: '/images/cabin.webp' },
])
</script>

<style scoped>
div{
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.trending_movie_img{
    width: 160px;
    height: 200px;
    border-radius: 5px;
    object-fit: cover;
}

</style>