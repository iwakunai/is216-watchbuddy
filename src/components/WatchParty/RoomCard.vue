<template>
    
    <div class="bg-white/5 p-4 rounded-lg text-center shadow-md flex flex-col justify-between">

        <div class="flex justify-between items-start mb-3">
            <!-- MOVIE INFORMATION -->
            <div class="movie-info mr-10">
                <h3 class="font-semibold text-lg text-left break-words whitespace-normal">{{ room.name }}</h3>
                <p class="text-left font-semibold break-words whitespace-normal">{{ room.movie }}</p>
                <p class="text-left break-words whitespace-normal">Hosted by: {{ room.host }}</p>
            </div>

            <!-- ROOM STATUS -->
            <span
                :class="[
                    'text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap',
                    room.status === 'playing'
                    ? 'bg-green-600/80 text-white'
                    : room.status === 'scheduled'
                    ? 'bg-yellow-500/80 text-black'
                    : 'bg-gray-500/70 text-white'
                ]"
            >
                {{ formatStatus(room.status) }}
            </span>
        </div>

        <!-- JOIN PARTY BUTTON -->
        <button class="w-full px-3 py-1 border rounded-lg mt-auto">
            Join Room
        </button>

    </div>
</template>

<script setup lang="ts">
defineProps({
    room: {
        type: Object,
        required: true
    }
})

function formatStatus(status: string) {
    switch (status) {
        case "playing":
            return "Playing";
        case "scheduled":
            return "Scheduled";
        default:
            return "Waiting to Start";
    }
}
</script>

<style scoped>
</style>