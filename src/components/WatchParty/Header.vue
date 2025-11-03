<template>
  <div class="sticky top-16 z-50 text-left pt-4 pb-2 px-4 sm:px-6 md:px-10 bg-gray-900">
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4 md:gap-0"
    >
      <!-- LEFT SIDE -->
      <div class="w-full md:w-auto">
        <!-- HEADING -->
        <h2 class="text-left text-2xl font-semibold mb-2 md:mb-3">
          Watch Party Lobby
        </h2>

        <!-- SUBHEADING -->
        <p class="mb-3">Join a party or create your own party</p>

        <!-- STATUS FILTER BUTTONS -->
        <div
          class="grid grid-cols-2 gap-2 mt-3 max-w-xs sm:flex sm:gap-3 sm:max-w-none"
        >
          <button
            v-for="option in ['all', 'playing', 'scheduled', 'ended']"
            :key="option"
            @click="$emit('status-filter', option)"
            :class="[
              'px-3 py-1 rounded-md border text-sm whitespace-nowrap text-center',
              currentStatus === option
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white/5 text-gray-700 dark:text-gray-300 border-gray-400'
            ]"
          >
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </button>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div
        class="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end"
      >
        <!-- VIEW TOGGLE -->
        <div
          class="flex bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700"
        >
          <button
            class="px-3 py-1 text-sm font-medium transition"
            :class="
              view === 'card'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            "
            @click="$emit('toggle-view', 'card')"
          >
            Card
          </button>

          <button
            class="px-3 py-1 text-sm font-medium transition"
            :class="
              view === 'list'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            "
            @click="$emit('toggle-view', 'list')"
          >
            List
          </button>
        </div>

        <!-- CREATE ROOM BUTTON -->
        <button
          class="font-medium px-4 py-2 rounded-lg transition outline-1 outline-gray-400 hover:outline-2 whitespace-nowrap"
          @click="handleClick"
        >
          + Create Room
        </button>
      </div>
    </div>
    <div class="text-left mb-4 mt-10">
      <input
        id="party-search"
        type="text"
        placeholder="Search for rooms or movies..."
        name="party-search"
        v-model="searchQuery"
        class="block w-full rounded-md bg-white px-3 py-1.5 mt-8 text-base text-gray-900
        outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400
        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
        dark:bg-white/5 dark:text-white dark:outline-white/10
        dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';

const emit = defineEmits(['open-create', 'toggle-view', 'status-filter', "search"])

defineProps({
  view: { type: String, default: 'card' },
  currentStatus: { type: String, default: 'all' }
})

const searchQuery = ref('');

watch(searchQuery, (value) => {
  emit('search', value);
});

function handleClick () {
  emit('open-create')
}
</script>

<style></style>
