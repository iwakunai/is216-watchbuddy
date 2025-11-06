<template>
  <div
    class="bg-gradient-to-r from-black/60 via-gray-900/80 to-gray-900 rounded-xl flex flex-col sm:flex-row overflow-hidden p-0 max-w-full sm:max-w-[430px] min-h-[220px] border border-white/8 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03] cursor-pointer"
  >
    <!-- POSTER -->
    <div v-if="props.room.posterUrl" class="w-full sm:w-40 h-52 sm:h-auto">
      <img
        :src="props.room.posterUrl"
        alt="Movie Poster"
        class="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
        @error="onImgError"
      />
    </div>
    <div
      v-else
      class="w-full sm:w-40 h-52 sm:h-auto bg-gray-800 flex items-center justify-center rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
    >
      <span class="text-gray-400 text-sm font-semibold">No Poster</span>
    </div>

    <!-- ROOM INFORMARION -->
    <div class="flex flex-col justify-between p-4 flex-1">
      <div>
        <h3 class="font-bold text-lg sm:text-xl text-white mb-1">
          {{ props.room.name }}
        </h3>
        <p class="text-md text-gray-200 mb-1">{{ props.room.movie }}</p>
        <p class="text-sm text-gray-400 mb-1">
          Start Time: {{ formattedDatetime }}
        </p>
        <p class="text-sm text-gray-400 mb-2">
          Hosted by: {{ props.room.host }}
        </p>
        <span
          :class="[
            'text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap mr-2',
            status === 'playing'
              ? 'bg-green-600/80 text-white'
              : status === 'scheduled'
              ? 'bg-gray-500/70 text-white'
              : 'bg-red-600/80 text-white',
          ]"
        >
          {{ formatStatus(status) }}
        </span>
      </div>
      <SignedIn>
        <button
        @click="joinRoom"
        class="w-3/4 mx-auto py-1 mt-3 border-[1.5px] border-indigo-300 rounded-md text-base font-medium text-white bg-transparent transition-all hover:bg-indigo-600/20 hover:border-indigo-400 focus:outline-none"
      >
        Join
      </button>
      </SignedIn>
      <SignedOut>
        <SignInButton>
            <button
              class="px-5 py-2 mt-2 bg-indigo-600 text-white rounded shadow font-semibold hover:bg-indigo-700"
            >
              Login to join!
            </button>
          </SignInButton>
      </SignedOut>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Room } from "../../composables/room";
import { useRoomStatus } from "../../composables/room";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/vue";

const props = defineProps<{ room: Room }>();
const { user } = useUser();
const router = useRouter();

const { status, formatStatus, formattedDatetime } = useRoomStatus(props.room);

function joinRoom() {
  if (!user.value) {
    return;
  }
  router.push(`/watchparty/room/${props.room.roomid}`);
}

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
}
</script>
