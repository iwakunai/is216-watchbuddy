<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
    <BaseNavBar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p class="text-gray-600">Track your progress and unlock new badges</p>
      </div>

      <!-- Progress Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Badges Earned</p>
              <p class="text-3xl font-bold text-blue-600 mt-1">{{ earnedBadges }}</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span class="text-3xl">🏆</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Total Badges</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalBadges }}</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <span class="text-3xl">🎯</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Completion</p>
              <p class="text-3xl font-bold text-green-600 mt-1">{{ completionPercentage }}%</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <span class="text-3xl">✨</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Progress Bar -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold text-gray-900">Overall Progress</h3>
          <span class="text-sm font-semibold text-gray-600">{{ earnedBadges }} / {{ totalBadges }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${completionPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Badge Categories -->
      <div class="space-y-8">
        <!-- Mood Mastery Category -->
        <div class="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <span class="w-1 h-8 bg-blue-600 rounded-full mr-3"></span>
                Mood Mastery
              </h2>
              <p class="text-sm text-gray-600 mt-1">Watch content in different moods to unlock these badges</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Progress</p>
              <p class="text-xl font-bold text-blue-600">{{ getCategoryProgress('moodMastery') }}%</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div 
              v-for="badge in badges.moodMastery" 
              :key="badge.id"
              class="relative group"
            >
              <!-- Badge Display -->
              <div class="text-center cursor-pointer transform transition-all duration-200 hover:scale-105">
                <div 
                  class="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 transition-all"
                  :class="[
                    badge.earned 
                      ? 'bg-gradient-to-br from-amber-100 to-amber-200 ring-amber-100 group-hover:shadow-xl' 
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 ring-gray-200'
                  ]"
                >
                  <span 
                    class="text-5xl"
                    :class="badge.earned ? '' : 'grayscale opacity-50'"
                  >
                    {{ badge.icon }}
                  </span>
                  <!-- Lock Icon for Locked Badges -->
                  <div v-if="!badge.earned" class="absolute inset-0 flex items-center justify-center">
                    <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shadow-md">
                      <span class="text-white text-sm">🔒</span>
                    </div>
                  </div>
                </div>
                <p class="text-sm font-bold text-gray-900 mb-1">{{ badge.name }}</p>
                <p 
                  class="text-xs font-semibold px-2 py-1 rounded-full inline-block"
                  :class="badge.earned ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
                >
                  {{ badge.earned ? 'Earned' : 'Locked' }}
                </p>
                
                <!-- Progress Bar (for badges with progress) -->
                <div v-if="badge.progress !== undefined" class="mt-3 px-2">
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                      :style="{ width: `${(badge.progress / badge.target) * 100}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1">{{ badge.progress }} / {{ badge.target }}</p>
                </div>
              </div>

              <!-- Tooltip on Hover -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div class="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl max-w-xs whitespace-normal">
                  <p class="font-bold mb-1">{{ badge.name }}</p>
                  <p class="text-gray-300">{{ badge.description }}</p>
                  <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Watch Party Champion Category -->
        <div class="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <span class="w-1 h-8 bg-purple-600 rounded-full mr-3"></span>
                Watch Party Champion
              </h2>
              <p class="text-sm text-gray-600 mt-1">Host and join watch parties to earn these badges</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Progress</p>
              <p class="text-xl font-bold text-purple-600">{{ getCategoryProgress('watchParty') }}%</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div 
              v-for="badge in badges.watchParty" 
              :key="badge.id"
              class="relative group"
            >
              <div class="text-center cursor-pointer transform transition-all duration-200 hover:scale-105">
                <div 
                  class="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 transition-all"
                  :class="[
                    badge.earned 
                      ? 'bg-gradient-to-br from-purple-100 to-purple-200 ring-purple-100 group-hover:shadow-xl' 
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 ring-gray-200'
                  ]"
                >
                  <span 
                    class="text-5xl"
                    :class="badge.earned ? '' : 'grayscale opacity-50'"
                  >
                    {{ badge.icon }}
                  </span>
                  <div v-if="!badge.earned" class="absolute inset-0 flex items-center justify-center">
                    <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shadow-md">
                      <span class="text-white text-sm">🔒</span>
                    </div>
                  </div>
                </div>
                <p class="text-sm font-bold text-gray-900 mb-1">{{ badge.name }}</p>
                <p 
                  class="text-xs font-semibold px-2 py-1 rounded-full inline-block"
                  :class="badge.earned ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
                >
                  {{ badge.earned ? 'Earned' : 'Locked' }}
                </p>
                
                <div v-if="badge.progress !== undefined" class="mt-3 px-2">
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-purple-500 to-pink-600 h-full rounded-full transition-all duration-300"
                      :style="{ width: `${(badge.progress / badge.target) * 100}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1">{{ badge.progress }} / {{ badge.target }}</p>
                </div>
              </div>

              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div class="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl max-w-xs whitespace-normal">
                  <p class="font-bold mb-1">{{ badge.name }}</p>
                  <p class="text-gray-300">{{ badge.description }}</p>
                  <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Collection Master Category -->
        <div class="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <span class="w-1 h-8 bg-green-600 rounded-full mr-3"></span>
                Collection Master
              </h2>
              <p class="text-sm text-gray-600 mt-1">Watch movies and shows to build your collection</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Progress</p>
              <p class="text-xl font-bold text-green-600">{{ getCategoryProgress('collection') }}%</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div 
              v-for="badge in badges.collection" 
              :key="badge.id"
              class="relative group"
            >
              <div class="text-center cursor-pointer transform transition-all duration-200 hover:scale-105">
                <div 
                  class="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 transition-all"
                  :class="[
                    badge.earned 
                      ? 'bg-gradient-to-br from-green-100 to-green-200 ring-green-100 group-hover:shadow-xl' 
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 ring-gray-200'
                  ]"
                >
                  <span 
                    class="text-5xl"
                    :class="badge.earned ? '' : 'grayscale opacity-50'"
                  >
                    {{ badge.icon }}
                  </span>
                  <div v-if="!badge.earned" class="absolute inset-0 flex items-center justify-center">
                    <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shadow-md">
                      <span class="text-white text-sm">🔒</span>
                    </div>
                  </div>
                </div>
                <p class="text-sm font-bold text-gray-900 mb-1">{{ badge.name }}</p>
                <p 
                  class="text-xs font-semibold px-2 py-1 rounded-full inline-block"
                  :class="badge.earned ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
                >
                  {{ badge.earned ? 'Earned' : 'Locked' }}
                </p>
                
                <div v-if="badge.progress !== undefined" class="mt-3 px-2">
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-green-500 to-teal-600 h-full rounded-full transition-all duration-300"
                      :style="{ width: `${(badge.progress / badge.target) * 100}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1">{{ badge.progress }} / {{ badge.target }}</p>
                </div>
              </div>

              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div class="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl max-w-xs whitespace-normal">
                  <p class="font-bold mb-1">{{ badge.name }}</p>
                  <p class="text-gray-300">{{ badge.description }}</p>
                  <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Badge data with categories
const badges = ref({
  moodMastery: [
    {
      id: 'mood-happy',
      name: 'Happy Viewer',
      icon: '😊',
      description: 'Watch 10 movies or shows while in a happy mood',
      earned: true,
      progress: 10,
      target: 10
    },
    {
      id: 'mood-sad',
      name: 'Emotional Explorer',
      icon: '😢',
      description: 'Watch 10 movies or shows while feeling sad',
      earned: false,
      progress: 3,
      target: 10
    },
    {
      id: 'mood-excited',
      name: 'Thrill Seeker',
      icon: '😱',
      description: 'Watch 10 thriller or horror movies',
      earned: true,
      progress: 10,
      target: 10
    },
    {
      id: 'mood-chill',
      name: 'Relaxation Master',
      icon: '😌',
      description: 'Watch 15 shows or movies in chill mode',
      earned: false,
      progress: 7,
      target: 15
    },
    {
      id: 'mood-diverse',
      name: 'Mood Maestro',
      icon: '🎭',
      description: 'Watch content in all 5 different moods',
      earned: false,
      progress: 3,
      target: 5
    },
    {
      id: 'mood-romantic',
      name: 'Romantic Soul',
      icon: '💕',
      description: 'Watch 10 romantic movies or shows',
      earned: true,
      progress: 10,
      target: 10
    }
  ],
  watchParty: [
    {
      id: 'party-host-1',
      name: 'Party Starter',
      icon: '🎉',
      description: 'Host your first watch party',
      earned: true,
      progress: 1,
      target: 1
    },
    {
      id: 'party-host-5',
      name: 'Party Organizer',
      icon: '🎊',
      description: 'Host 5 watch parties',
      earned: false,
      progress: 1,
      target: 5
    },
    {
      id: 'party-join-10',
      name: 'Social Watcher',
      icon: '👥',
      description: 'Join 10 different watch parties',
      earned: false,
      progress: 4,
      target: 10
    },
    {
      id: 'party-crowd',
      name: 'Crowd Pleaser',
      icon: '🎪',
      description: 'Host a party with 10+ participants',
      earned: false,
      progress: 0,
      target: 1
    },
    {
      id: 'party-marathon',
      name: 'Marathon Master',
      icon: '🏃',
      description: 'Complete a 4-movie marathon watch party',
      earned: false,
      progress: 0,
      target: 1
    },
    {
      id: 'party-regular',
      name: 'Regular Host',
      icon: '⭐',
      description: 'Host 20 watch parties',
      earned: false,
      progress: 1,
      target: 20
    }
  ],
  collection: [
    {
      id: 'watch-10',
      name: 'Getting Started',
      icon: '🎬',
      description: 'Watch 10 movies or shows',
      earned: true,
      progress: 10,
      target: 10
    },
    {
      id: 'watch-50',
      name: 'Movie Buff',
      icon: '🍿',
      description: 'Watch 50 movies or shows',
      earned: false,
      progress: 25,
      target: 50
    },
    {
      id: 'watch-100',
      name: 'Cinephile',
      icon: '🎥',
      description: 'Watch 100 movies or shows',
      earned: false,
      progress: 25,
      target: 100
    },
    {
      id: 'watch-500',
      name: 'Legendary Viewer',
      icon: '👑',
      description: 'Watch 500 movies or shows',
      earned: false,
      progress: 25,
      target: 500
    },
    {
      id: 'genre-master',
      name: 'Genre Explorer',
      icon: '🗺️',
      description: 'Watch content from 10 different genres',
      earned: false,
      progress: 6,
      target: 10
    },
    {
      id: 'binge-watcher',
      name: 'Binge Champion',
      icon: '📺',
      description: 'Complete an entire TV series',
      earned: true,
      progress: 1,
      target: 1
    }
  ]
})

// Computed properties
const earnedBadges = computed(() => {
  let count = 0
  Object.values(badges.value).forEach(category => {
    count += category.filter(badge => badge.earned).length
  })
  return count
})

const totalBadges = computed(() => {
  let count = 0
  Object.values(badges.value).forEach(category => {
    count += category.length
  })
  return count
})

const completionPercentage = computed(() => {
  if (totalBadges.value === 0) return 0
  return Math.round((earnedBadges.value / totalBadges.value) * 100)
})

const getCategoryProgress = (category: keyof typeof badges.value) => {
  const categoryBadges = badges.value[category]
  const earned = categoryBadges.filter(badge => badge.earned).length
  return Math.round((earned / categoryBadges.length) * 100)
}
</script>

<style scoped>
.grayscale {
  filter: grayscale(100%);
}
</style>
