<template>
    <div class="text-center my-12">
      <h2 class="text-xl font-semibold mb-4">How are you feeling today?</h2>
      <div class="flex justify-center gap-6 text-3xl">
        <span 
            v-for="emoji in moods" 
            :key="emoji" 
            @click="selectMood(emoji)"
            class="cursor-pointer"
        >     
            {{ emoji }}
        </span>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const moods = ref(['😎','😢','🤩','😴'])

function selectMood(emoji: string) {
  alert(`You selected mood: ${emoji}`)
}

</script>

<style scoped>

</style>