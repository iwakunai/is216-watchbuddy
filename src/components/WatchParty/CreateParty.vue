<template>
    <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-11/12 max-w-md max-h-[90vh] p-6 relative overflow-y-auto">

            <!-- CLOSE BUTTON -->
            <button 
                @click="closeModal"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
                ✕
            </button>

            <!-- HEADING -->
            <h2 class="text-2xl font-semibold mb-4">Create Scheduled Party</h2>

            <!-- FORM -->
            <form class="flex flex-col gap-4 text-left" @submit.prevent="createRoom">
                <!-- ROOM NAME -->
                <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Room Name</label>
                    <input
                        type="text" v-model="roomName"
                        placeholder="e.g., Movie Night with Friends"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <!-- MOVIE/SHOW TITLE -->
                <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Movie/Show Title</label>
                    <input
                        type="text" v-model="movieOrShow"
                        placeholder="e.g., The Shawshank Redemption"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <!-- DURATION -->
                <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes)</label>
                    <input
                        type="number" v-model.number="duration"
                        placeholder="e.g., 120"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <!-- MAX PARTICIPANTS -->
                <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Max Participants</label>
                    <input
                        type="number" v-model.number="maxParticipants"
                        placeholder="10"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <!-- SCHEDULE START TIME -->
                <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Start Time</label>
                    <input
                        type="datetime-local" v-model="scheduledTime"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400">Users can join early before the scheduled start</p>
                </div>

                <!-- PUBLIC STATUS -->
                <div class="flex items-center justify-between">
                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Public Room</label>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            Allow anyone to join this room
                        </p>
                    </div>

                    <input type="checkbox" v-model="publicRoom" class="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                </div>

                <!-- INVITE FRIENDS -->
                <!-- <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Invite Friends</label>
                    <input
                        type="text"
                        v-model="inviteInput"
                        placeholder="Enter username(s) separated by commas"
                        class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400">Invite multiple friends by separating names with commas</p>
                    <button type="button" @click="addInvitedFriends" class="mt-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Add</button>

                    <div class="mt-2 flex flex-wrap gap-2">
                        <span v-for="friend in invitedFriends" :key="friend" class="bg-indigo-600 text-white px-2 py-1 rounded">{{ friend }}</span>
                    </div>
                </div> -->

                <!-- BUTTONS -->
                <div class="flex flex-col gap-2 mt-2">
                    <button type="submit"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Create Room
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { defineEmits } from 'vue'
import { fetchSupabaseUserId } from '@/lib/supabaseUser'
import { useUser } from "@clerk/vue";

const { user } = useUser(); // reactive Clerk user
const emit = defineEmits(['close'])

// Form fields
const roomName = ref('')
const movieOrShow = ref('')
const duration = ref<number | null>(null)
const maxParticipants = ref<number | null>(null)
const publicRoom = ref(true)
const scheduledTime = ref('') // ISO string

// Close modal
function closeModal() {
    emit('close')
}

// Create Room (need to add policy to enable write access)
async function createRoom() {
  if (!user.value) {
    alert("You must be logged in to create a room")
    return
  }

  const hostId = await fetchSupabaseUserId(user.value.id)
  if (!hostId) {
    alert("Could not find your user ID in Supabase")
    return
  }

  if (!roomName.value || !movieOrShow.value || !scheduledTime.value || !maxParticipants.value) {
    alert('Please fill in all required fields')
    return
  }

  // Convert scheduled time to proper ISO format
  const scheduledIso = new Date(scheduledTime.value).toISOString()

  const { data, error } = await supabase
    .from('party_rooms')
    .insert([{
      room_name: roomName.value,
      host: hostId,
      movie_or_show: movieOrShow.value,
      scheduled_time: scheduledIso,
      no_of_participant: maxParticipants.value,
      public_status: publicRoom.value,
    //   invited: null
    }])
    .select()

  if (error) {
    console.error('Error creating room:', error)
    alert(`Error creating room: ${error.message}`)
  } else {
    console.log('Created room', data)
    emit('close')
  }
}

// Add invited friends from input
// function addInvitedFriends() {
//     if (!inviteInput.value.trim()) return
//     const names = inviteInput.value.split(',').map(n => n.trim()).filter(Boolean)
//     invitedFriends.value.push(...names)
//     inviteInput.value = ''
// }
</script>


<style scoped>
</style>