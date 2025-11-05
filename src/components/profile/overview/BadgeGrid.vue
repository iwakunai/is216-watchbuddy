<!-- src/components/profile/overview/BadgeGrid.vue -->
<script setup lang="ts">
import type { Badge, BadgeGroups } from '@/types/profile'

const props = defineProps<{
  featuredBadges: Badge[]
  badgesByCategory: BadgeGroups
  showAllBadges: boolean
}>()

const emit = defineEmits<{ (e:'update:showAllBadges', v:boolean): void }>()
</script>

<template>
  <div class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center">
        <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
        Badges & Achievements
      </h3>
      <div class="flex items-center space-x-3">
        <RouterLink
          to="/achievements"
          class="text-xs font-medium text-gray-700 hover:text-gray-900 dark:text-gray-100 transition-colors px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          View All
        </RouterLink>
        <button
          @click="emit('update:showAllBadges', !props.showAllBadges)"
          class="text-xs font-medium text-gray-700 hover:text-gray-900 dark:text-gray-100 transition-colors"
        >
          {{ props.showAllBadges ? 'Show Less' : 'Show All' }}
        </button>
      </div>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
      Earn badges by completing watch parties, challenges, and milestones.
    </p>

    <div v-if="!props.showAllBadges" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3">
      <div v-for="badge in props.featuredBadges" :key="badge.id" class="text-center relative group cursor-pointer">
        <div
          class="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-all ring-4"
          :class="[
            badge.earned
              ? 'bg-gradient-to-br from-amber-100 to-amber-200 ring-amber-50 group-hover:scale-110'
              : 'bg-gradient-to-br from-gray-300 to-gray-400 ring-gray-300 opacity-50'
          ]"
        >
          <span :class="badge.earned ? 'text-4xl' : 'text-4xl grayscale'">{{ badge.icon }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-700">{{ badge.name }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ badge.earned ? 'Earned' : 'Locked' }}</p>

        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div class="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl max-w-xs whitespace-normal">
            <p class="font-bold mb-1">{{ badge.name }}</p>
            <p class="text-gray-300">{{ badge.description }}</p>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-8">
      <div>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <span class="w-1 h-4 bg-blue-600 rounded-full mr-2"></span>
          Mood Mastery
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <BadgeCard v-for="badge in props.badgesByCategory.moodMastery" :key="badge.id" :badge="badge" />
        </div>
      </div>

      <div>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <span class="w-1 h-4 bg-green-600 rounded-full mr-2"></span>
          Genre Explorer
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <BadgeCard v-for="badge in props.badgesByCategory.genreExplorer" :key="badge.id" :badge="badge" />
        </div>
      </div>

      <div>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <span class="w-1 h-4 bg-purple-600 rounded-full mr-2"></span>
          Social Butterfly
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <BadgeCard v-for="badge in props.badgesByCategory.socialButterfly" :key="badge.id" :badge="badge" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {}
</script>


