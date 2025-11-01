<template>
    <div
        class="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg shadow-sm hover:bg-white/10 transition"
    >
        <div class="flex flex-col text-left">
            <h3 class="font-semibold text-lg truncate">{{ room.name }}</h3>
            <p class="text-sm text-gray-300">{{ room.movie }}</p>
            <p class="text-sm text-gray-300">Date: {{ formattedDatetime }}</p>
            <p class="text-sm text-gray-400">Hosted by: {{ room.host }}</p>
        </div>

        <div class="flex items-center gap-4">
            <span
                :class="[
                'text-xs font-semibold px-2 py-1 rounded-md',
                status === 'playing'
                    ? 'bg-green-600/80 text-white'
                    : status === 'scheduled'
                    ? 'bg-gray-500/70 text-white'
                    : 'bg-red-600/80 text-white'
                ]"
            >
                {{ formatStatus(status) }}
            </span>
            <button
                class="px-3 py-1 border border-gray-500 rounded-md text-sm hover:bg-white/10"
                @click="joinRoom"
            >
                Join
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from "vue";

const router = useRouter()
const props = defineProps({
    room: { type: Object, required: true },
})

// Example: assume each room has a `datetime` (start time) and `duration` in seconds
const status = computed(() => {
    if (!props.room.datetime || !props.room.duration) return "scheduled";

    const now = new Date();
    const start = new Date(props.room.datetime);
    const end = new Date(start.getTime() + props.room.duration * 1000);

    if (now < start) return "scheduled";
    if (now >= start && now <= end) return "playing";
    return "ended";
});

function formatStatus(status: string) {
    switch (status) {
        case "playing": return "Playing";
        case "scheduled": return "Scheduled";
        case "ended": return "Ended";
        default: return "Scheduled";
    }
}

// Format datetime nicely
const formattedDatetime = computed(() => {
    if (!props.room.datetime) return '';
    const date = new Date(props.room.datetime);
    return date.toLocaleString('en-SG', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore'
    });
});

function joinRoom() {
    router.push(`/party/${props.room.roomid}`)
}
</script>
