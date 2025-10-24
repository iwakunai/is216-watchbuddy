<template>
    <div class="text-center my-12">
        <h2 class="text-xl font-semiold mb-4">How are you feeling today?</h2>
        <div class="flex justify-center gap-6 text-3xl">
            <span 
            v-for="emoji in moods" :key="emoji" @click="toggleMood(emoji)"
            class="cursor-pointer transition-transform hover:scale-125"
            :class="{'opacity-50': userStore.selectedMood && userStore.selectedMood}">
                {{ emoji }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref } from 'vue'

const moods = ref(['😎','😢','🤩','😴']);

const userStore = useUserStore();

function toggleMood(emoji: string){
    userStore.selectedMood = userStore.selectedMood == emoji ? null : emoji;
}


</script>

<style scoped>
</style>