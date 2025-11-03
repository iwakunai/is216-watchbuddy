<template>
  <!-- WATCH LIST -->
  <div class="my-8 px-10">
    <!-- WATCH PARTY ROOM CARDS -->
    <div
      v-if="view === 'card'"
      class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
    >
      <RoomCard v-for="room in filteredRooms" :key="room.roomid" :room="room" />
    </div>

    <!-- WATCH PARTY ROOM LIST -->
    <div v-else class="flex flex-col gap-4">
      <RoomRow v-for="room in filteredRooms" :key="room.roomid" :room="room" />
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="text-center text-gray-400 mt-10">
      Loading rooms...
    </div>

    <!-- EMPTY STATE -->
    <div
      v-else-if="filteredRooms.length === 0"
      class="text-center text-gray-400 mt-10"
    >
      No rooms found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Room } from "../../composables/room";
import { useRoomStatus } from "../../composables/room";
import { fetchPublicRooms } from "@/lib/partyRooms";

const props = defineProps<{
  view: "card" | "list";
  statusFilter: "all" | "playing" | "scheduled" | "ended";
  searchQuery: string;
}>();

const watchRooms = ref<Room[]>([]);
const searchQuery = ref("");
const loading = ref(true);

// Fetch on mount and change
async function loadRooms() {
  loading.value = true;
  try {
    const rooms = await fetchPublicRooms();
    watchRooms.value = rooms;
  } catch (error) {
    console.error('Error loading rooms:', error);
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

  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    rooms = rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        room.movie.toLowerCase().includes(query)
    );
  }

  if (props.statusFilter !== "all") {
    rooms = rooms.filter((room) => {
      const { status } = useRoomStatus(room);
      return status.value === props.statusFilter;
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


</script>
