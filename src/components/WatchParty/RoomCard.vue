<template>
    
    <div class="bg-white/5 p-4 rounded-lg text-center shadow-md">

        <!-- MOVIE INFORMATION -->
        <div class="movie-info mr-10 truncate">
            <p class="font-semibold text-lg text-left line-clamp-2">{{ room.name }}</p>
            <p class="text-left">Name: {{ room.movie }}</p>
            <p class="text-left">Date Time: {{ formattedRD }} SGT</p>
            <p class="text-left">Participants: {{ room.joined }}</p>
        </div>

        <!-- MOVIE TAGS -->
        <div class="text-left">
            <p class="inline-block px-3 py-1 mt-3 mr-2 rounded-full text-sm bg-white/10 border border-white/20 text-gray-200"
            v-for="tag in room.tags">
                {{ tag }}
            </p>
        </div>

        <!-- LAST COLUMN -->
        <div class="flex items-center justify-between mt-2 mb-2">
            <!-- MOVIE MOOD -->
            <div class="flex -space-x-5.5 text-3xl">
                <span v-for="emoji in room.mood">{{ emoji }}</span>
            </div>
            <!-- BUTTON [ JOIN | WAIT ] *need change this part to prompt enter party room* -->
            <button @click="handleClick" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                {{ buttonLabel }}
            </button>
            <!-- <button v-if="roomStatus == false" @click="handleJoin(room.roomid)" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Join</button> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { format } from "date-fns";
import { useUserStore, type Room } from "@/stores/user";

const userStore = useUserStore();

const props = defineProps<{room : Room}>();

const currentTime = ref(new Date());
const roomDate = computed(()=> new Date(props.room.datetime));
const formattedRD = computed(()=> format(roomDate.value, 'd MMM h.mma'));
const roomStatus = computed(()=> currentTime.value >= roomDate.value);

// Check if user already joined
const isJoined = computed(() =>
    userStore.userInfo.joinedParties.some(p => p.roomid === props.room.roomid)
);

// Button label
const buttonLabel = computed(() => {
    if (isJoined.value) {
        return roomStatus.value ? "Joined" : "Waiting";
    } else {
        return roomStatus.value ? "Join" : "Wait";
    }
});

function handleClick() {
    userStore.toggleJoin(props.room);
}
</script>

<style scoped>
</style>