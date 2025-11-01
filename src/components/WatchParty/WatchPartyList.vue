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

        <!-- LOADING STATE -->
        <div v-if="loading" class="text-center text-gray-400 mt-10">
            Loading rooms...
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="filteredRooms.length === 0" class="text-center text-gray-400 mt-10">
            No rooms found
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from "vue";
import { supabase } from "@/lib/supabaseClient";
import RoomCard from "@/components/WatchParty/RoomCard.vue";
import RoomRow from "@/components/WatchParty/RoomRow.vue";

const props = defineProps<{
    view: "card" | "list";
    statusFilter: "all" | "playing" | "scheduled" | "ended";
}>();

// Reactive state
const watchRooms = ref<any[]>([]);
const searchQuery = ref("");
const loading = ref(true);

// Fetch rooms from Supabase
async function fetchRooms() {
    loading.value = true;

    const { data, error } = await supabase
    .from("party_rooms")
    .select(`
        id,
        room_name,
        movie_or_show,
        host,
        scheduled_time,
        duration,
        public_status,
        vibe
    `)
    .eq("public_status", true)
    .order("scheduled_time", { ascending: true });


    console.log("Supabase fetched data:", data);
    if (error) {
        console.error("Error fetching rooms:", error);
    } else if (data && data.length > 0) {
        // Map DB results to frontend-friendly structure
        watchRooms.value = data.map((room) => ({
            roomid: room.id,
            name: room.room_name,
            movie: room.movie_or_show,
            host: room.host,
            datetime: room.scheduled_time,
            duration: room.duration,
            status: getStatus(room.scheduled_time, room.duration),
            tags: [], //idk if still want
            vibe: room.vibe,
        }));
    } else {
        watchRooms.value = [];
    }

    loading.value = false;
}


// Determine room status using scheduled_time + duration
function getStatus(scheduledTime: string, duration?: number | null) {
    if (!scheduledTime) return "scheduled";

    const now = new Date();
    const start = new Date(scheduledTime);
    const end = duration
        ? new Date(start.getTime() + duration * 1000)
        : new Date(start.getTime() + 2 * 60 * 60 * 1000); // fallback: 2h

    if (now < start) return "scheduled";
    if (now >= start && now <= end) return "playing";
    return "ended";
}

// Fetch when component mounts
onMounted(fetchRooms);

// Computed: search + filter
const filteredRooms = computed(() => {
    let rooms = watchRooms.value;

    // Search by name/movie
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        rooms = rooms.filter(
            (room) =>
                room.name.toLowerCase().includes(query) ||
                room.movie.toLowerCase().includes(query)
        );
    }

    // Filter by status
    if (props.statusFilter !== "all") {
        rooms = rooms.filter((room) => room.status === props.statusFilter);
    }

    // Move ended rooms to the end
    rooms.sort((a, b) => {
        if (a.status === "ended" && b.status !== "ended") return 1;
        if (a.status !== "ended" && b.status === "ended") return -1;
        return 0; // otherwise keep original order
    });

    return rooms;
});

// const watchRooms = ref([
//     { roomid: "001", name: "OPM EP1", movie: "One-Punch Man", host: "yiting", datetime: "2025-10-30T19:30:00+08:00", status: 'waiting', tags: ["Anime", "Fighting"], mood: ['🤩', '🤪','🔥']}, 
//     { roomid: "002",name: "Monster EP3", movie: "Monster: The Ed Gein Story", host: "zeeys", datetime: "2025-10-28T05:30:00+08:00", status: 'playing', tags: ["Movie", "Horror"], mood: ['😱', '👻','🤩']}, 
//     { roomid: "003",name: "Mis Imp", movie: "Mission: Impossible - The Final Reckoning", host: "llama", datetime: "2025-10-24T15:00:00+08:00", status: 'scheduled', tags: ["Adventure", "Fighting"], mood: ['🤩', '😎', '😩']}, 
// ]);
</script>

<style scoped>
</style>