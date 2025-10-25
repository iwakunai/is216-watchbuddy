<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
    <BaseNavBar />
    
    <!-- Profile Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Title and Edit Button -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-900">Profile</h1>
          <p class="text-gray-600 mt-1">View your stats, achievements, and activity</p>
        </div>
        <RouterLink 
          to="/profile/edit" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Edit Profile
        </RouterLink>
      </div>

      <!-- Profile Summary Card -->
      <div class="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <!-- Profile Picture -->
          <div class="flex-shrink-0">
            <div class="relative">
              <img 
                :src="profile.avatarDataUrl || defaultAvatar" 
                alt="Profile Picture" 
                class="w-32 h-32 rounded-2xl object-cover bg-gray-300 shadow-lg ring-4 ring-blue-100" 
              />
              <div class="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-md"></div>
            </div>
          </div>

          <!-- Username and Stats -->
          <div class="flex-1 w-full">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ profile.username || 'Username' }}</h2>
            <p class="text-gray-600 mb-8">Member since {{ joinDate }}</p>
            
            <!-- Average Stats (Circles) - Top Row -->
            <div class="mb-8">
              <h3 class="text-sm font-semibold text-gray-600 mb-4">Your Average Scores</h3>
              <div class="flex flex-col sm:flex-row justify-start sm:justify-start gap-8">
                <!-- Average Movie Score -->
                <div class="text-center">
                  <div class="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md ring-4 ring-green-50">
                    <span class="text-green-700 font-bold text-3xl">{{ averageMovieScore }}%</span>
                  </div>
                  <p class="text-sm font-medium text-gray-700">Avg Movie Score</p>
                </div>

                <!-- Average TV Score -->
                <div class="text-center">
                  <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md ring-4 ring-blue-50">
                    <span class="text-blue-700 font-bold text-3xl">{{ averageTvScore }}%</span>
                  </div>
                  <p class="text-sm font-medium text-gray-700">Avg TV Score</p>
                </div>

                <!-- Average Mood -->
                <div class="text-center">
                  <div class="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md ring-4 ring-yellow-50">
                    <span class="text-4xl">{{ averageMoodEmoji }}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-700">Avg Mood</p>
                </div>
              </div>
            </div>

            <!-- Quick Stats Grid - Bottom Row -->
            <div>
              <h3 class="text-sm font-semibold text-gray-600 mb-4">Your Activity</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <!-- Movies Watched -->
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <p class="text-2xl font-bold text-blue-600">{{ totalMoviesWatched }}</p>
                  <p class="text-xs text-blue-700 font-medium">Movies Watched</p>
                </div>
                <!-- Shows Watched -->
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <p class="text-2xl font-bold text-purple-600">{{ totalShowsWatched }}</p>
                  <p class="text-xs text-purple-700 font-medium">Shows Watched</p>
                </div>
                <!-- Badges Earned -->
                <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                  <p class="text-2xl font-bold text-amber-600">{{ totalBadgesEarned }}</p>
                  <p class="text-xs text-amber-700 font-medium">Badges Earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 mb-8 bg-white rounded-t-lg shadow-sm overflow-x-auto">
        <nav class="flex space-x-1 px-6 -mb-px">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-4 border-b-2 font-semibold text-sm transition-all duration-200 whitespace-nowrap',
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- Top Row: Genres and Moods -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Most Watched Genres -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
              Most Watched Genres
            </h3>
            <div v-if="topGenres.length === 0" class="text-gray-500 text-center py-8">
              No genre data yet. Start watching to see your favorite genres!
            </div>
            <div v-else class="space-y-3">
              <div v-for="(genre, idx) in topGenres" :key="idx" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-700">{{ genre.name }}</span>
                <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{{ genre.count }}</span>
              </div>
            </div>
          </div>

          <!-- Most Watched Moods -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span class="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
              Most Watched Moods
            </h3>
            <div v-if="topMoods.length === 0" class="text-gray-500 text-center py-8">
              No mood data yet. Start rating content to see your mood preferences!
            </div>
            <div v-else class="space-y-3">
              <div v-for="(mood, idx) in topMoods" :key="idx" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-700">{{ mood.emoji }} {{ mood.name }}</span>
                <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">{{ mood.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Favourites, Friends, and Badges -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Favourites -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span class="w-1 h-6 bg-red-600 rounded-full mr-3"></span>
              Favourites
            </h3>
            <div v-if="favourites.length === 0" class="text-gray-500 text-center py-8">
              No favourites yet. Mark your favorite movies and shows!
            </div>
            <div v-else class="space-y-4">
              <div v-for="(fav, idx) in favourites" :key="idx" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div class="w-12 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-md flex-shrink-0 shadow-sm"></div>
                <div>
                  <p class="font-semibold text-gray-900">{{ fav.title }}</p>
                  <p class="text-xs text-gray-500">{{ fav.year }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Friends -->
          <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold text-gray-900 flex items-center">
                <span class="w-1 h-6 bg-green-600 rounded-full mr-3"></span>
                Friends
              </h3>
              <span v-if="friends.length > 0" class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{{ friends.length }} friends</span>
            </div>
            <div v-if="friends.length === 0" class="text-gray-500 text-center py-8">
              No friends yet. Add friends to see them here!
            </div>
            <div v-else>
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
                <div v-for="friend in friends" :key="friend.id" class="text-center group cursor-pointer">
                  <div class="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-2 shadow-md group-hover:shadow-lg transition-shadow"></div>
                  <p class="text-xs text-gray-600 font-medium">{{ friend.name }}</p>
                </div>
              </div>
              <button class="w-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 font-semibold py-2 px-4 rounded-lg transition-all border border-green-200">
                + Add Friends
              </button>
            </div>
          </div>
        </div>

        <!-- Badges Section -->
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-900 flex items-center">
              <span class="w-1 h-6 bg-amber-600 rounded-full mr-3"></span>
              Badges & Achievements
            </h3>
            <div class="flex items-center space-x-3">
              <RouterLink 
                to="/achievements"
                class="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors px-3 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg"
              >
                View All Achievements
              </RouterLink>
              <button 
                @click="showAllBadges = !showAllBadges"
                class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {{ showAllBadges ? 'Hide All' : 'Show All Badges' }}
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            Earn badges by completing watch parties, challenges, and milestones. Hover over badges to see how to earn them!
          </p>

          <!-- Featured Badges (First 6) -->
          <div v-if="!showAllBadges" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="badge in featuredBadges" :key="badge.id" class="text-center relative group cursor-pointer">
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
              <p class="text-xs text-gray-500 mt-1">{{ badge.earned ? 'Earned' : 'Locked' }}</p>
              
              <!-- Enhanced Tooltip -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div class="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl max-w-xs whitespace-normal">
                  <p class="font-bold mb-1">{{ badge.name }}</p>
                  <p class="text-gray-300">{{ badge.description }}</p>
                  <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- All Badges Organized by Category -->
          <div v-if="showAllBadges" class="space-y-8">
            <!-- Mood Mastery Badges -->
            <div>
              <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center">
                <span class="w-1 h-4 bg-blue-600 rounded-full mr-2"></span>
                Mood Mastery
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="badge in badgesByCategory.moodMastery" :key="badge.id" class="text-center relative group cursor-pointer">
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
                  <p class="text-xs text-gray-500 mt-1">{{ badge.earned ? 'Earned' : 'Locked' }}</p>
                  
                  <!-- Enhanced Tooltip -->
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

            <!-- Genre Explorer Badges -->
            <div>
              <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center">
                <span class="w-1 h-4 bg-green-600 rounded-full mr-2"></span>
                Genre Explorer
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="badge in badgesByCategory.genreExplorer" :key="badge.id" class="text-center relative group cursor-pointer">
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
                  <p class="text-xs text-gray-500 mt-1">{{ badge.earned ? 'Earned' : 'Locked' }}</p>
                  
                  <!-- Enhanced Tooltip -->
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

            <!-- Social Butterfly Badges -->
            <div>
              <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center">
                <span class="w-1 h-4 bg-purple-600 rounded-full mr-2"></span>
                Social Butterfly
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="badge in badgesByCategory.socialButterfly" :key="badge.id" class="text-center relative group cursor-pointer">
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
                  <p class="text-xs text-gray-500 mt-1">{{ badge.earned ? 'Earned' : 'Locked' }}</p>
                  
                  <!-- Enhanced Tooltip -->
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
      </div>

      <!-- My Ratings Tab -->
      <div v-if="activeTab === 'ratings'" class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">My Ratings</h3>
        <div v-if="userRatings.length === 0" class="text-gray-600 text-center py-12">
          You haven't rated any content yet. Start watching and rating!
        </div>
        <div v-else class="space-y-3">
          <div v-for="rating in userRatings" :key="rating.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-md shadow-sm"></div>
              <div>
                <p class="font-semibold text-gray-900">{{ rating.title }}</p>
                <p class="text-xs text-gray-500">{{ rating.type }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-lg">{{ '⭐'.repeat(rating.rating) }}</span>
              <span class="text-sm font-medium text-gray-600">{{ rating.rating }}/5</span>
            </div>
          </div>
        </div>
      </div>

      <!-- My Watchlists Tab -->
      <div v-if="activeTab === 'watchlists'" class="space-y-6">
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">My Watchlists</h3>
              <p class="text-gray-600 text-sm mt-1">Create and manage your custom watchlists</p>
            </div>
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              @click="isCreateListOpen = true"
            >
              + Create Watchlist
            </button>
          </div>

          <!-- Watchlists Display -->
          <div v-if="userWatchlists.length === 0" class="text-gray-600 text-center py-12">
            You haven't created any watchlists yet. Start by creating your first watchlist!
          </div>
           <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div v-for="watchlist in userWatchlists" :key="watchlist.id" class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-shadow cursor-pointer">
               <h4 class="font-bold text-gray-900 mb-1">{{ watchlist.name }}</h4>
               <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ watchlist.description }}</p>
               <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">{{ watchlist.itemCount || 0 }} items</span>
             </div>
           </div>
        </div>

        <!-- Create Watchlist Modal -->
        <div
          v-if="isCreateListOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          @click.self="isCreateListOpen = false"
        >
          <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h4 class="text-lg font-bold text-gray-900">Create New Watchlist</h4>
              <button class="text-gray-500 hover:text-gray-700 text-2xl" @click="isCreateListOpen = false">✕</button>
            </div>
            <div class="p-6 space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Watchlist Name</label>
                <input 
                  v-model="createListForm.name" 
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  placeholder="e.g., Must Watch Sci-Fi" 
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  v-model="createListForm.description" 
                  rows="3" 
                  class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                  placeholder="Describe your watchlist..."
                ></textarea>
              </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors" 
                @click="isCreateListOpen = false"
              >
                Cancel
              </button>
              <button 
                class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md" 
                @click="submitCreateWatchlist()"
              >
                Create Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Watch History Tab -->
      <div v-if="activeTab === 'history'" class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Watch History</h3>
        <div v-if="watchHistory.length === 0" class="text-gray-600 text-center py-12">
          Your watch history is empty. Start watching to see your history here!
        </div>
        <div v-else class="space-y-3">
          <div v-for="item in watchHistory" :key="item.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-md shadow-sm"></div>
              <div>
                <p class="font-semibold text-gray-900">{{ item.title }}</p>
                <p class="text-xs text-gray-500">Watched {{ item.watchedDate }}</p>
              </div>
            </div>
            <span class="text-sm font-medium text-gray-600">{{ item.type }}</span>
          </div>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-if="activeTab === 'activity'" class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div v-if="recentActivity.length === 0" class="text-gray-600 text-center py-12">
          No activity yet. Start watching, rating, and earning badges!
        </div>
        <div v-else class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="text-2xl flex-shrink-0">{{ activity.icon }}</div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ activity.action }}</p>
              <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import BaseNavBar from '@/components/BaseNavBar.vue'
import BaseFooter from '@/components/BaseFooter.vue'

const profile = ref({
  username: '',
  avatarDataUrl: '',
  joinDate: ''
})

const defaultAvatar = 'https://via.placeholder.com/128?text=Avatar'

const activeTab = ref('overview')
const isCreateListOpen = ref(false)
const showAllBadges = ref(false)

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'ratings', name: 'My Ratings' },
  { id: 'watchlists', name: 'My Watchlists' },
  { id: 'history', name: 'Watch History' },
  { id: 'activity', name: 'Activity' }
]

const createListForm = ref({
  name: '',
  description: ''
})

const userWatchlists = ref<any[]>([])

// Stats - Empty by default
const averageMovieScore = ref(0)
const averageTvScore = ref(0)
const averageMoodEmoji = ref('😐')
const totalMoviesWatched = ref(0)
const totalShowsWatched = ref(0)
const totalBadgesEarned = ref(0)
const joinDate = ref('')

// Empty arrays - no dummy data
const topGenres = ref<any[]>([])
const topMoods = ref<any[]>([])
const favourites = ref<any[]>([])
const friends = ref<any[]>([])
const userRatings = ref<any[]>([])
const watchHistory = ref<any[]>([])
const recentActivity = ref<any[]>([])

// Badge System
const allBadges = ref([
  // Mood Mastery Badges
  {
    id: 'mood-explorer-bronze',
    name: 'Mood Explorer',
    category: 'moodMastery',
    tier: 'Bronze',
    icon: '🎭',
    description: 'Log 10 unique mood-based discovery sessions',
    earned: false
  },
  {
    id: 'emotional-spectrum',
    name: 'Emotional Spectrum',
    category: 'moodMastery',
    tier: 'Platinum',
    icon: '🌈',
    description: 'Successfully rate content across all 8 core moods',
    earned: false
  },
  {
    id: 'mood-alchemist',
    name: 'The Mood Alchemist',
    category: 'moodMastery',
    tier: 'Bronze',
    icon: '⚗️',
    description: 'Watch 5 movies/shows recommended by opposite mood',
    earned: false
  },
  {
    id: 'mood-explorer-silver',
    name: 'Mood Explorer Silver',
    category: 'moodMastery',
    tier: 'Silver',
    icon: '🎭',
    description: 'Log 50 unique mood-based discovery sessions',
    earned: false
  },
  {
    id: 'mood-explorer-gold',
    name: 'Mood Explorer Gold',
    category: 'moodMastery',
    tier: 'Gold',
    icon: '🎭',
    description: 'Log 250 unique mood-based discovery sessions',
    earned: false
  },
  {
    id: 'mood-master',
    name: 'Mood Master',
    category: 'moodMastery',
    tier: 'Platinum',
    icon: '👑',
    description: 'Achieve Mood Explorer Gold and Emotional Spectrum',
    earned: false
  },

  // Genre Explorer Badges
  {
    id: 'genre-novice',
    name: 'Genre Novice',
    category: 'genreExplorer',
    tier: 'Bronze',
    icon: '📚',
    description: 'Watch content from 5 different genres',
    earned: false
  },
  {
    id: 'genre-aficionado',
    name: 'Genre Aficionado',
    category: 'genreExplorer',
    tier: 'Silver',
    icon: '📚',
    description: 'Watch content from 15 different genres',
    earned: false
  },
  {
    id: 'the-polymath',
    name: 'The Polymath',
    category: 'genreExplorer',
    tier: 'Gold',
    icon: '🧠',
    description: 'Watch content from all available genres (25+)',
    earned: false
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    category: 'genreExplorer',
    tier: 'Bronze',
    icon: '🏊',
    description: 'Watch 5 consecutive movies in a single genre',
    earned: false
  },
  {
    id: 'western-fan',
    name: 'Western Fan',
    category: 'genreExplorer',
    tier: 'Silver',
    icon: '🤠',
    description: 'Complete a Western film marathon',
    earned: false
  },
  {
    id: 'horror-enthusiast',
    name: 'Horror Enthusiast',
    category: 'genreExplorer',
    tier: 'Silver',
    icon: '👻',
    description: 'Watch 10 horror movies',
    earned: false
  },

  // Social Butterfly Badges
  {
    id: 'first-friend',
    name: 'First Friend',
    category: 'socialButterfly',
    tier: 'Bronze',
    icon: '👥',
    description: 'Add your first friend',
    earned: false
  },
  {
    id: 'socialite',
    name: 'Socialite',
    category: 'socialButterfly',
    tier: 'Silver',
    icon: '🎉',
    description: 'Add 10 friends',
    earned: false
  },
  {
    id: 'watch-party-host',
    name: 'Watch Party Host',
    category: 'socialButterfly',
    tier: 'Bronze',
    icon: '🎬',
    description: 'Host 3 Watch Parties',
    earned: false
  },
  {
    id: 'watch-party-regular',
    name: 'Watch Party Regular',
    category: 'socialButterfly',
    tier: 'Gold',
    icon: '🍿',
    description: 'Attend 20 Watch Parties',
    earned: false
  },
  {
    id: 'the-critic',
    name: 'The Critic',
    category: 'socialButterfly',
    tier: 'Bronze',
    icon: '✍️',
    description: 'Write 10 reviews (50+ words) with 5 helpful votes',
    earned: false
  },
  {
    id: 'influencer',
    name: 'Influencer',
    category: 'socialButterfly',
    tier: 'Gold',
    icon: '⭐',
    description: 'Get 100 helpful votes on your reviews',
    earned: false
  }
])

const badgesByCategory = computed(() => ({
  moodMastery: allBadges.value.filter(b => b.category === 'moodMastery'),
  genreExplorer: allBadges.value.filter(b => b.category === 'genreExplorer'),
  socialButterfly: allBadges.value.filter(b => b.category === 'socialButterfly')
}))

const featuredBadges = computed(() => allBadges.value.slice(0, 6))

const submitCreateWatchlist = () => {
  if (!createListForm.value.name.trim()) {
    alert('Please enter a watchlist name')
    return
  }

  const newWatchlist = {
    id: Date.now(),
    name: createListForm.value.name,
    description: createListForm.value.description,
    itemCount: 0,
    createdAt: new Date().toISOString()
  }

  userWatchlists.value.push(newWatchlist)

  createListForm.value = {
    name: '',
    description: ''
  }
  isCreateListOpen.value = false
}

onMounted(() => {
  // Load profile data from localStorage or API
  const saved = localStorage.getItem('wb_profile')
  if (saved) {
    const parsed = JSON.parse(saved)
    profile.value = { ...profile.value, ...parsed }
  }

  // Load user watchlists from localStorage
  const savedWatchlists = localStorage.getItem('wb_watchlists')
  if (savedWatchlists) {
    userWatchlists.value = JSON.parse(savedWatchlists)
  }

  // Load earned badges from localStorage
  const savedBadges = localStorage.getItem('wb_earned_badges')
  if (savedBadges) {
    const earnedBadgeIds = JSON.parse(savedBadges)
    allBadges.value.forEach(badge => {
      if (earnedBadgeIds.includes(badge.id)) {
        badge.earned = true
      }
    })
    totalBadgesEarned.value = earnedBadgeIds.length
  }
})

// Watch for changes to userWatchlists and save to localStorage
watch(userWatchlists, (newWatchlists) => {
  localStorage.setItem('wb_watchlists', JSON.stringify(newWatchlists))
}, { deep: true })

// Watch for changes to earned badges
watch(allBadges, (newBadges) => {
  const earnedBadgeIds = newBadges.filter(b => b.earned).map(b => b.id)
  localStorage.setItem('wb_earned_badges', JSON.stringify(earnedBadgeIds))
  totalBadgesEarned.value = earnedBadgeIds.length
}, { deep: true })
</script>

<style scoped>
</style>

