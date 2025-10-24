<template>
    <div class="h-screen flex flex-col">
        <RoomHeader />
        <div class="flex-1 overflow-auto p-4">
            <Chat :messages="messages"/>
        </div>
        <div class="sticky bottom-0">
            <MessageBox @send="handleSendMessage"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import RoomHeader from '@/components/Room/Header.vue';
import Chat from '@/components/Room/Chat.vue';
import MessageBox from '@/components/Room/MessageBox.vue';
import { ref } from 'vue';

interface Message {
    id: number;
    user: string;
    text: string;
    time: string;
}

const messages = ref<Message[]>([
    { id: 1, user: "admin", text: "Starting Timer in 5 minutes @everyone please get ready", time: "7:25 PM" },
    { id: 2, user: "llamah", text: "hihi", time: "7:25 PM" },
    { id: 3, user: "zeey", text: "hello people", time: "7:25 PM" },
    { id: 4, user: "eatings", text: "YOOO ITS STARTING...", time: "7:26 PM" },
]);

function handleSendMessage(text: string){
    if (!text.trim()) return;
    const now = new Date();
    messages.value.push({
        id: messages.value.length +1,
        user: "eatings",
        text,
        time: now.toLocaleTimeString([],{hour:'2-digit',minute: '2-digit'}),
    })
}

</script>

<style scoped>
</style>