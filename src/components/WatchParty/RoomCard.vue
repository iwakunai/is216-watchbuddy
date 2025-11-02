<template>
  <div
    class="bg-white/5 p-4 rounded-lg text-center shadow-md flex flex-col justify-between"
  >
    <div class="flex justify-between items-start mb-3">
      <!-- MOVIE INFORMATION -->
      <div class="movie-info flex-1">
        <h3
          class="font-semibold text-lg text-left break-words whitespace-normal"
        >
          {{ props.room.name }}
        </h3>
        <p class="text-left font-semibold break-words whitespace-normal">
          {{ props.room.movie }}
        </p>
        <p class="text-left break-words whitespace-normal">
          Datetime: {{ formattedDatetime }}
        </p>
        <p class="text-left break-words whitespace-normal">
          Hosted by: {{ props.room.host }}
        </p>
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
              : 'bg-red-600/80 text-white',
          ]"
        >
          {{ formatStatus(status) }}
        </span>

        <!-- VIBE -->
        <span
          v-if="props.room.vibeId"
          class="text-xl"
          :title="props.room.vibeId"
        >
          {{ getVibeEmoji(props.room.vibeId) }}
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
