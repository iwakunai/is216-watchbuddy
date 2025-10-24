<template>
    <!-- MARGIN + PADDING -->
    <div class="px-10 my-8 "> 

        <!-- HEADING -->
        <div>
            <h2 class="text-2xl font-semibold mb-4">Trending Watch Parties</h2>
        </div>

        <!-- WATCH PARTY ROOM CARDS -->
        <div class="flex overflow-x-auto gap-8 pb-3 px-10">
            <PartyRoomCard v-for="room in watchRooms" :key="room.roomid" :room="room" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PartyRoomCard from '@/components/WatchParty/PartyRoomCard.vue';

const watchRooms = ref([
    { roomid: "001", name: "OPM EP1", movie: "One-Punch Man", datetime: "16 Oct 7.30PM SGT", status: "Not Started", waiting: 199, watching: 0, tags: ["Anime", "Fighting"], mood: ['🤩', '🤪','🔥']}, 
    { roomid: "002",name: "Monster EP3", movie: "Monster: The Ed Gein Story", datetime: "20 Oct 5.30AM SGT", status: "Started", waiting: 0, watching: 235, tags: ["Movie", "Horror"], mood: ['😱', '👻','🤩']}, 
    { roomid: "003",name: "Mis Imp", movie: "Mission: Impossible - The Final Reckoning", datetime: "24 Oct 3.30PM SGT", status: "Not Started", waiting: 78, watching: 0, tags: ["Adventure", "Fighting"], mood: ['🤩', '😎', '😩']}, 
]);
</script>

<style scoped>
</style>