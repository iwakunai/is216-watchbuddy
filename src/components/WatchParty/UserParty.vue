<template>
    <div>
        <!-- HEADING -->
        <div>
            <h2 class="text-2xl font-semibold mb-4 text-left">My Parties</h2>
        </div>

        <!-- PARTY LIST -->
        <div v-if="userParties.length > 0" class="flex flex-wrap gap-6">
            <RoomCard
                v-for="party in userParties"
                :key="party!.roomid"
                :room="party!"
            />
        </div>
        
        <!-- EMPTY LIST -->
        <div v-else class="text-gray-400 text-center mt-4">
            No parties joined
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore, type Room } from '@/stores/user';
import RoomCard from './RoomCard.vue';

const userStore = useUserStore();

const userParties = computed<Room[]>(() => userStore.userInfo.joinedParties);

</script>

<style scoped></style>