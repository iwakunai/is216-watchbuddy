<template>
    <div class="absolute inset-0 bg-cover bg-center -z-10"
         style="background-image: url('/path/to/your/cinema-blur.jpg'); filter: blur(8px) brightness(0.5);">
    </div>
  
    <div class="h-screen flex flex-col bg-slate-900/50 text-white overflow-hidden">
      
      <header class="flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0 shadow-lg z-10">
        <button @click="goBack" 
                class="flex items-center gap-2 text-sm text-gray-200 hover:text-white
                       bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/50
                       px-3 py-2 rounded-full transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back</span>
        </button>
        <div class="text-center">
          <h2 class="text-xl font-semibold">{{ room?.name }}</h2>
          <p class="text-<sm text-purple-400 font-medium">{{ room?.movie }}</p>
        </div>
        <div class="w-[88px]"></div> 
      </header>
  
      <div class="px-6 py-4 flex-shrink-0 z-0">
        <div class="max-w-2xl mx-auto p-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg">
          <template v-if="hasStarted">
            <div class="flex items-center justify-between gap-4">
              <div class="flex-shrink-0">
                <p class="text-xs text-gray-300">Now Playing</p>
                <p class="text-sm font-semibold text-white">{{ room?.movie }}</p>
              </div>
              
              <div class="flex-1 flex items-center gap-3 text-sm">
                <span class="text-gray-300">{{ currentTime }}</span>
                <div class="flex-1 bg-slate-700 rounded-full h-2.5">
                  <div class="bg-purple-600 h-2.5 rounded-full" :style="{ width: progressPercentage + '%' }"></div>
                </div>
                <span class="text-gray-300">{{ totalDuration }}</span>
              </div>
              
            </div>
          </template>
          <template v-else>
            <div class="text-center">
              <p class="text-lg font-semibold text-gray-300">Starting in...</p>
              <span class="text-6xl font-bold text-purple-400 animate-pulse">{{ startCountdown }}s</span>
            </div>
          </template>
        </div>
      </div>
  
  
      <div class="flex flex-1 overflow-hidden z-0">
        <aside class="w-1/4 min-w-[200px] bg-slate-800/80 backdrop-blur-sm border-r border-slate-700/50 p-4 overflow-y-auto flex-shrink-0 flex flex-col">
          <h3 class="text-sm font-semibold mb-4 text-gray-300 flex items-center gap-2 flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-2.122M17 20v-2m0 2H5.121a2 2 0 01-1.414-.586l-3-3a2 2 0 010-2.828l3-3a2 2 0 011.414-.586H17m0 0a3 3 0 00-5.356-2.122M17 20h5v-2a3 3 0 00-5.356-2.122M17 20v-2m0 2H5.121a2 2 0 01-1.414-.586l-3-3a2 2 0 010-2.828l3-3a2 2 0 011.414-.586H17m0 0a3 3 0 00-5.356-2.122"></path>
            </svg>
            In Room ({{ users.length }})
          </h3>
          <ul class="space-y-1 flex-1 overflow-y-auto">
            <li v-for="user in users" :key="user.id" 
                class="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
              
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-semibold">
                    {{ user.initial }}
                  </div>
                  <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <span>{{ user.name }}</span>
              </div>
              
              <svg v-if="user.isHost" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 8C18 6.89543 17.1046 6 16 6C14.8954 6 14 6.89543 14 8C14 8.93358 14.6667 9.73357 15.5 10L12.5 13L9.5 10C10.3333 9.73357 11 8.93358 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 8.93358 7.66667 9.73357 8.5 10L5.5 13L2.5 10C3.33333 9.73357 4 8.93358 4 8C4 6.89543 3.10457 6 2 6C0.89543 6 0 6.89543 0 8C0 8.93358 0.666667 9.73357 1.5 10L4.5 13L1.5 16C0.666667 16.2664 0 17.0664 0 18C0 19.1046 0.89543 20 2 20C3.10457 20 4 19.1046 4 18C4 17.0664 3.33333 16.2664 2.5 16L5.5 13L8.5 16C7.66667 16.2664 7 17.0664 7 18C7 19.1046 7.89543 20 9 20C10.1046 20 11 19.1046 11 18C11 17.0664 10.3333 16.2664 9.5 16L12.5 13L15.5 16C14.6667 16.2664 14 17.0664 14 18C14 19.1046 14.8954 20 16 20C17.1046 20 18 19.1046 18 18C18 17.0664 17.3333 16.2664 16.5 16L19.5 13L18.5 10C19.3333 9.73357 20 8.93358 20 8C20 6.89543 19.1046 6 18 6Z"></path>
              </svg>
            </li>
          </ul>
          <div class="flex-shrink-0 pt-2 border-t border-slate-700/50">
            <p vStorage.prototype.key = "2-xs text-gray-400 italic h-4">
              <span v-if="whoIsTyping">{{ whoIsTyping }} is typing...</span>
            </p>
          </div>
        </aside>
  
        <section class="flex-1 flex flex-col overflow-hidden">
          
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-for="msg in messages" :key="msg.id" 
                 class="flex items-start gap-3 transition-all duration-300 opacity-0 animate-fade-in"
                 style="animation-fill-mode: forwards;">
              <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {{ msg.user?.initial || '?' }}
              </div>
              <div class="flex flex-col">
                <p class="text-sm font-semibold" :style="{ color: msg.user?.color || '#a78bfa' }">{{ msg.user?.name || 'Unknown' }}</p>
                <p class="text-sm text-gray-200">{{ msg.text }}</p>
              </div>
            </div>
          </div>
  
          <div class="p-4 border-t border-slate-700/50 bg-slate-900 flex items-center gap-3 flex-shrink-0 shadow-2xl">
            <input
              v-model="newMessage"
              @keyup.enter="handleSendMessage"
              @input="handleTyping"
              type="text"
              placeholder="Type a message..."
              class="flex-1 bg-slate-700 rounded-lg px-4 py-2 text-sm outline-none text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500"
            />
            <button
              @click="handleSendMessage"
              class="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Send message"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  </style>
  
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

// function inviteFriends() {
//     alert("Invite link copied!");
// }

// Send message
async function handleSendMessage() {
    if (!newMessage.value.trim() || !user.value) return;

    try {
        await sendChatMessage(roomId, user.value.id, newMessage.value.trim());
        newMessage.value = ""; // clear input, real-time subscription will push the message
    } catch (err: any) {
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
