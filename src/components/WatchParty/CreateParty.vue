<template>
  <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-11/12 max-w-md max-h-[90vh] p-6 relative overflow-y-auto"
    >
      <!-- CLOSE BUTTON -->
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
      >
        ✕
      </button>

      <!-- HEADING -->
      <h2 class="text-2xl font-semibold mb-4">Create Scheduled Party</h2>

      <!-- FORM -->
      <form class="flex flex-col gap-4 text-left" @submit.prevent="createRoomHandler">
        <!-- ROOM NAME -->
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Room Name</label
          >
          <input
            type="text"
            v-model="roomName"
            placeholder="e.g., Movie Night with Friends"
            class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div class="flex gap-4">
          <label>
            <input type="radio" value="movie" v-model="contentType" /> Movie
          </label>
          <label>
            <input type="radio" value="tv" v-model="contentType" /> TV Show
          </label>
        </div>

        <!-- MOVIE/SHOW TITLE -->
        <div class="flex flex-col relative">
          <input
            type="text"
            v-model="movieQuery"
            @input="onSearchInput"
            placeholder="Type to search..."
            class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <ul
            v-if="searchResults.length"
            class="absolute top-full left-0 z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 overflow-y-auto shadow-lg"
            style="max-height: 10rem"
          >
            <li
              v-for="item in searchResults"
              :key="item.id"
              @click="selectMovie(item)"
              class="px-3 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
            >
              {{ item.title }} ({{ item.year }})
            </li>
          </ul>
        </div>

        <!-- DURATION -->
        <div class="flex flex-col" v-if="duration !== null">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Duration (minutes)</label
          >
          <input
            type="number"
            v-model.number="duration"
            readonly
            class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <!-- MAX PARTICIPANTS -->
        <!-- <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Max Participants</label>
                    <input
                        type="number" v-model.number="maxParticipants"
                        placeholder="10"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div> -->

        <!-- SCHEDULE START TIME -->
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Scheduled Start Time</label
          >
          <input
            type="datetime-local"
            v-model="scheduledTime"
            class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Users can join early before the scheduled start
          </p>
        </div>

        <!-- PUBLIC STATUS -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Public Room</label
            >
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Allow anyone to join this room
            </p>
          </div>

          <input
            type="checkbox"
            v-model="publicRoom"
            class="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
        </div>

        <!-- VIBE -->
        <!-- <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Vibe</label
          >
          <select
            v-model="vibe"
            class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="" disabled>Select vibe</option>
            <option v-for="v in vibes" :key="v.id" :value="v.label">
              {{ v.label }}
            </option>
          </select>
        </div> -->

        <!-- INVITE FRIENDS -->
        <!-- <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Invite Friends</label>
                    <input
                        type="text"
                        v-model="inviteInput"
                        placeholder="Enter username(s) separated by commas"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400">Invite multiple friends by separating names with commas</p>
                    <button type="button" @click="addInvitedFriends" class="mt-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Add</button>

                    <div class="mt-2 flex flex-wrap gap-2">
                        <span v-for="friend in invitedFriends" :key="friend" class="bg-indigo-600 text-white px-2 py-1 rounded">{{ friend }}</span>
                    </div>
                </div> -->

        <!-- BUTTONS -->
        <div class="flex flex-col gap-2 mt-2">
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Room
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUser } from "@clerk/vue";
import { vibes } from "@/composables/vibes";
import { createRoom } from "@/lib/partyRooms";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const { user } = useUser(); 
const emit = defineEmits(["close", "created"]);

// Form fields
const roomName = ref("");
const watchTitle = ref("");
const duration = ref<number | null>(null);
const publicRoom = ref(true);
const scheduledTime = ref(""); // ISO string
const contentType = ref<"movie" | "tv">("movie");
let selectedPoster = ref("");

const vibe = ref(""); // store only mood id

// TMDB search
const movieQuery = ref("");
const searchResults = ref<
  Array<{ id: number; title: string; year: string; runtime?: number }>
>([]);

let searchTimeout: number | null = null;

function closeModal() {
  emit("close");
}

async function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = window.setTimeout(searchContent, 300);
}

async function searchContent() {
  const query = movieQuery.value.trim();
  if (!query) {
    searchResults.value = [];
    return;
  }
  const url = `${TMDB_BASE_URL}/search/${
    contentType.value
  }?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`;
  const res = await fetch(url);
  const data = await res.json();
  searchResults.value = (data.results || []).map((m: any) => ({
    id: m.id,
    title: m.title || m.name || "Untitled",
    year:
      contentType.value === "movie"
        ? m.release_date
          ? new Date(m.release_date).getFullYear().toString()
          : "N/A"
        : m.first_air_date
        ? new Date(m.first_air_date).getFullYear().toString()
        : "N/A",
    runtime: null,
  }));
}

async function selectMovie(item: any) {
  movieQuery.value = item.title; // update what’s shown in input
  watchTitle.value = item.title; // store for creating room
  searchResults.value = [];

  // Fetch details for runtime/duration
  const url = `${TMDB_BASE_URL}/${contentType.value}/${item.id}?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (contentType.value === "movie") {
    duration.value = data.runtime || 120;
  } else if (contentType.value === "tv") {
    duration.value = data.episode_run_time?.[0] || 45;
  }
  selectedPoster.value = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "";
}

// Create Room
async function createRoomHandler() {
  if (!user.value) {
    alert('You must be logged in to create a room');
    return;
  }

  const scheduledIso = new Date(scheduledTime.value).toISOString();

  const newRoom = await createRoom({
    roomName: roomName.value,
    hostId: user.value.id,
    title: watchTitle.value,
    scheduledTime: scheduledIso,
    duration: duration.value!,
    publicStatus: publicRoom.value,
    vibeId: vibe.value,
    posterUrl: selectedPoster.value,
  });

  if (!newRoom) {
    alert('Failed to create room.');
    return;
  }

  emit('created', newRoom);
//   emit('close');
}

// Add invited friends from input
// function addInvitedFriends() {
//     if (!inviteInput.value.trim()) return
//     const names = inviteInput.value.split(',').map(n => n.trim()).filter(Boolean)
//     invitedFriends.value.push(...names)
//     inviteInput.value = ''
// }
</script>

<style scoped>
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
