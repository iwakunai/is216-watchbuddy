<template>
    <!-- MARGIN + PADDING -->
    <div class="my-8 "> 

        <!-- HEADING -->
        <div>
            <h2 class="text-2xl font-semibold mb-4">Trending Watch Parties</h2>
        </div>

        <!-- WATCH PARTY ROOM CARDS -->
        <div class="flex overflow-x-auto gap-8 pb-3 px-10">
            <RoomCard v-for="room in filterRooms" :key="room.roomid" :room="room" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import RoomCard from '@/components/WatchParty/RoomCard.vue';
import { useUserStore } from "@/stores/user";

const watchRooms = ref([
    { roomid: "001", name: "OPM EP1", movie: "One-Punch Man", datetime: "2025-10-30T19:30:00+08:00", joined: 199, tags: ["Anime", "Fighting"], mood: ['🤩', '🤪','🔥']}, 
    { roomid: "002",name: "Monster EP3", movie: "Monster: The Ed Gein Story", datetime: "2025-10-28T05:30:00+08:00", joined: 182, tags: ["Movie", "Horror"], mood: ['😱', '👻','🤩']}, 
    { roomid: "003",name: "Mis Imp", movie: "Mission: Impossible - The Final Reckoning", datetime: "2025-10-24T15:00:00+08:00", joined: 78, tags: ["Adventure", "Fighting"], mood: ['🤩', '😎', '😩']}, 
]);

const userStore = useUserStore();

const filterRooms = computed(()=>{
    if(!userStore.selectedMood) return watchRooms.value
    return watchRooms.value.filter(room =>
        room.mood.includes(userStore.selectedMood!)
    )
})

</script>

<style scoped>
</style>