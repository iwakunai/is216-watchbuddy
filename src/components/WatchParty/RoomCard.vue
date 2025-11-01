<template>
    
    <div class="bg-white/5 p-4 rounded-lg text-center shadow-md flex flex-col justify-between">

        <div class="flex justify-between items-start mb-3">
            <!-- MOVIE INFORMATION -->
            <div class="movie-info flex-1">
                <h3 class="font-semibold text-lg text-left break-words whitespace-normal">{{ room.name }}</h3>
                <p class="text-left font-semibold break-words whitespace-normal">{{ room.movie }}</p>
                <p class="text-left break-words whitespace-normal">Datetime: {{ formattedDatetime  }}</p>
                <p class="text-left break-words whitespace-normal">Hosted by: {{ room.host }}</p>
            </div>

            <!-- ROOM STATUS + VIBE? -->
            <div class="flex flex-col items-end gap-1">
                <!-- STATUS -->
                <span
                    :class="[
                        'text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap',
                        status === 'playing'
                            ? 'bg-green-600/80 text-white'
                            : status === 'scheduled'
                            ? 'bg-gray-500/70 text-white'
                            : 'bg-red-600/80 text-white'
                    ]"
                >
                    {{ formatStatus(status) }}
                </span>

                <!-- VIBE -->
                <span
                    v-if="room.vibe"
                    class="text-xl"
                    :title="room.vibe"
                >
                    {{ getVibeEmoji(room.vibe) }}
                </span>
            </div>
            
        </div>

        <!-- JOIN PARTY BUTTON -->
        <button
            class="w-full px-3 py-1 border rounded-lg mt-auto hover:bg-white/10"
            @click="joinRoom"
        >
            Join Room
        </button>

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router';
const vibes = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'excited', label: 'Excited', emoji: '🤩' },
    { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
    { id: 'angry', label: 'Angry', emoji: '😠' },
    { id: 'bored', label: 'Bored', emoji: '😐' },
    { id: 'romantic', label: 'Romantic', emoji: '❤️' },
    { id: 'chill', label: 'Chill', emoji: '😎' },
    { id: 'motivated', label: 'Motivated', emoji: '💪' },
    { id: 'playful', label: 'Playful', emoji: '😜' }
];

const router = useRouter();
const props = defineProps({
    room: {
        type: Object,
        required: true
    }
})

function getVibeEmoji(vibeId: string) {
    const v = vibes.find(v => v.id === vibeId);
    return v ? v.emoji : '';
}

const status = computed(() => {
    if (!props.room.datetime || !props.room.duration) return "scheduled";

    const now = new Date();
    const start = new Date(props.room.datetime);
    const end = new Date(start.getTime() + props.room.duration * 60 * 1000); // duration in minutes

    if (now < start) return "scheduled";
    if (now >= start && now <= end) return "playing";
    return "ended";
});

function formatStatus(status: string) {
    switch (status) {
        case "playing": return "Playing";
        case "scheduled": return "Scheduled";
        case "ended": return "Ended";
        default: return "Unknown";
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

<style scoped>
</style>