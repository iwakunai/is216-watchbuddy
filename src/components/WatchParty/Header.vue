<template>
  <div class="relative overflow-hidden border-b border-gray-800 mb-10">
    <div class="mx-auto px-4 py-10 relative">
      <!-- HEADING -->
      <h1 class="text-4xl sm:text-5xl font-extrabold mb-3 leading-tight">
        <span class="text-white font-extrabold"> Watch Party </span>
      </h1>

      <!-- SUBHEADING -->
      <p class="text-lg text-gray-400">
        Enjoy Movies and TV Shows together, join a Watch Party room to chat in
        real time!
      </p>

      <!-- FILTERS -->
      <div class="flex justify-center mt-6">
        <div class="inline-flex gap-2 items-center">
          <!-- FILTER BUTTONS -->
          <button
            v-for="option in ['all', 'playing', 'scheduled']"
            :key="option"
            @click="$emit('status-filter', option)"
            :class="[
              'px-5 py-2 rounded-full transition text-sm font-semibold tracking-wide outline-none cursor-pointer',
              currentStatus === option
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-transparent text-indigo-400 hover:bg-indigo-400/10 hover:text-white',
            ]"
          >
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </button>
        </div>
      </div>

      <!-- SEARCH BAR-->

      <div class="flex max-w-xs mx-auto mt-4 w-full">
        <!-- <button
          @click="showSearch = !showSearch"
          class="rounded-full  text-white w-8 h-8 flex items-center justify-center shadow hover:bg-indigo-700 transition ml-2"
          aria-label="Open search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.6 3.6a7.5 7.5 0 0013.05 13.05z"
            />
          </svg>
        </button> -->
        <div
          class="rounded-full text-white w-8 h-8 flex items-center justify-center shadow transition ml-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.6 3.6a7.5 7.5 0 0013.05 13.05z"
            />
          </svg>
        </div>
        
        <input
          id="party-search"
          type="text"
          placeholder="Search for rooms or movies..."
          name="party-search"
          v-model="searchQuery"
          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
        />
      </div>
      <!-- CREATE Party BUTTON -->
      <div class="m-auto mt-4">
        <button
          class="font-semibold px-4 py-2 rounded-full transition bg-indigo-600 hover:bg-indigo-700 shadow-lg whitespace-nowrap"
          @click="handleClick"
        >
          + Create Party
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";

const emit = defineEmits([
  "open-create",
  "toggle-view",
  "status-filter",
  "search",
]);

defineProps({
  view: { type: String, default: "card" },
  currentStatus: { type: String, default: "all" },
});

const showSearch = ref(false);
const searchQuery = ref("");

watch(searchQuery, (value) => {
  emit("search", value);
});

function handleClick() {
  emit("open-create");
}
</script>

<style></style>
