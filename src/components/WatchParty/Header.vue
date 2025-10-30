<template>
    <div class="text-left mb-4 px-10 mt-4"> 

        <div class="flex items-center justify-between mb-2">
            
            <!-- LEFT SIDE -->
            <div>
                <!-- HEADING -->
                <h2 class="text-left text-2xl font-semibold mb-3">Watch Party Lobby</h2>

                <!-- SUBHEADING -->
                <p>Join a party or create your own party</p>

                <!-- STATUS FILTER BUTTONS -->
                <div class="flex gap-3 mt-3">
                    <button
                        v-for="option in ['all','waiting','playing','scheduled']"
                        :key="option"
                        @click="$emit('status-filter', option)"
                        :class="[
                            'px-3 py-1 rounded-md border',
                            currentStatus === option
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white/5 text-gray-700 dark:text-gray-300 border-gray-400'
                        ]"
                    >
                        {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                    </button>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="flex items-center gap-3">
            <!-- VIEW TOGGLE -->
                <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                    <button
                        class="px-3 py-1 text-sm font-medium transition"
                        :class="view === 'card' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                        @click="$emit('toggle-view', 'card')"
                    >
                        Card
                    </button>

                    <button
                        class="px-3 py-1 text-sm font-medium transition"
                        :class="view === 'list' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                        @click="$emit('toggle-view', 'list')"
                    >
                        List
                    </button>
                </div>

                <!-- CREATE ROOM BUTTON -->
                <button class="font-medium px-4 py-2 rounded-lg transition outline-1 outline-gray-400 hover:outline-2"
                @click="handleClick">
                    + Create Room
                </button>
            </div>
        
        </div>

    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['open-create', 'toggle-view', 'status-filter']);

defineProps({
  view: { type: String, default: 'card' },
  currentStatus: { type: String, default: 'all' }
});

function handleClick() {
    emit('open-create');
}
</script>

<style></style>