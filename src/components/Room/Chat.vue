<template>
    <div class="flex flex-col h-full p-4">
        <div class="flex-1 overflow-y-auto space-y-2">
            <div v-for="msg in messages" :key="msg.id" class="flex flex-col">
                <span class="text-gray-400 text-md text-left font-medium pb-1">{{ msg.user }}</span>
                <div class="bg-[#273145] text-white rounded-lg relative px-4 py-2 max-w-xl w-fit">
                    <p class="text-md leading-snug pr-13 text-left whitespace-pre-wrap">{{ msg.text }}</p>
                    <span class="absolute bottom-1 right-2 text-gray-400 text-[11px]">
                        {{ msg.time }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PropType } from "vue";

interface Message {
    id: number;
    user: string;
    text: string;
    time: string;
}

const props = defineProps({
    messages: {
        type: Array as PropType<Message[]>,
        required: true,
    }
})
</script>

<style scoped>
/* optional custom scrollbar */
.flex-1::-webkit-scrollbar {
    width: 6px;
}
.flex-1::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 3px;
}
</style>