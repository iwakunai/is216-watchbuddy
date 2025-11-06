<template>
  <div class="mt-4 flex justify-center relative" v-if="user && showId">
    <div class="relative inline-block">
      <button
        @click="showWatchlistMenu = !showWatchlistMenu"
        :disabled="watchlistLoading"
        :class="[
          'px-[1rem] py-3 rounded-lg font-semibold text-sm transition-all flex items-center',
          currentWatchStatus === 'completed'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : currentWatchStatus === 'watching'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : currentWatchStatus === 'plan-to-watch'
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-[#6b6bff] hover:bg-[#5a5aff] text-white',
          watchlistLoading ? 'opacity-50 cursor-not-allowed' : '',
        ]"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            fill-rule="evenodd"
            clip-rule="evenodd"
            :d="
              currentWatchStatus === 'completed'
                ? 'M5 13l4 4L19 7'
                : currentWatchStatus === 'watching'
                ? 'M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                : currentWatchStatus === 'plan-to-watch'
                ? 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                : 'M12 4v16m8-8H4'"
            Z
          />
        </svg>
        <span v-if="watchlistLoading">Processing...</span>
        <span class="pl-[0.5rem] pr-[1.2rem]" v-else-if="currentWatchStatus">
          {{
            currentWatchStatus === "completed"
              ? "Completed"
              : currentWatchStatus === "watching"
              ? "Watching"
              : "Plan to Watch"
          }}
        </span>
        <span v-else>Add to Watchlist</span>
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showWatchlistMenu"
        class="absolute top-full mt-2 left-0 right-0 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
      >
        <button
          @click="() => handleWatchlistAction('completed')"
          class="w-full px-4 py-3 text-left text-white hover:bg-[#273549] transition-colors flex items-center gap-2"
        >
          <svg
            class="w-5 h-5 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Completed</span>
        </button>
        <button
          @click="() => handleWatchlistAction('watching')"
          class="w-full px-4 py-3 text-left text-white hover:bg-[#273549] transition-colors flex items-center gap-2"
        >
          <svg
            class="w-5 h-5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Currently Watching</span>
        </button>
        <button
          @click="() => handleWatchlistAction('plan-to-watch')"
          class="w-full px-4 py-3 text-left text-white hover:bg-[#273549] transition-colors flex items-center gap-2"
        >
          <svg
            class="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Plan to Watch</span>
        </button>
        <button
          v-if="currentWatchStatus"
          @click="removeFromWatchlistHandler"
          class="w-full px-4 py-3 text-left text-red-400 hover:bg-[#273549] transition-colors flex items-center gap-2 border-t border-gray-700"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Remove from Watchlist</span>
        </button>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import type { WatchStatus } from "@/composables/watchlist";
import {
  addToWatchlist,
  getWatchlistStatus,
  removeFromWatchlist,
} from "@/lib/supabaseWatchlist";
import { useUser } from "@clerk/vue";
import { ref, watch, onMounted } from "vue";
import type { MediaType } from "@/composables/watchlist";

const props = defineProps<{
  showId: string;
  show: any;
  media: MediaType;
}>();

const { user } = useUser();

const showWatchlistMenu = ref(false);
const currentWatchStatus = ref<WatchStatus | null>(null);
const watchlistLoading = ref(false);

// Load the watchlist status on mount and when user or showId changes
async function loadWatchlistStatus() {
  if (!user.value || !props.showId) return;

  try {
    const status = await getWatchlistStatus(
      user.value.id,
      props.showId,
      props.media
    );
    currentWatchStatus.value = status;
  } catch {
    currentWatchStatus.value = null;
  }
}

// Handle adding or updating watchlist item
async function handleWatchlistAction(status: WatchStatus) {
  if (!user.value || !props.media) return;

  watchlistLoading.value = true;
  showWatchlistMenu.value = false;

  try {
    // Use 'title' for movies and 'name' for TV shows
    const title = props.media === 'movie' 
      ? (props.show.title ?? "") 
      : (props.show.name ?? "");
    
    // Use 'release_date' for movies and 'first_air_date' for TV shows
    const dateField = props.media === 'movie' 
      ? props.show.release_date 
      : props.show.first_air_date;
    
    const year = dateField ? Number(dateField.slice(0, 4)) : null;

    await addToWatchlist(
      user.value.id,
      props.showId,
      props.media,
      status,
      title,
      props.show.poster_path ?? null,
      year
    );
    currentWatchStatus.value = status;
  } catch (err: any) {
    alert(err?.message || "Failed to update watchlist. Please try again.");
  } finally {
    watchlistLoading.value = false;
  }
}

// Handle removing from watchlist
async function removeFromWatchlistHandler() {
  if (!user.value || !props.showId) return;

  watchlistLoading.value = true;
  showWatchlistMenu.value = false;

  try {
    await removeFromWatchlist(user.value.id, props.showId, "tv");
    currentWatchStatus.value = null;
  } catch (err: any) {
    alert(err?.message || "Failed to remove from watchlist. Please try again.");
  } finally {
    watchlistLoading.value = false;
  }
}

// Reload watchlist status on user or showId or show object change
watch(
  [() => user.value, () => props.showId, () => props.show],
  () => {
    loadWatchlistStatus();
  },
  { immediate: true }
);

onMounted(() => {
  loadWatchlistStatus();
});
</script>
