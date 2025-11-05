<template>
  <!-- WATCH LIST -->
  <div class="mb-8 px-10">
    <!-- WATCH PARTY ROOM CARDS -->
    <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <RoomCard v-for="room in slicedRooms" :key="room.roomid" :room="room" />
    </div>

    <!-- LOADING STATE -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-10"
    >
      <div
        class="w-16 h-16 rounded-full border-4 border-t-blue-600 border-l-gray-600 border-r-gray-700 border-b-gray-700 animate-spin mb-4"
      ></div>
      <p class="text-gray-400 text-lg">Loading Rooms...</p>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-else-if="slicedRooms.length === 0"
      class="text-center text-gray-400 mt-10"
    >
      No rooms found
    </div>

    <button class="my-5 text-gray-500" v-if="roomsToShow < filteredRooms.length" @click="roomsToShow += 6">
      Load More
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Room } from "../../composables/room";
import { useRoomStatus } from "../../composables/room";
import { fetchPublicRooms } from "@/lib/partyRooms";

const props = defineProps<{
  view: "card" | "list";
  statusFilter: "all" | "playing" | "scheduled" ; // remove ended and filter rooms for the day only
  searchQuery: string;
}>();

const watchRooms = ref<Room[]>([]);
const searchQuery = ref("");
const loading = ref(true);
const roomsToShow = ref(6);

// Fetch on mount and change
async function loadRooms() {
  loading.value = true;
  try {
    const rooms = await fetchPublicRooms();
    watchRooms.value = rooms;
  } catch (error) {
    watchRooms.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadRooms);

defineExpose({ loadRooms })

// Filter and sort rooms based on search and status filter
const filteredRooms = computed(() => {
  let rooms = watchRooms.value;
  
  // Date filter: only rooms for today
  const today = new Date();
  const todayYMD = today.toISOString().slice(0, 10);
  rooms = rooms.filter((room) => {
    const roomDate = new Date(room.datetime).toISOString().slice(0, 10);
    return roomDate === todayYMD;
  });

  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    rooms = rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        room.movie.toLowerCase().includes(query)
    );
  }

// User status filter
  if (props.statusFilter !== "all") {
    rooms = rooms.filter((room) => {
      const { status } = useRoomStatus(room);
      return status.value === props.statusFilter;
    });
  } else {
    // Show both "scheduled" and "playing" if "all" is selected
    rooms = rooms.filter((room) => {
      const { status } = useRoomStatus(room);
      return status.value === "scheduled" || status.value === "playing";
    });
  }

  rooms.sort((a, b) => {
    const aStatus = useRoomStatus(a).status.value;
    const bStatus = useRoomStatus(b).status.value;

    if (aStatus === "ended" && bStatus !== "ended") return 1;
    if (aStatus !== "ended" && bStatus === "ended") return -1;
    return 0;
  });

  return rooms;
});

// Load rooms
const slicedRooms = computed(() => {
  return filteredRooms.value.slice(0, roomsToShow.value);
});


</script>
