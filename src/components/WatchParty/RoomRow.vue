<template>
    <div
        class="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg shadow-sm hover:bg-white/10 transition"
    >
        <div class="flex flex-col text-left">
            <h3 class="font-semibold text-lg truncate">{{ room.name }}</h3>
            <p class="text-sm text-gray-300">{{ room.movie }}</p>
            <p class="text-xs text-gray-400">Hosted by: {{ room.host }}</p>
        </div>

        <div class="flex items-center gap-4">
            <span
                :class="[
                'text-xs font-semibold px-2 py-1 rounded-md',
                room.status === 'playing'
                    ? 'bg-green-600/80 text-white'
                    : room.status === 'scheduled'
                    ? 'bg-yellow-500/80 text-black'
                    : 'bg-gray-500/70 text-white'
                ]"
            >
                {{ formatStatus(room.status) }}
            </span>
            <button
                class="px-3 py-1 border border-gray-500 rounded-md text-sm hover:bg-white/10"
            >
                Join
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
    room: { type: Object, required: true },
});

function formatStatus(status: string) {
    switch (status) {
        case "playing":
            return "Playing";
        case "scheduled":
            return "Scheduled";
        default:
            return "Waiting";
    }
}
</script>
