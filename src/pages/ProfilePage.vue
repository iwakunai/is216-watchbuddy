<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { useUser } from '@clerk/vue';
import { tabs, type TabId } from "@/types/tabs";

import type {
  Profile,
  GenreCount,
  MoodCount,
  FavouriteItem,
  Friend,
  FriendRequest,
  Badge,
  BadgeGroups,
  RatingItem,
  ReviewItem,
  ListFull,
  MovieItem,
  WatchItem,
  HistoryItem,
  ActivityItem,
} from "@/types/profile";

import {
  setUserContext,
  getWatchHistory,
  getUserLists,
  getListItems,
  getFriends,
  getFriendRequests,
  getUserBadges,
  getUserActivity,
  addToWatchHistory,
  updateList,
  deleteList as deleteListDb,
  addItemToList,
  removeItemFromList,
  sendFriendRequest,
  acceptFriendRequest as acceptRequestDb,
  rejectFriendRequest as rejectRequestDb,
  removeFriend as removeFriendDb,
  addActivity,
} from '@/lib/supabaseProfile';

import { getUserWatchlist, removeFromWatchlist as removeFromWatchlistDb, updateWatchlistStatus } from '@/lib/supabaseWatchlist';

const router = useRouter();

// Initialize activeTab from query parameter or default to 'overview'
const tabFromQuery = router.currentRoute.value.query.tab as TabId;
const activeTab = ref<TabId>(
  (tabFromQuery && tabs.some(t => t.id === tabFromQuery)) ? tabFromQuery : 'overview'
)

const setTab = (id: TabId) => { 
  activeTab.value = id;
  // Update URL query parameter without page reload
  router.replace({ query: { tab: id } });
}

// Auth state
const { user, isLoaded } = useUser()
const isLoading = ref(true)
const error = ref<string | null>(null)

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
const totalBadgesEarned = ref(8);

const topGenres = ref<GenreCount[]>([]);

const topMoods = ref<MoodCount[]>([]);

const favourites = ref<FavouriteItem[]>([]);

const friends = ref<Friend[]>([]);

const friendRequests = ref<FriendRequest[]>([]);

const featuredBadges = ref<Badge[]>([
  { id: 'first-watch', name: 'First Watch', description: 'Watched your first movie', icon: '🎬', earned: true },
  { id: 'social-butterfly', name: 'Social Butterfly', description: 'Added 5 friends', icon: '🦋', earned: true },
  { id: 'binge-watcher', name: 'Binge Watcher', description: 'Watched 10 movies in a week', icon: '📺', earned: false },
  { id: 'critic', name: 'Critic', description: 'Wrote 10 reviews', icon: '✍️', earned: true },
  { id: 'party-host', name: 'Party Host', description: 'Hosted a watch party', icon: '🎉', earned: false },
  { id: 'completionist', name: 'Completionist', description: 'Watched 100 movies', icon: '🏆', earned: false },
]);

const badgesByCategory = ref<BadgeGroups>({
  moodMastery: [
    { id: 'mood-happy', name: 'Happy Viewer', description: 'Watch 10 movies while happy', icon: '😊', earned: true },
    { id: 'mood-sad', name: 'Emotional Explorer', description: 'Watch 10 movies while sad', icon: '😢', earned: false },
    { id: 'mood-excited', name: 'Thrill Seeker', description: 'Watch 10 thrillers', icon: '🤩', earned: true },
  ],
  genreExplorer: [
    { id: 'genre-action', name: 'Action Hero', description: 'Watch 20 action movies', icon: '💥', earned: true },
    { id: 'genre-comedy', name: 'Comedy Fan', description: 'Watch 20 comedies', icon: '😂', earned: false },
    { id: 'genre-drama', name: 'Drama Enthusiast', description: 'Watch 20 dramas', icon: '🎭', earned: false },
  ],
  socialButterfly: [
    { id: 'social-friend', name: 'Friendly', description: 'Add 5 friends', icon: '👥', earned: true },
    { id: 'social-party', name: 'Party Animal', description: 'Join 10 watch parties', icon: '🎊', earned: false },
    { id: 'social-host', name: 'Super Host', description: 'Host 5 watch parties', icon: '🌟', earned: false },
  ],
});

// Lists state
const userLists = ref<ListFull[]>([]);
const selectedList = ref<ListFull | null>(null);

function openList(list: ListFull) {
  selectedList.value = list;
}
function closeList() {
  selectedList.value = null;
}

async function updateListSettings<K extends keyof ListFull>(
  key: K,
  value: ListFull[K]
) {
  if (!selectedList.value || !user.value) return;
  
  try {
    const updates: any = {};
    
    // Map ListFull properties to database columns
    if (key === 'public') {
      updates.is_public = value === 'yes';
    } else if (key === 'comments') {
      updates.allow_comments = value === 'yes';
    } else if (key === 'sortBy') {
      updates.sort_by = value;
    } else if (key === 'name') {
      updates.name = value;
    } else if (key === 'description') {
      updates.description = value;
    }
    
    await updateList(selectedList.value.id, updates);
    selectedList.value = { ...selectedList.value, [key]: value };
    
    // Update in list
    const listIndex = userLists.value.findIndex(l => l.id === selectedList.value!.id);
    if (listIndex !== -1) {
      userLists.value[listIndex] = { ...selectedList.value };
    }
  } catch (err) {
    // console.error('Error updating list:', err);
    error.value = 'Failed to update list';
  }
}

async function deleteList(id: string) {
  if (!user.value) return;
  
  try {
    await deleteListDb(id);
    userLists.value = userLists.value.filter((l) => l.id !== id);
    if (selectedList.value?.id === id) selectedList.value = null;
    
    await addActivity({
      user_id: user.value.id,
      activity_type: 'list',
      title: 'Deleted a list',
      icon: '🗑️'
    });
    
    await loadActivity();
  } catch (err) {
    // console.error('Error deleting list:', err);
    error.value = 'Failed to delete list';
  }
}

async function addMovieToList(movie: MovieItem) {
  if (!selectedList.value || !user.value) return;
  
  const exists = selectedList.value.movies?.some((m) => m.id === movie.id);
  if (exists) {
    error.value = 'This item is already in the list';
    setTimeout(() => error.value = null, 3000);
    return;
  }
  
  try {
    // Add to Supabase
    await addItemToList({
      list_id: selectedList.value.id,
      tmdb_id: Number(movie.id),
      title: movie.title,
      media_type: movie.type as 'movie' | 'tv',
      poster_path: movie.poster,
      release_year: movie.year,
      position: selectedList.value.movies?.length || 0
    });
    
    // Update local state
    const movies = [...(selectedList.value.movies ?? []), { ...movie }];
    selectedList.value = { ...selectedList.value, movies };
    
    // Update in list
    const listIndex = userLists.value.findIndex(l => l.id === selectedList.value!.id);
    if (listIndex !== -1) {
      userLists.value[listIndex] = { 
        ...selectedList.value,
        itemCount: movies.length
      };
    }
    
    // Add activity
    await addActivity({
      user_id: user.value.id,
      activity_type: 'list',
      title: `Added "${movie.title}" to list`,
      description: `Added to "${selectedList.value.name}"`,
      icon: '➕'
    });
    
  } catch (err) {
    // console.error('Error adding movie to list:', err);
    error.value = 'Failed to add movie to list';
    setTimeout(() => error.value = null, 3000);
  }
}

async function removeMovieFromList(movieId: string | number) {
  if (!selectedList.value || !user.value) return;
  
  const movie = selectedList.value.movies?.find(m => m.id === movieId);
  if (!movie) return;
  
  try {
    await removeItemFromList(selectedList.value.id, Number(movieId), movie.type as 'movie' | 'tv');
    
    const movies = (selectedList.value.movies ?? []).filter(
      (m) => m.id !== movieId
    );
    selectedList.value = { ...selectedList.value, movies };
    
    // Update in list
    const listIndex = userLists.value.findIndex(l => l.id === selectedList.value!.id);
    if (listIndex !== -1) {
      userLists.value[listIndex] = { ...selectedList.value };
    }
  } catch (err) {
    // console.error('Error removing movie from list:', err);
    error.value = 'Failed to remove movie from list';
  }
}

// Watchlist state
const watchlistItems = ref<WatchItem[]>([]);

async function removeFromWatchlist(id: string | number) {
  if (!user.value) return;
  
  const item = watchlistItems.value.find(i => i.id === id);
  if (!item) return;
  
  try {
    await removeFromWatchlistDb(user.value.id, Number(id), item.type as 'movie' | 'tv');
    watchlistItems.value = watchlistItems.value.filter(i => i.id !== id);
  } catch (err) {
    // console.error('Error removing from watchlist:', err);
    error.value = 'Failed to remove from watchlist';
  }
}

async function changeWatchlistStatus(
  id: string | number, 
  newStatus: 'completed' | 'watching' | 'plan-to-watch',
  mediaType: 'movie' | 'tv'
) {
  if (!user.value) return;
  
  try {
    await updateWatchlistStatus(user.value.id, Number(id), mediaType, newStatus);
    
    // Update the local item's status
    const item = watchlistItems.value.find(i => i.id === id);
    if (item) {
      item.status = newStatus;
    }
  } catch (err) {
    // console.error('Error updating watchlist status:', err);
    error.value = 'Failed to update status';
  }
}

function openWatchlistItem(id: string | number) {
  const item = watchlistItems.value.find(i => i.id === id);
  if (!item) return;
  
  // Navigate to movie or TV detail page
  const path = item.type === 'movie' ? '/movie' : '/tv';
  router.push(`${path}/${id}`);
}

// History state
const historyItems = ref<HistoryItem[]>([]);

function openHistoryItem(id: string | number) {
  // console.log('Open history item:', id);
  // TODO: Navigate to movie/TV detail page
}

// Activity state
const activityItems = ref<ActivityItem[]>([]);

function openActivityItem(id: string | number) {
  // console.log('Open activity item:', id);
  // TODO: Handle activity item click
}

// Friends handlers
async function openFriendProfile(id: string) {
  // console.log('Open friend profile:', id);
  // TODO: Navigate to friend's profile
}

async function removeFriend(id: string) {
  if (!user.value) return;
  
  try {
    await removeFriendDb(user.value.id, id);
    friends.value = friends.value.filter(f => f.id !== id);
  } catch (err) {
    // console.error('Error removing friend:', err);
    error.value = 'Failed to remove friend';
  }
}

async function acceptFriendRequest(id: string) {
  if (!user.value) return;
  
  const request = friendRequests.value.find(r => r.id === id);
  if (!request) return;
  
  try {
    await acceptRequestDb(id);
    
    // Move from requests to friends
    friends.value.push({
      id: request.id,
      name: request.name,
      avatar: request.avatar,
      status: 'offline'
    });
    friendRequests.value = friendRequests.value.filter(r => r.id !== id);
    
    // Add activity
    await addActivity({
      user_id: user.value.id,
      activity_type: 'friend',
      title: `Became friends with ${request.name}`,
      icon: '👥'
    });
    
    // Refresh activity feed
    await loadActivity();
  } catch (err) {
    // console.error('Error accepting friend request:', err);
    error.value = 'Failed to accept friend request';
  }
}

async function rejectFriendRequest(id: string) {
  if (!user.value) return;
  
  try {
    await rejectRequestDb(id);
    friendRequests.value = friendRequests.value.filter(r => r.id !== id);
  } catch (err) {
    // console.error('Error rejecting friend request:', err);
    error.value = 'Failed to reject friend request';
  }
}

function addFriend() {
  // console.log('Add friend clicked');
  // TODO: Open friend search/add modal
}

const showAllBadges = ref(false);

// Load data functions
async function loadProfile() {
  if (!user.value) return;
  
  try {
    // Use Clerk's user data directly
    profile.value = {
      username: user.value.username || user.value.firstName || 'User',
      defaultAvatar: user.value.imageUrl || '/avatar.png',
    };
    
    // Use Clerk's creation date
    joinDate.value = user.value.createdAt 
      ? new Date(user.value.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })
      : 'Recently';
  } catch (err: any) {
    // console.error('Error loading profile:', err);
    error.value = 'Failed to load profile';
  }
}

async function loadWatchlist() {
  if (!user.value) return;
  
  try {
    const data = await getUserWatchlist(user.value.id);
    watchlistItems.value = data.map(item => ({
      id: String(item.tmdb_id),
      title: item.title,
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '',
      year: item.year || 0,
      type: item.media_type,
      status: item.status,
      addedAt: new Date(item.added_at!).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }));
  } catch (err) {
    // console.error('Error loading watchlist:', err);
  }
}

async function loadHistory() {
  if (!user.value) return;
  
  try {
    const data = await getWatchHistory(user.value.id);
    historyItems.value = data.map(item => ({
      id: String(item.tmdb_id),
      title: item.title,
      poster: item.poster_path || '',
      year: item.release_year || 0,
      type: item.media_type,
      watchedAt: new Date(item.watched_at!).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      rating: item.rating
    }));
    
    // Calculate stats from history
    const movies = historyItems.value.filter(h => h.type === 'movie');
    const shows = historyItems.value.filter(h => h.type === 'tv');
    
    totalMoviesWatched.value = movies.length;
    totalShowsWatched.value = shows.length;
    
    const movieRatings = movies.filter(m => m.rating).map(m => m.rating!);
    const showRatings = shows.filter(s => s.rating).map(s => s.rating!);
    
    if (movieRatings.length > 0) {
      averageMovieScore.value = Math.round((movieRatings.reduce((a, b) => a + b, 0) / movieRatings.length) * 20);
    }
    if (showRatings.length > 0) {
      averageTvScore.value = Math.round((showRatings.reduce((a, b) => a + b, 0) / showRatings.length) * 20);
    }
  } catch (err) {
    // console.error('Error loading history:', err);
  }
}

async function loadLists() {
  if (!user.value) return;
  
  try {
    const listsData = await getUserLists(user.value.id);
    userLists.value = await Promise.all(
      listsData.map(async (list) => {
        const items = await getListItems(list.id!);
        return {
          id: list.id!,
          name: list.name,
          description: list.description || '',
          public: list.is_public ? 'yes' : 'no',
          sortBy: list.sort_by,
          itemCount: items.length,
          comments: list.allow_comments ? 'yes' : 'no',
          movies: items.map(item => ({
            id: String(item.tmdb_id),
            title: item.title,
            type: item.media_type,
            year: item.release_year || 0,
            poster: item.poster_path || ''
          }))
        };
      })
    );
  } catch (err) {
    // console.error('Error loading lists:', err);
  }
}

async function loadFriends() {
  if (!user.value) return;
  
  try {
    const friendsData = await getFriends(user.value.id);
    friends.value = friendsData.map((f: any) => ({
      id: f.friend.user_id,
      name: f.friend.username,
      avatar: f.friend.avatar_url || undefined,
      status: 'offline' as const // TODO: Implement real-time status
    }));
  } catch (err) {
    // console.error('Error loading friends:', err);
  }
}

async function loadFriendRequests() {
  if (!user.value) return;
  
  try {
    const requestsData = await getFriendRequests(user.value.id);
    friendRequests.value = requestsData.map((r: any) => ({
      id: r.id,
      name: r.requester.username,
      avatar: r.requester.avatar_url || undefined,
      requestedAt: new Date(r.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }));
  } catch (err) {
    // console.error('Error loading friend requests:', err);
  }
}

async function loadBadges() {
  if (!user.value) return;
  
  try {
    const badgesData = await getUserBadges(user.value.id);
    const earnedBadgeIds = badgesData.map((ub: any) => ub.badge.id);
    totalBadgesEarned.value = earnedBadgeIds.length;
    
    // Update featured badges earned status
    featuredBadges.value = featuredBadges.value.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id)
    }));
    
    // Update badges by category
    badgesByCategory.value = {
      moodMastery: badgesByCategory.value.moodMastery.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.includes(badge.id)
      })),
      genreExplorer: badgesByCategory.value.genreExplorer.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.includes(badge.id)
      })),
      socialButterfly: badgesByCategory.value.socialButterfly.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.includes(badge.id)
      }))
    };
  } catch (err) {
    // console.error('Error loading badges:', err);
  }
}

async function loadActivity() {
  if (!user.value) return;
  
  try {
    const data = await getUserActivity(user.value.id, 20);
    activityItems.value = data.map(act => ({
      id: act.id!,
      type: act.activity_type,
      title: act.title,
      description: act.description || '',
      icon: act.icon || '',
      at: new Date(act.created_at!).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }));
  } catch (err) {
    // console.error('Error loading activity:', err);
  }
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
      loadLists(),
      loadFriends(),
      loadFriendRequests(),
      loadBadges(),
      loadActivity()
    ]);
  } catch (err) {
    // console.error('Error initializing data:', err);
    error.value = 'Failed to load profile data';
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
      <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        </div>
      </div>

      <!-- Profile Content -->
      <template v-else>
        <ProfileSummary
          :profile="profile"
          :join-date="joinDate"
          :average-movie-score="averageMovieScore"
          :average-tv-score="averageTvScore"
          :average-mood-emoji="averageMoodEmoji"
          :total-movies-watched="totalMoviesWatched"
          :total-shows-watched="totalShowsWatched"
          :total-badges-earned="totalBadgesEarned"
        />

        <NavTabs :tabs="tabs" :active-tab="activeTab" @change="setTab" />

        <div v-if="activeTab === 'overview'" class="space-y-5">
          <OverviewPanel
            :top-genres="topGenres"
            :top-moods="topMoods"
            :favourites="favourites"
            :friends="friends"
            :featured-badges="featuredBadges"
            :badges-by-category="badgesByCategory"
            v-model:show-all-badges="showAllBadges"
          />
        </div>

        <div v-else-if="activeTab === 'lists'">
          <ListsPanel
            :user-lists="userLists"
            :selected-list="selectedList"
            @open="openList"
            @close="closeList"
            @update-setting="updateListSettings"
            @delete-list="deleteList"
            @add-movie="addMovieToList"
            @remove-movie="removeMovieFromList"
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

        <div v-else-if="activeTab === 'friends'">
          <FriendsPanel
            :friends="friends"
            :friend-requests="friendRequests"
            @open-profile="openFriendProfile"
            @remove-friend="removeFriend"
            @accept-request="acceptFriendRequest"
            @reject-request="rejectFriendRequest"
            @add-friend="addFriend"
          />
        </div>

        <div v-else-if="activeTab === 'history'">
          <WatchHistory
            :items="historyItems"
            @open="openHistoryItem"
          />
        </div>

        <div v-else-if="activeTab === 'activity'">
          <ActivityPanel
            :items="activityItems"
            @open="openActivityItem"
          />
        </div>
      </template>
    </div>
  </div>
</template>
