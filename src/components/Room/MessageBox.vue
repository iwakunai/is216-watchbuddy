<template>
    <div class="p-2 bg-[#1F253D] flex items-center gap-2">
        <input type="text"
        v-model="message"
        placeholder="Discuss..."
        class="flex-1 bg-[#1F253D] text-white placeholder-gray-400 px-2 focus:outline-none"
        @keyup.enter="emitMessage">

        <button 
            @click="emitMessage"
            class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-100 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            Send
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(["send"]);
const message = ref('');

function emitMessage(){
    if (!message.value.trim()) return;
    emit("send",message.value);
    message.value = "";
}
</script>

<style scoped></style>