<template>
  <nav
    :class="[
      'w-full',
      'bg-[#0b1220] border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-opacity-95',
      isOpen ? 'border-b border-gray-200' : 'border-b-0',
    ]"
  >
    <div class="mx-auto px-4">
      <div class="flex items-center  h-[6rem]">
        <ProfileButton class="md:hidden mr-aut p-2"/>
        <!-- Logo/Brand -->
        <RouterLink
          to="/"
          class="text-[2rem] font-bold text-indigo-500 bg-clip-text mx-auto md:mx-0"
        >
          WatchBuddy
        </RouterLink>

        <!-- Links + Search for Desktop -->
        <div class="hidden md:flex ml-auto items-center gap-4">
          <NavLinks />

          <!-- Search Bar for Desktop -->
          <div class="relative" ref="searchContainer">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search"
                class="w-64 px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                @input="onSearchInput"
                @focus="showResults = true"
              />
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <!-- Search Results Dropdown -->
            <div
              v-if="showResults && searchResults.length > 0"
              class="absolute top-full mt-2 w-80 bg-[#0f1729] border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
            >
              <div
                v-for="result in searchResults"
                :key="result.id"
                @click="navigateToDetail(result)"
                class="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0"
              >
                <img
                  v-if="result.poster_path"
                  :src="`https://image.tmdb.org/t/p/w92${result.poster_path}`"
                  :alt="result.title || result.name"
                  class="w-12 h-18 object-cover rounded"
                />
                <div
                  v-else
                  class="w-12 h-18 bg-gray-700 rounded flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-white font-medium">
                    {{ result.title || result.name }}
                  </p>
                  <p class="text-gray-400 text-sm">
                    {{ result.media_type === "movie" ? "Movie" : "TV Show" }}
                    <span v-if="result.release_date || result.first_air_date">
                      •
                      {{
                        (result.release_date || result.first_air_date).split(
                          "-"
                        )[0]
                      }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- No Results Message -->
            <div
              v-if="
                showResults &&
                searchQuery.length >= 3 &&
                searchResults.length === 0 &&
                !isSearching
              "
              class="absolute top-full mt-2 w-80 bg-[#0f1729] border border-white/10 rounded-lg shadow-xl p-4 z-50"
            >
              <p class="text-gray-400 text-center">No results found</p>
            </div>
          </div>

          <UserManagement />
        </div>

        <!-- Mobile dropdown menu -->
        <button
          class="md:hidden inline-flex items-center justify-center p-2 border border-gray-300 rounded-md"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="primary-menu"
          :aria-expanded="isOpen ? 'true' : 'false'"
          @click="toggle"
        >
          <svg
            class="w-6 h-6 stroke-current text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <!-- Links for mobile on toggle -->
      <div v-if="isOpen" class="md:hidden flex flex-col gap-1 py-2">
        <!-- User Button for Mobile -->
        <UserManagement />

        <NavLinks />

        <!-- Search Bar for Mobile -->
        <div class="relative mt-2 mb-2" ref="mobileSearchContainer">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search movies & TV shows..."
              class="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @input="onSearchInput"
              @focus="showResults = true"
            />
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Mobile Search Results -->
          <div
            v-if="showResults && searchResults.length > 0"
            class="absolute top-full mt-2 w-full bg-[#0f1729] border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
          >
            <div
              v-for="result in searchResults"
              :key="result.id"
              @click="navigateToDetail(result)"
              class="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0"
            >
              <img
                v-if="result.poster_path"
                :src="`https://image.tmdb.org/t/p/w92${result.poster_path}`"
                :alt="result.title || result.name"
                class="w-12 h-18 object-cover rounded"
              />
              <div
                v-else
                class="w-12 h-18 bg-gray-700 rounded flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-white font-medium">
                  {{ result.title || result.name }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ result.media_type === "movie" ? "Movie" : "TV Show" }}
                  <span v-if="result.release_date || result.first_air_date">
                    •
                    {{
                      (result.release_date || result.first_air_date).split(
                        "-"
                      )[0]
                    }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Mobile No Results -->
          <div
            v-if="
              showResults &&
              searchQuery.length >= 3 &&
              searchResults.length === 0 &&
              !isSearching
            "
            class="absolute top-full mt-2 w-full bg-[#0f1729] border border-white/10 rounded-lg shadow-xl p-4 z-50"
          >
            <p class="text-gray-400 text-center">No results found</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isOpen = ref(false);
const searchQuery = ref("");
const searchResults = ref<any[]>([]);
const showResults = ref(false);
const isSearching = ref(false);
const searchContainer = ref<HTMLElement | null>(null);
const mobileSearchContainer = ref<HTMLElement | null>(null);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const onSearchInput = () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Don't search if query is too short
  if (searchQuery.value.length < 3) {
    searchResults.value = [];
    showResults.value = false;
    return;
  }

  // Debounce search
  isSearching.value = true;
  searchTimeout = setTimeout(() => {
    performSearch();
  }, 500);
};

const performSearch = async () => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
        searchQuery.value
      )}&page=1`
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();

    // Filter to only movies and TV shows, limit to 8 results
    searchResults.value = data.results
      .filter(
        (result: any) =>
          result.media_type === "movie" || result.media_type === "tv"
      )
      .slice(0, 8);

    showResults.value = true;
  } catch (error) {
    console.error("Error searching:", error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const navigateToDetail = (result: any) => {
  // Close the dropdown
  showResults.value = false;
  searchQuery.value = "";
  searchResults.value = [];

  // Close mobile menu if open
  isOpen.value = false;

  // Navigate to the appropriate detail page
  if (result.media_type === "movie") {
    router.push(`/movie/${result.id}`);
  } else if (result.media_type === "tv") {
    router.push(`/tv/${result.id}`);
  }
};

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    searchContainer.value &&
    !searchContainer.value.contains(target) &&
    mobileSearchContainer.value &&
    !mobileSearchContainer.value.contains(target)
  ) {
    showResults.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>
