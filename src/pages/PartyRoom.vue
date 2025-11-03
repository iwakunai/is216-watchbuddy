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
            <template v-if="hasStarted">
                {{ currentTime }} / {{ totalDuration }}
            </template>
            <template v-else>
                Starting in {{ startCountdown }}
            </template>
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
                    @keyup.enter="handleSendMessage"
                    type="text"
                    placeholder="Type a message..."
                    class="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    @click="handleSendMessage"
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
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/vue";
import { sendMessage as sendChatMessage, fetchMessages as fetchChatMessages, subscribeToMessages } from "@/lib/supabaseChat";
import { joinRoom, leaveRoom, fetchRoomUsers, subscribeRoomUsers } from "@/lib/supabaseRoomUser";

const { user } = useUser();
const route = useRoute();
const router = useRouter();

const roomId = route.params.roomid as string;

// Reactive state
const room = ref<any>(null);
const users = ref<any[]>([]);
const messages = ref<any[]>([]);
const newMessage = ref("");
const chatContainer = ref<HTMLElement | null>(null);

// Timer
const currentTimeSec = ref(0);
const totalDurationSec = ref(0);
let timerInterval: number | null = null;
const timeUntilStartSec = ref(0);
const hasStarted = ref(false);

// Computed for display
const startCountdown = computed(() => {
    let sec = timeUntilStartSec.value;
    if (sec <= 0) return "00:00";

    const days = Math.floor(sec / 86400);
    sec %= 86400;
    const hours = Math.floor(sec / 3600);
    sec %= 3600;
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;

    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(" ");
});


function scheduleTimerStart(scheduledTimeStr: string) {
    const scheduledTime = new Date(scheduledTimeStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - scheduledTime.getTime()) / 1000);

    if (diffSec >= 0) {
        // Already started
        hasStarted.value = true;
        // Compute elapsed time — if session already started, jump ahead
        if (diffSec >= totalDurationSec.value) {
            // The session is already over
            currentTimeSec.value = totalDurationSec.value;
        } else {
            currentTimeSec.value = diffSec;
            startTimer();
        }
    } else {
        // Not started: Show countdown
        hasStarted.value = false;
        timeUntilStartSec.value = Math.abs(diffSec);

        // Update countdown every second
        const countdownInterval = window.setInterval(() => {
            if (timeUntilStartSec.value > 0) {
                timeUntilStartSec.value -= 1;
            } else {
                clearInterval(countdownInterval);
                hasStarted.value = true;
                startTimer();
            }
        }, 1000);
    }
}

// Format seconds into HH:MM:SS
function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
}

// Computed reactive times
const currentTime = computed(() => formatTime(currentTimeSec.value));
const totalDuration = computed(() => formatTime(totalDurationSec.value));

// Scroll chat to bottom
function scrollToBottom() {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    });
}

// Navigation
function goBack() {
    router.back();
}

function inviteFriends() {
    alert("Invite link copied!");
}

// Send message
async function handleSendMessage() {
    if (!newMessage.value.trim() || !user.value) return;

    try {
        await sendChatMessage(roomId, user.value.id, newMessage.value.trim());
        newMessage.value = ""; // clear input, real-time subscription will push the message
    } catch (err: any) {
        console.error("Failed to send message:", err);
        alert(`Failed to send message: ${err.message || err}`);
    }
}

// Start main timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
        if (currentTimeSec.value < totalDurationSec.value) {
            currentTimeSec.value += 1;
        } else {
            clearInterval(timerInterval!);
        }
    }, 1000);
}

// Fetch room info
async function fetchRoom() {
    const { data, error } = await supabase
        .from("party_rooms")
        .select("*, users: host_id (username)")
        .eq("id", roomId)
        .single();

    if (error) {
        console.error("Failed to fetch room:", error);
        return;
    }

    room.value = {
        name: data.room_name,
        movie: data.title,
        duration: data.duration,
        scheduled_time: data.scheduled_time,
        host: data.users?.username || "Unknown"
    };

    totalDurationSec.value = data.duration * 60;
    scheduleTimerStart(data.scheduled_time);
}

// Real-time messages / presence
let messageSubscription: any = null;

onMounted(async () => {
    await fetchRoom();

    // join presence
    if (user.value && user.value.id && user.value.username) {
        await joinRoom(roomId, user.value.id, user.value.username);
    }

    // fetch initial users
    users.value = await fetchRoomUsers(roomId);

    // subscribe to changes
    const presenceChannel = subscribeRoomUsers(roomId, (updatedUsers) => {
        users.value = updatedUsers;
    });

    const msgs = await fetchChatMessages(roomId);
    messages.value = msgs.map((m: any) => ({
        id: m.id,
        text: m.text,
        user: {
            id: m.user_clerk_id,
            name: m.users?.username || "Unknown",
            initial: m.users?.username?.[0]?.toUpperCase() || "?"
        }
    }));
    scrollToBottom();

    messageSubscription = subscribeToMessages(roomId, (msg: any) => {
        messages.value.push(msg);
        scrollToBottom();
    });
    // Store so we can clean up later
    (window as any).presenceChannel = presenceChannel;
});

onBeforeUnmount(async() => {
    if (timerInterval) clearInterval(timerInterval);
    if (messageSubscription) supabase.removeChannel(messageSubscription);
    if ((window as any).presenceChannel) supabase.removeChannel((window as any).presenceChannel);
    if (user.value && user.value.id) {
        await leaveRoom(roomId, user.value.id);
    }
});

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
