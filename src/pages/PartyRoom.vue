<template>

    <div class="h-screen flex flex-col bg-gray-900 text-white">
        <!-- HEADER -->
        <header class="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700 flex-shrink-0">
            <button @click="goBack" class="flex items-center gap-2 hover:text-indigo-400">
                <span class="text-lg">←</span>
                <span>Back</span>
            </button>
            <div class="text-center">
                <h2 class="text-xl font-semibold">{{ room?.name }}</h2>
                <p class="text-sm text-gray-400">{{ room?.movie }}</p>
            </div>
            <button
                class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
                @click="inviteFriends"
            >
                Invite
            </button>
        </header>

        <!-- TIMER -->
        <div class="px-6 py-3 text-center text-gray-300 border-b border-gray-700 flex-shrink-0">
            {{ currentTime }} / {{ totalDuration }}
        </div>

        <!-- MAIN CONTENT -->
        <div class="flex flex-1 overflow-hidden">
            <!-- SIDEBAR -->
            <aside class="w-1/4 min-w-[200px] bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto flex-shrink-0">
            <h3 class="text-sm font-semibold mb-3 text-gray-400">In Room</h3>
            <ul class="space-y-2">
                <li v-for="user in users" :key="user.id" class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm">
                        {{ user.initial }}
                    </div>
                    <span>{{ user.name }}</span>
                </li>
            </ul>
            </aside>

            <!-- CHAT -->
            <section class="flex-1 flex flex-col overflow-hidden">
            <!-- MESSAGES SCROLLABLE -->
            <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
                <div v-for="msg in messages" :key="msg.id" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                    {{ msg.user?.initial || '?' }}
                </div>
                <div class="flex flex-col text-left">
                    <p class="text-sm font-semibold">{{ msg.user?.name || 'Unknown' }}</p>
                    <p class="text-sm">{{ msg.text }}</p>
                </div>
                </div>
            </div>

            <!-- INPUT FIXED AT BOTTOM -->
            <div class="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-3 flex-shrink-0">
                <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Type a message..."
                class="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                @click="sendMessage"
                class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold"
                >
                Send
                </button>
            </div>
            </section>
        </div>
    </div>


</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const roomId = route.params.roomid;

// Fake room data (later fetch from store or backend)
const room = ref({
    name: "OPM EP1",
    movie: "One-Punch Man",
});

// Total duration in seconds (example: 1h48m = 6480s)
const totalDurationSec = 6480;

// Current time in seconds (example: 14m23s = 863s)
const currentTimeSec = ref(0);

// Format seconds into HH:MM:SS
function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
}

// Computed reactive times for template
const currentTime = computed(() => formatTime(currentTimeSec.value));
const totalDuration = computed(() => formatTime(totalDurationSec));

// Auto-increment timer
let timerInterval: number;

onMounted(() => {
    timerInterval = window.setInterval(() => {
        if (currentTimeSec.value < totalDurationSec) {
            currentTimeSec.value += 1;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
});

onBeforeUnmount(() => {
    clearInterval(timerInterval);
});

// Users in the room
const users = ref([
    { id: 1, name: "yiting", initial: "Y" },
    { id: 2, name: "zeeys", initial: "Z" },
    { id: 3, name: "llama", initial: "L" },
]);

// Chat messages
const messages = ref([
    { id: 1, user: users.value[0], text: "This scene is epic!", reactions: [] },
    { id: 2, user: users.value[1], text: "The animation 🔥🔥🔥", reactions: [] },
]);

const newMessage = ref("");

// Navigation
function goBack() {
    router.back();
}   

function inviteFriends() {
    alert("Invite link copied!");
}

function sendMessage() {
    if (!newMessage.value.trim()) return;
    messages.value.push({
        id: Date.now(),
        user: users.value[0],
        text: newMessage.value.trim(),
        reactions: [],
    });
    newMessage.value = "";
    scrollToBottom();
}

function react(msgId: number, emoji: string) {
    console.log(`Reacted to ${msgId} with ${emoji}`);
}

// Auto-scroll chat
const chatContainer = ref<HTMLElement | null>(null);
function scrollToBottom() {
    nextTick(() => {
        if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    });
}

onMounted(scrollToBottom);
</script>


<style scoped>
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}
</style>
