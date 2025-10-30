<template>
    <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-11/12 max-w-md max-h-[90vh] p-6 relative overflow-y-auto">

            <button 
                @click="closeModal"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
                ✕
            </button>

            <!-- HEADING -->
            <h2 class="text-2xl font-semibold mb-4">Create Party</h2>

            <!-- FORM -->
            <form class="flex flex-col gap-4 text-left">
                <!-- ROOM NAME -->
                <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Room Name</label>
                <input
                    type="text"
                    placeholder="e.g., Movie Night with Friends"
                    class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                </div>

                <!-- MOVIE/SHOW TITLE -->
                <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Movie/Show Title</label>
                <input
                    type="text"
                    placeholder="e.g., The Shawshank Redemption"
                    class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                </div>

                <!-- DURATION -->
                <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes)</label>
                <input
                    type="number"
                    placeholder="e.g., 120"
                    class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                </div>

                <!-- MAX PARTICIPANTS -->
                <div class="flex flex-col">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Max Participants</label>
                <input
                    type="number"
                    placeholder="10"
                    class="mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                </div>

                <!-- PUBLIC ROOM TOGGLE -->
                <div class="flex items-center justify-between">
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Public Room</label>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Allow anyone to join this room</p>
                </div>
                <label class="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-indigo-600 transition-all"></div>
                </label>
                </div>

                <!-- SCHEDULE START TIME TOGGLE -->
                <div class="flex items-center justify-between">
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Start Time</label>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Set when the watch party begins</p>
                </div>
                <label class="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-indigo-600 transition-all"></div>
                </label>
                </div>

                <!-- BUTTONS -->
                <div class="flex flex-col gap-2 mt-2">
                <button
                    type="submit"
                    class="bg-gray-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-black dark:hover:bg-indigo-700 transition"
                >
                    Create Room
                </button>
                </div>

            </form>
        </div>
    </div>

    
    
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
const emit = defineEmits(['close']);

function closeModal() {
    emit('close');
}
</script>

<style scoped>
</style>