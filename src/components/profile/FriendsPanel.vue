<script setup lang="ts">
import { ref } from 'vue'
import type { Friend, FriendRequest } from '@/types/profile'

const props = defineProps<{
  friends: Friend[]
  friendRequests?: FriendRequest[]
}>()

const emit = defineEmits<{
  (e: 'open-profile', id: string): void
  (e: 'remove-friend', id: string): void
  (e: 'accept-request', id: string): void
  (e: 'reject-request', id: string): void
  (e: 'add-friend'): void
}>()

const activeSubTab = ref<'friends' | 'requests'>('friends')
</script>

<template>
  <div class="space-y-5">
    <!-- Sub-tab Navigation -->
    <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeSubTab = 'friends'"
          :class="[
            'flex-1 py-3 px-4 font-medium text-sm transition-colors',
            activeSubTab === 'friends'
              ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Friends ({{ friends.length }})
        </button>
        <button
          @click="activeSubTab = 'requests'"
          :class="[
            'flex-1 py-3 px-4 font-medium text-sm transition-colors relative',
            activeSubTab === 'requests'
              ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Requests
          <span v-if="friendRequests && friendRequests.length > 0" 
                class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {{ friendRequests.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Friends Tab -->
    <div v-if="activeSubTab === 'friends'" class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
          My Friends
        </h3>
        <button 
          class="bg-gray-900 hover:bg-gray-800 text-white font-medium py-1.5 px-3 rounded-lg transition-colors text-sm"
          @click="emit('add-friend')"
        >
          + Add Friend
        </button>
      </div>

      <div v-if="friends.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 font-medium mb-2">No friends yet</p>
        <p class="text-sm text-gray-400 mb-4">Start connecting with other WatchBuddy users!</p>
        <button 
          class="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          @click="emit('add-friend')"
        >
          Find Friends
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="friend in friends" 
          :key="friend.id"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 flex-1 cursor-pointer" @click="emit('open-profile', friend.id)">
              <div class="relative">
                <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img v-if="friend.avatar" :src="friend.avatar" :alt="friend.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg">
                    {{ friend.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <span 
                  v-if="friend.status === 'online'"
                  class="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-white"
                  title="Online"
                ></span>
                <span 
                  v-else-if="friend.status === 'away'"
                  class="absolute -bottom-0.5 -right-0.5 bg-yellow-500 w-3 h-3 rounded-full border-2 border-white"
                  title="Away"
                ></span>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ friend.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ friend.status === 'online' ? '🟢 Online' : friend.status === 'away' ? '🟡 Away' : '⚪ Offline' }}
                </p>
              </div>
            </div>
            <button
              @click="emit('remove-friend', friend.id)"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 px-2 py-1 text-sm font-medium"
              title="Remove friend"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Friend Requests Tab -->
    <div v-else class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
        Friend Requests
      </h3>

      <div v-if="!friendRequests || friendRequests.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 font-medium">No pending requests</p>
        <p class="text-sm text-gray-400 mt-1">You're all caught up!</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="request in friendRequests" 
          :key="request.id"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <img v-if="request.avatar" :src="request.avatar" :alt="request.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold text-lg">
                  {{ request.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ request.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Requested {{ request.requestedAt }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="emit('accept-request', request.id)"
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Accept
              </button>
              <button
                @click="emit('reject-request', request.id)"
                class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
