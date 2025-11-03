<template>
  <div class="p-10">
    <p class="text-3xl font-semibold text-left mb-4">Trending</p>

    <!-- overflow-x-auto : horizontal scrolling -->
    <!-- space-x-8 : spacing in between the movie cards -->
    <!-- pb-3 : bottom padding -->

    <!-- TODO: Hide scrollbar, add arrow keys to navigate -->
    <div class="flex overflow-x-auto space-x-8 pb-3">
      <MovieCard v-for="movie in movies" :key="movie" :movie="movie" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchTrending } from "@/lib/tmdbFetch";
import MovieCard from "./MovieCard.vue";
import { ref } from "vue";

const res = ref([]);
const movies = ref([]);

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: "",
  }
};

fetchTrending().then(data => {
    console.log("Fetched Movies: ", data);
    movies.value = data;
})
</script>

<style scoped>
div {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.trending_movie_img {
  width: 160px;
  height: 200px;
  border-radius: 5px;
  object-fit: cover;
}
</style>
