<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "@clerk/vue";
import { tabs, type TabId } from "@/types/tabs";

import type {
  Profile,
  GenreCount,
  MoodCount,
  FavouriteItem,
  // HistoryItem,
} from "@/types/profile";

import { setUserContext } from "@/lib/supabaseProfile";

import {
  getUserWatchlist,
  removeFromWatchlist as removeFromWatchlistDb,
  updateWatchlistStatus,
} from "@/lib/supabaseWatchlist";

import {
  getUserMovieReviews,
  getUserTvReviews,
} from "@/lib/supabaseRatingsReviews";
import { fetchSupabaseUserId } from "@/lib/supabaseUser";
import type { MovieItem, WatchItem } from "@/composables/watchlist";

const router = useRouter();

// Initialize activeTab from query parameter or default to 'overview'
const tabFromQuery = router.currentRoute.value.query.tab as TabId;
const activeTab = ref<TabId>(
  tabFromQuery && tabs.some((t) => t.id === tabFromQuery)
    ? tabFromQuery
    : "overview"
);

const setTab = (id: TabId) => {
  activeTab.value = id;
  // Update URL query parameter without page reload
  router.replace({ query: { tab: id } });
};

// Auth state
const { user, isLoaded } = useUser();
const isLoading = ref(true);
const error = ref<string | null>(null);

const profile = ref<Profile>({
  username: "MovieLover123",
  defaultAvatar: "/avatar.png",
});
const joinDate = ref("Jan 2025");

const averageMovieScore = ref(85);
const averageTvScore = ref(78);
const averageMoodEmoji = ref("😊");

const totalMoviesWatched = ref(42);
const totalShowsWatched = ref(18);

const topGenres = ref<GenreCount[]>([]);

const topMoods = ref<MoodCount[]>([]);

const favourites = ref<FavouriteItem[]>([]);

// Watchlist state
const watchlistItems = ref<WatchItem[]>([]);

async function removeFromWatchlist(id: string) {
  if (!user.value) return;

  const item = watchlistItems.value.find((i) => i.id === id);
  if (!item) return;

  try {
    await removeFromWatchlistDb(user.value.id, id, item.type as "movie" | "tv");
    watchlistItems.value = watchlistItems.value.filter((i) => i.id !== id);
  } catch (err) {
    error.value = "Failed to remove from watchlist";
  }
}

async function changeWatchlistStatus(
  id: string,
  newStatus: "completed" | "watching" | "plan-to-watch",
  mediaType: "movie" | "tv"
) {
  if (!user.value) return;

  try {
    await updateWatchlistStatus(user.value.id, id, mediaType, newStatus);

    // Update the local item's status
    const item = watchlistItems.value.find((i) => i.id === id);
    if (item) {
      item.status = newStatus;
    }
  } catch (err) {
    error.value = "Failed to update status";
  }
}

function openWatchlistItem(id: string) {
  const item = watchlistItems.value.find((i) => i.id === id);
  if (!item) return;

  // Navigate to movie or TV detail page
  const path = item.type === "movie" ? "/movie" : "/tv";
  router.push(`${path}/${id}`);
}

// Load data functions
async function loadProfile() {
  if (!user.value) return;

  try {
    // Use Clerk's user data directly
    profile.value = {
      username: user.value.username || user.value.firstName || "User",
      defaultAvatar: user.value.imageUrl || "/avatar.png",
    };

    // Use Clerk's creation date
    joinDate.value = user.value.createdAt
      ? new Date(user.value.createdAt).toLocaleDateString("en-SG", {
          month: "short",
          year: "numeric",
        })
      : "Recently";
  } catch (err: any) {
    error.value = "Failed to load profile";
  }
}

async function loadWatchlist() {
  if (!user.value) return;

  try {
    const data = await getUserWatchlist(user.value.id);
    watchlistItems.value = data.map((item) => ({
      id: String(item.tmdb_id),
      title: item.title,
      poster: item.poster_path
        ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
        : "",
      year: item.year || 0,
      type: item.media_type,
      status: item.status,
      addedAt: new Date(item.added_at!).toLocaleDateString("en-SG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  } catch (err) {}
}

const watchpartyHistory = ref<any[]>([]);

import { fetchWatchpartyHistory } from "@/lib/supabaseProfile";

async function loadHistory() {
  if (!user.value) return;
  
  try {
    const data = await fetchWatchpartyHistory();
    watchpartyHistory.value = (data as any[]).map(item => ({
      id: item.id,
      roomName: item.party_rooms?.room_name ?? '',
      title: item.party_rooms?.title ?? '',
      poster: item.party_rooms?.poster_url ?? '',
      scheduledTime: item.party_rooms?.scheduled_time
        ? new Date(item.party_rooms.scheduled_time).toLocaleString('en-SG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        : '',
      lastJoinedAt: new Date(item.last_joined_at).toLocaleString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      duration: item.party_rooms?.duration ?? '',
    }));
  } catch (err) {
    // handle error (show toast, etc)
  }
}

async function loadRatingsAndCalculateAverages() {
  if (!user.value) return;

  try {
    // Fetch Supabase user ID
    const supabaseUserId = await fetchSupabaseUserId(user.value.id);
    if (!supabaseUserId) return;

    // Fetch movie and TV reviews
    const [movieReviews, tvReviews] = await Promise.all([
      getUserMovieReviews(supabaseUserId),
      getUserTvReviews(supabaseUserId),
    ]);

    // Calculate average movie score (convert 5-star to percentage)
    const movieRatings = movieReviews.map((r) => r.rating).filter((r) => r > 0);

    if (movieRatings.length > 0) {
      const avgMovieRating =
        movieRatings.reduce((a, b) => a + b, 0) / movieRatings.length;
      averageMovieScore.value = Math.round((avgMovieRating / 5) * 100);
    } else {
      averageMovieScore.value = 0;
    }

    // Calculate average TV score (convert 5-star to percentage)
    const tvRatings = tvReviews.map((r) => r.rating).filter((r) => r > 0);

    if (tvRatings.length > 0) {
      const avgTvRating =
        tvRatings.reduce((a, b) => a + b, 0) / tvRatings.length;
      averageTvScore.value = Math.round((avgTvRating / 5) * 100);
    } else {
      averageTvScore.value = 0;
    }

    // Calculate average mood emoji based on overall ratings
    const allRatings = [...movieRatings, ...tvRatings];
    if (allRatings.length > 0) {
      const avgRating =
        allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
      // Map average rating to emoji
      if (avgRating >= 4.5) averageMoodEmoji.value = "😍";
      else if (avgRating >= 4) averageMoodEmoji.value = "😊";
      else if (avgRating >= 3.5) averageMoodEmoji.value = "🙂";
      else if (avgRating >= 3) averageMoodEmoji.value = "😐";
      else if (avgRating >= 2) averageMoodEmoji.value = "😕";
      else averageMoodEmoji.value = "😞";
    } else {
      averageMoodEmoji.value = "😊";
    }
  } catch (err) {}
}

// Initialize data on mount
onMounted(async () => {
  if (!isLoaded.value || !user.value) {
    // Wait for user to load
    watch([isLoaded, user], async ([loaded, currentUser]) => {
      if (loaded && currentUser) {
        await initializeData();
      }
    });
  } else {
    await initializeData();
  }
});

async function initializeData() {
  if (!user.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    // Set user context for RLS
    await setUserContext(user.value.id);

    // Load all data in parallel
    await Promise.all([
      loadProfile(),
      loadWatchlist(),
      loadHistory(),
      loadRatingsAndCalculateAverages(),
    ]);
  } catch (err) {
    error.value = "Failed to load profile data";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <BaseNavBar />
  <div
    class="min-h-screen bg-white/5 dark:bg-gray-900/30 text-gray-900 dark:text-gray-100"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center min-h-[60vh]"
      >
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"
          ></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        </div>
      </div>

      <!-- Profile Content -->
      <template v-else>
        <ProfileSummary
          :profile="profile"
          :join-date="joinDate"
          :total-movies-watched="totalMoviesWatched"
          :total-shows-watched="totalShowsWatched"
        />

        <NavTabs :tabs="tabs" :active-tab="activeTab" @change="setTab" />

        <div v-if="activeTab === 'overview'" class="space-y-5">
          <OverviewPanel
            :top-genres="topGenres"
            :top-moods="topMoods"
            :favourites="favourites"
          />
        </div>

        <div v-else-if="activeTab === 'ratings'">
          <RatingsPanel />
        </div>

        <div v-else-if="activeTab === 'watchlist'">
          <WatchList
            :items="watchlistItems"
            @remove="removeFromWatchlist"
            @open="openWatchlistItem"
            @change-status="changeWatchlistStatus"
          />
        </div>

        <div v-else-if="activeTab === 'history'">
          <WatchHistory
            :items="watchpartyHistory"
          />
        </div>
      </template>
    </div>
  </div>
</template>
