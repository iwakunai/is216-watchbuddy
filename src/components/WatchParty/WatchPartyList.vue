<template>
    <!-- SEARCH BAR -->
    <div class="text-left mb-4 px-10 mt-4"> 
        <input
            id="party-search"
            type="text"
            placeholder="Search for rooms or movies..."
            name="party-search"
            v-model="searchQuery"
            class="block w-full rounded-md bg-white px-3 py-1.5 mt-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
        />
    </div>

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

        <!-- EMPTY STATE -->
        <div v-if="filteredRooms.length === 0" class="text-center text-gray-400 mt-10">
            No rooms found
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import RoomCard from '@/components/WatchParty/RoomCard.vue';
// @ts-ignore
import RoomRow from '@/components/WatchParty/RoomRow.vue';
import { useUserStore } from "@/stores/user";

const props = defineProps<{
    view: 'card' | 'list',
    statusFilter: 'all' | 'waiting' | 'playing' | 'scheduled'
}>();


const watchRooms = ref([
    { roomid: "001", name: "OPM EP1", movie: "One-Punch Man", host: "yiting", datetime: "2025-10-30T19:30:00+08:00", status: 'waiting', tags: ["Anime", "Fighting"], mood: ['🤩', '🤪','🔥']}, 
    { roomid: "002",name: "Monster EP3", movie: "Monster: The Ed Gein Story", host: "zeeys", datetime: "2025-10-28T05:30:00+08:00", status: 'playing', tags: ["Movie", "Horror"], mood: ['😱', '👻','🤩']}, 
    { roomid: "003",name: "Mis Imp", movie: "Mission: Impossible - The Final Reckoning", host: "llama", datetime: "2025-10-24T15:00:00+08:00", status: 'scheduled', tags: ["Adventure", "Fighting"], mood: ['🤩', '😎', '😩']}, 
]);

const searchQuery = ref("");
const userStore = useUserStore();

const filteredRooms = computed(() => {
    let rooms = watchRooms.value;

    // search filter
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        rooms = rooms.filter(
        room => room.name.toLowerCase().includes(query) || room.movie.toLowerCase().includes(query)
        );
    }

    // status filter
    if (props.statusFilter !== 'all') {
        rooms = rooms.filter(room => room.status === props.statusFilter);
    }

    return rooms;
});

</script>

<style scoped>
</style>