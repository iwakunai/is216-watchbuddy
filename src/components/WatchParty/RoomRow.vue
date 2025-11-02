<template>
  <div
    class="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg shadow-sm hover:bg-white/10 transition"
  >
    <div class="flex flex-col text-left">
      <h3 class="font-semibold text-lg truncate">{{ room.name }}</h3>
      <p class="text-sm text-gray-300">{{ room.movie }}</p>
      <p class="text-sm text-gray-300">Date: {{ formattedDatetime }}</p>
      <p class="text-sm text-gray-400">Hosted by: {{ props.room.host }}</p>
    </div>

    <div class="flex items-center gap-3">
      <span v-if="room.vibeId" class="text-xl" :title="props.room.vibeId">
        {{ getVibeEmoji(props.room.vibeId) }}
      </span>
      <span
        :class="[
          'text-xs font-semibold px-2 py-1 rounded-md',
          status === 'playing'
            ? 'bg-green-600/80 text-white'
            : status === 'scheduled'
            ? 'bg-gray-500/70 text-white'
            : 'bg-red-600/80 text-white',
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
import { useRouter } from "vue-router";
import type { Room } from "../../composables/room";
import { useRoomStatus } from "../../composables/room";

const props = defineProps<{ room: Room }>();

const router = useRouter();

const { status, formatStatus, formattedDatetime, getVibeEmoji } = useRoomStatus(
  props.room
);

function joinRoom() {
  router.push(`/watchparty/room/${props.room.roomid}`);
}
</script>
