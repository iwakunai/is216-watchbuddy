<template>
    <div class="px-6 my-8">
      <h2 class="text-2xl font-semibold mb-4">Trending Watch Parties</h2>
      <div class="flex gap-4 pb-4 scrollbar-hide">
        <div v-for="room in watchRooms" :key="room.name" class="min-w-[200px] bg-white p-4 rounded-lg text-center shadow-md">
          <p class="font-medium">{{ room.name }}</p>
          <p>👥 {{ room.watchers }} watching</p>
          <button class="mt-2 px-3 py-1 text-black rounded">Join ▶️</button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

 const watchRooms = ref([
  { name: 'Room 1', watchers: 12 },
  { name: 'Room 2', watchers: 8 },
  { name: 'Room 3', watchers: 9 }
])
</script>

<style scoped>

</style>