<script setup lang="ts">
import type {
  GenreCount,
  MoodCount,
  FavouriteItem,
  Friend,
  Badge,
  BadgeGroups,
} from "@/types/profile";

const props = defineProps<{
  topGenres: GenreCount[];
  topMoods: MoodCount[];
  favourites: FavouriteItem[];
  friends: Friend[];
  featuredBadges: Badge[];
  badgesByCategory: BadgeGroups;
  showAllBadges: boolean;
}>();
const emit = defineEmits<{ (e: "update:showAllBadges", v: boolean): void }>();
</script>

<template>
  <div class="space-y-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
      >
        <h3
          class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"
        >
          <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span> Most
          Watched Genres
        </h3>
        <div
          v-if="topGenres.length === 0"
          class="text-gray-500 dark:text-gray-400 text-center py-6 text-sm"
        >
          No genre data yet. Start watching to see your favorite genres!
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(genre, idx) in topGenres"
            :key="idx"
            class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="font-medium text-gray-700 text-sm">{{
              genre.name
            }}</span>
            <span
              class="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold"
              >{{ genre.count }}</span
            >
          </div>
        </div>
      </div>

      <div
        class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
      >
        <h3
          class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"
        >
          <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span> Most
          Watched Moods
        </h3>
        <div
          v-if="topMoods.length === 0"
          class="text-gray-500 dark:text-gray-400 text-center py-6 text-sm"
        >
          No mood data yet. Start rating content to see your mood preferences!
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(mood, idx) in topMoods"
            :key="idx"
            class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="font-medium text-gray-700 text-sm"
              >{{ mood.emoji }} {{ mood.name }}</span
            >
            <span
              class="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold"
              >{{ mood.count }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div
        class="bg-white/5 dark:bg-gray-900/30 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
      >
        <h3
          class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"
        >
          <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span> Favourites
        </h3>
        <div
          v-if="favourites.length === 0"
          class="text-gray-500 dark:text-gray-400 text-center py-6 text-sm"
        >
          No favourites yet. Mark your favorite movies and shows!
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="(fav, idx) in favourites"
            :key="idx"
            class="flex items-center space-x-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div class="w-10 h-14 bg-gray-200 rounded flex-shrink-0"></div>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {{ fav.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ fav.year }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <FriendsGrid class="lg:col-span-2" :friends="friends" />
    </div>

    <BadgeGrid
      :featured-badges="featuredBadges"
      :badges-by-category="badgesByCategory"
      :show-all-badges="showAllBadges"
      @update:showAllBadges="emit('update:showAllBadges', $event)"
    />
  </div>
</template>
