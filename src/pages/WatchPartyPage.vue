<template>
  <div class="max-w-4xl mx-auto p-8">
    <!-- Header -->
    <div class="mb-10 border-b pb-6">
      <h1 class="text-3xl font-bold mb-2">My Watch Parties</h1>
      <p class="mb-4 text-gray-600">Join or create watch parties with your friends!</p>
      <button class="createNewParty">+ Create New Party</button>
    </div>

    <!-- Upcoming Parties Section -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-3">Upcoming Parties</h2>
      <div class="parties-grid bg-gray-50 p-5 rounded shadow">
        <p class="text-gray-500">No upcoming parties to display. Check back later or create a new one!</p>
      </div>
    </section>

    <!-- Past Parties Section -->
    <section>
      <h2 class="text-xl font-semibold mb-3">Past Parties</h2>
      <div class="parties-grid bg-gray-50 p-5 rounded shadow">
        <p class="text-gray-500">No past parties to display.</p>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">

</script>

<style scoped>
    
</style>