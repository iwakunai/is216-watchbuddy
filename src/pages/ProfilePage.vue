<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <BaseNavBar />
    
    <!-- Profile Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Title and Edit Button -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
          <p class="text-gray-500 mt-1 text-sm">Manage your watchlist, ratings, and preferences</p>
        </div>
        <RouterLink 
          to="/profile/edit" 
          class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
        >
          Edit Profile
        </RouterLink>
      </div>

      <!-- Profile Summary Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <!-- Profile Picture -->
          <div class="flex-shrink-0">
            <div class="relative">
              <img 
                :src="profile.avatarDataUrl || defaultAvatar" 
                alt="Profile Picture" 
                class="w-24 h-24 rounded-full object-cover bg-gray-200 border-2 border-gray-200" 
              />
              <div class="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
          </div>

          <!-- Username and Stats -->
          <div class="flex-1 w-full">
            <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ profile.username || 'Username' }}</h2>
            <p class="text-gray-500 mb-6 text-sm">Member since {{ joinDate }}</p>
            
            <!-- Average Stats (Circles) - Top Row -->
            <div class="mb-6">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Average Scores</h3>
              <div class="flex flex-col sm:flex-row justify-start sm:justify-start gap-6">
                <!-- Average Movie Score -->
                <div class="text-center">
                  <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-100">
                    <span class="text-blue-600 font-bold text-2xl">{{ averageMovieScore }}%</span>
                  </div>
                  <p class="text-xs font-medium text-gray-600">Movies</p>
                </div>

                <!-- Average TV Score -->
                <div class="text-center">
                  <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-100">
                    <span class="text-purple-600 font-bold text-2xl">{{ averageTvScore }}%</span>
                  </div>
                  <p class="text-xs font-medium text-gray-600">TV Shows</p>
                </div>

                <!-- Average Mood -->
                <div class="text-center">
                  <div class="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-100">
                    <span class="text-3xl">{{ averageMoodEmoji }}</span>
                  </div>
                  <p class="text-xs font-medium text-gray-600">Mood</p>
                </div>
              </div>
            </div>

            <!-- Quick Stats Grid - Bottom Row -->
            <div>
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Activity</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <!-- Movies Watched -->
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p class="text-xl font-bold text-gray-900">{{ totalMoviesWatched }}</p>
                  <p class="text-xs text-gray-600 font-medium mt-0.5">Movies Watched</p>
                </div>
                <!-- Shows Watched -->
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p class="text-xl font-bold text-gray-900">{{ totalShowsWatched }}</p>
                  <p class="text-xs text-gray-600 font-medium mt-0.5">Shows Watched</p>
                </div>
                <!-- Badges Earned -->
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p class="text-xl font-bold text-gray-900">{{ totalBadgesEarned }}</p>
                  <p class="text-xs text-gray-600 font-medium mt-0.5">Badges Earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 mb-6 bg-white rounded-t-lg shadow-sm overflow-x-auto">
        <nav class="flex space-x-1 px-4 -mb-px">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap',
              activeTab === tab.id 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'overview'" class="space-y-5">
        <!-- Top Row: Genres and Moods -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Most Watched Genres -->
          <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
              Most Watched Genres
            </h3>
            <div v-if="topGenres.length === 0" class="text-gray-500 text-center py-6 text-sm">
              No genre data yet. Start watching to see your favorite genres!
            </div>
            <div v-else class="space-y-2">
              <div v-for="(genre, idx) in topGenres" :key="idx" class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-700 text-sm">{{ genre.name }}</span>
                <span class="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ genre.count }}</span>
              </div>
            </div>
          </div>

          <!-- Most Watched Moods -->
          <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
              Most Watched Moods
            </h3>
            <div v-if="topMoods.length === 0" class="text-gray-500 text-center py-6 text-sm">
              No mood data yet. Start rating content to see your mood preferences!
            </div>
            <div v-else class="space-y-2">
              <div v-for="(mood, idx) in topMoods" :key="idx" class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-700 text-sm">{{ mood.emoji }} {{ mood.name }}</span>
                <span class="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ mood.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Favourites, Friends, and Badges -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Favourites -->
          <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
              Favourites
            </h3>
            <div v-if="favourites.length === 0" class="text-gray-500 text-center py-6 text-sm">
              No favourites yet. Mark your favorite movies and shows!
            </div>
            <div v-else class="space-y-3">
              <div v-for="(fav, idx) in favourites" :key="idx" class="flex items-center space-x-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div class="w-10 h-14 bg-gray-200 rounded flex-shrink-0"></div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ fav.title }}</p>
                  <p class="text-xs text-gray-500">{{ fav.year }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Friends -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-semibold text-gray-900 flex items-center">
                <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
                Friends
              </h3>
              <span v-if="friends.length > 0" class="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ friends.length }} friends</span>
            </div>
            <div v-if="friends.length === 0" class="text-gray-500 text-center py-6 text-sm">
              No friends yet. Add friends to see them here!
            </div>
            <div v-else>
              <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 mb-4">
                <div v-for="friend in friends" :key="friend.id" class="text-center group cursor-pointer">
                  <div class="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-1.5"></div>
                  <p class="text-xs text-gray-600 font-medium truncate">{{ friend.name }}</p>
                </div>
              </div>
              <button class="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                + Add Friends
              </button>
            </div>
          </div>
        </div>

        <!-- Badges Section -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-900 flex items-center">
              <span class="w-1 h-5 bg-gray-900 rounded-full mr-2"></span>
              Badges & Achievements
            </h3>
            <div class="flex items-center space-x-3">
              <RouterLink 
                to="/achievements"
                class="text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                View All
              </RouterLink>
              <button 
                @click="showAllBadges = !showAllBadges"
                class="text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {{ showAllBadges ? 'Show Less' : 'Show All' }}
              </button>
            </div>
          </div>
          <p class="text-xs text-gray-500 mb-4">
            Earn badges by completing watch parties, challenges, and milestones.
          </p>

          <!-- Featured Badges (First 6) -->
          <div v-if="!showAllBadges" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3">
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

      <!-- Lists Tab -->
      <div v-if="activeTab === 'lists'" class="space-y-5">
        <!-- List Overview (when no list is selected) -->
        <div v-if="!selectedList" class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">My Lists</h3>
              <p class="text-gray-500 text-sm mt-1">Create and manage your custom lists</p>
            </div>
            <button
              class="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors text-sm"
              @click="isCreateListOpen = true"
            >
              + Create List
            </button>
          </div>

          <!-- Lists Display -->
          <div v-if="userLists.length === 0" class="text-gray-500 text-center py-12 text-sm">
            You haven't created any lists yet. Start by creating your first list!
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="list in userLists" 
              :key="list.id" 
              @click="openList(list)"
              class="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group"
            >
              <h4 class="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">{{ list.name }}</h4>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ list.description }}</p>
              <div class="flex items-center justify-between">
                <span class="bg-gray-900 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ list.itemCount || 0 }} items</span>
                <span class="text-xs text-gray-500">{{ list.public === 'yes' ? 'Public' : 'Private' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed List View (when a list is selected) -->
        <div v-else>
          <!-- Back Button and List Header -->
          <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200 mb-5">
            <!-- Back Button - Smaller -->
            <button
              @click="closeList()"
              class="mb-4 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-1 transition-colors text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Lists</span>
            </button>
            
            <!-- List Name and Description -->
            <div class="mb-4">
              <h3 class="text-2xl font-semibold text-gray-900 mb-1">{{ selectedList.name }}</h3>
              <p class="text-gray-600 text-sm">{{ selectedList.description }}</p>
            </div>

            <!-- Item Count -->
            <div class="mb-4">
              <span class="text-sm font-medium text-gray-600">{{ selectedList.movies?.length || 0 }} items</span>
            </div>
            
            <!-- Settings and Actions - Below -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Public/Private Toggle -->
                <div class="flex items-center space-x-2">
                  <label class="text-xs font-medium text-gray-600 whitespace-nowrap">Visibility:</label>
                  <select 
                    :value="selectedList.public"
                    @change="updateListSettings('public', ($event.target as HTMLSelectElement).value)"
                    class="border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                  >
                    <option value="yes">Public</option>
                    <option value="no">Private</option>
                  </select>
                </div>

                <!-- Sort By -->
                <div class="flex items-center space-x-2">
                  <label class="text-xs font-medium text-gray-600 whitespace-nowrap">Sort by:</label>
                  <select 
                    :value="selectedList.sortBy"
                    @change="updateListSettings('sortBy', ($event.target as HTMLSelectElement).value)"
                    class="border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                  >
                    <option value="original-asc">Original (A-Z)</option>
                    <option value="original-desc">Original (Z-A)</option>
                    <option value="date-added">Date Added</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>

              <!-- Delete Button -->
              <button
                @click="deleteList(selectedList.id)"
                class="text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap border border-red-600"
              >
                Delete List
              </button>
            </div>
          </div>

          <!-- Main Content: Side by Side Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <!-- Add Movies Section (Left Side - Sticky) -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200 lg:sticky lg:top-4">
                <h4 class="text-base font-semibold text-gray-900 mb-4">Add Movies/TV Shows</h4>
                <div class="mb-4">
                  <input
                    v-model="movieSearchQuery"
                    @input="searchMovies"
                    type="text"
                    placeholder="Search titles..."
                    class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>
                
                <!-- Search Results -->
                <div v-if="movieSearchQuery.trim() && searchedMovies.length === 0" class="text-center py-6 text-gray-500 text-sm">
                  No results found
                </div>
                <div v-else-if="searchedMovies.length > 0" class="space-y-2 max-h-[500px] overflow-y-auto">
                  <div
                    v-for="movie in searchedMovies"
                    :key="movie.id"
                    class="flex items-start space-x-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="w-10 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img 
                        v-if="movie.poster" 
                        :src="movie.poster" 
                        :alt="movie.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-gray-900 text-sm line-clamp-2">{{ movie.title }}</p>
                      <p class="text-xs text-gray-500 mb-2">{{ movie.type }} • {{ movie.year }}</p>
                      <button
                        @click="addMovieToList(movie)"
                        class="bg-gray-900 hover:bg-gray-800 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors w-full"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-400 text-sm">
                  <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p>Search for movies or TV shows</p>
                </div>
              </div>
            </div>

            <!-- Movies in List (Right Side) -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <h4 class="text-base font-semibold text-gray-900 mb-5">
                  Items in this list ({{ selectedList.movies?.length || 0 }})
                </h4>
                
                <div v-if="!selectedList.movies || selectedList.movies.length === 0" class="text-center py-12 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <p class="font-medium mb-1">No items yet</p>
                  <p class="text-sm">Search and add movies or TV shows to get started!</p>
                </div>
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div v-for="movie in selectedList.movies" :key="movie.id" class="group">
                    <div class="relative aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden group-hover:ring-2 group-hover:ring-gray-900 transition-all">
                      <img 
                        v-if="movie.poster" 
                        :src="movie.poster" 
                        :alt="movie.title"
                        class="w-full h-full object-cover"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="absolute bottom-0 left-0 right-0 p-2.5">
                          <button 
                            class="w-full bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors"
                            @click.stop="removeMovieFromList(movie.id)"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-2">
                      <p class="font-medium text-gray-900 text-sm line-clamp-2" :title="movie.title">{{ movie.title }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ movie.type }} • {{ movie.year }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create List Modal (with full form fields) -->
        <div
          v-if="isCreateListOpen && activeTab === 'lists'"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          @click.self="isCreateListOpen = false"
        >
          <div class="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h4 class="text-base font-bold text-gray-900">Create New List: Step 1</h4>
              <button class="text-gray-500 hover:text-gray-700 text-xl" @click="isCreateListOpen = false">✕</button>
            </div>
            <div class="p-4 space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                <input 
                  v-model="createListForm.name" 
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  placeholder="My awesome list" 
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea 
                  v-model="createListForm.description" 
                  rows="2" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                  placeholder="Describe your list..."
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">Public List?</label>
                  <select v-model="createListForm.public" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">Show Comments</label>
                  <select v-model="createListForm.comments" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">Sort By</label>
                  <select v-model="createListForm.sortBy" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="original-asc">Original Ascending</option>
                    <option value="original-desc">Original Descending</option>
                    <option value="date-added">Date Added</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button 
                class="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm" 
                @click="isCreateListOpen = false"
              >
                Cancel
              </button>
              <button 
                class="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md text-sm" 
                @click="submitCreateList()"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- My Ratings/Reviews Tab -->
      <div v-if="activeTab === 'ratings'" class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-900">My Ratings & Reviews</h3>
          <p class="text-gray-600 text-sm mt-1">Your ratings and reviews for movies and TV shows</p>
        </div>

        <!-- Ratings Section -->
        <div class="mb-8">
          <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span class="w-1 h-5 bg-yellow-500 rounded-full mr-3"></span>
            Ratings
          </h4>
          <div v-if="userRatings.length === 0" class="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
            You haven't rated any content yet. Start watching and rating!
          </div>
          <div v-else class="space-y-3">
            <div v-for="rating in userRatings" :key="rating.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-md shadow-sm flex-shrink-0 overflow-hidden">
                  <img 
                    v-if="rating.poster" 
                    :src="rating.poster" 
                    :alt="rating.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ rating.title }}</p>
                  <p class="text-xs text-gray-500">{{ rating.type }} • {{ rating.year }}</p>
                  <p class="text-xs text-gray-400 mt-1">Rated on {{ rating.ratedDate }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex items-center space-x-1">
                  <span v-for="i in 5" :key="i" class="text-xl">
                    {{ i <= rating.rating ? '⭐' : '☆' }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-600 ml-2">{{ rating.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div>
          <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span class="w-1 h-5 bg-blue-600 rounded-full mr-3"></span>
            Reviews
          </h4>
          <div v-if="userReviews.length === 0" class="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
            You haven't written any reviews yet. Share your thoughts on movies and shows!
          </div>
          <div v-else class="space-y-4">
            <div v-for="review in userReviews" :key="review.id" class="p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-4">
                  <div class="w-16 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-md shadow-sm flex-shrink-0 overflow-hidden">
                    <img 
                      v-if="review.poster" 
                      :src="review.poster" 
                      :alt="review.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 text-lg">{{ review.title }}</p>
                    <p class="text-sm text-gray-500">{{ review.type }} • {{ review.year }}</p>
                    <div class="flex items-center space-x-1 mt-1">
                      <span v-for="i in 5" :key="i" class="text-sm">
                        {{ i <= review.rating ? '⭐' : '☆' }}
                      </span>
                      <span class="text-xs text-gray-600 ml-1">{{ review.rating }}/5</span>
                    </div>
                  </div>
                </div>
                <span class="text-xs text-gray-400">{{ review.reviewDate }}</span>
              </div>
              <div class="ml-20">
                <p class="text-gray-700 leading-relaxed">{{ review.reviewText }}</p>
                <div v-if="review.helpfulCount" class="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>{{ review.helpfulCount }} found helpful</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Watchlist Tab -->
      <div v-if="activeTab === 'watchlist'" class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-900">My Watchlist</h3>
          <p class="text-gray-600 text-sm mt-1">Movies and TV shows you want to watch</p>
        </div>

        <!-- Watchlist Items Display -->
        <div v-if="watchlistItems.length === 0" class="text-gray-600 text-center py-12">
          <p class="text-lg mb-2">Your watchlist is empty</p>
          <p class="text-sm">Add movies and TV shows from their individual pages to see them here!</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div v-for="item in watchlistItems" :key="item.id" class="group cursor-pointer">
            <div class="relative aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
              <img 
                v-if="item.poster" 
                :src="item.poster" 
                :alt="item.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                <button 
                  class="opacity-0 group-hover:opacity-100 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-opacity"
                  @click.stop="removeFromWatchlist(item.id)"
                >
                  Remove
                </button>
              </div>
            </div>
            <div class="mt-2">
              <p class="font-semibold text-gray-900 text-sm line-clamp-2">{{ item.title }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.type }} • {{ item.year }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Friends Tab -->
      <div v-if="activeTab === 'friends'" class="space-y-6">
        <!-- Sub-navigation for Friends/Requests -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div class="flex border-b border-gray-200">
            <button
              @click="friendsSubTab = 'all'"
              :class="[
                'flex-1 px-6 py-4 font-semibold text-sm transition-all duration-200',
                friendsSubTab === 'all'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              Friends ({{ userFriends.length }})
            </button>
            <button
              @click="friendsSubTab = 'requests'"
              :class="[
                'flex-1 px-6 py-4 font-semibold text-sm transition-all duration-200 relative',
                friendsSubTab === 'requests'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              Requests
              <span v-if="friendRequests.length > 0" class="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {{ friendRequests.length }}
              </span>
            </button>
          </div>

          <!-- All Friends View -->
          <div v-if="friendsSubTab === 'all'" class="p-6">
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Add Friends</h3>
              <div class="relative">
                <input
                  v-model="friendSearchQuery"
                  type="text"
                  placeholder="Search users..."
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <!-- Your Friends Section -->
            <div class="mb-8">
              <h4 class="text-lg font-bold text-gray-900 mb-4">Your Friends</h4>
              <div v-if="filteredFriends.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
                <p class="text-gray-600 mb-2">
                  {{ friendSearchQuery ? 'No friends found matching your search' : 'No friends yet. Search and add friends to watch together!' }}
                </p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="friend in filteredFriends"
                  :key="friend.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {{ friend.name?.charAt(0).toUpperCase() || 'F' }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ friend.name }}</p>
                      <p class="text-sm text-gray-500">{{ friend.email || 'Friend' }}</p>
                    </div>
                  </div>
                  <button
                    @click="removeFriend(friend.id)"
                    class="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Friend Requests View -->
          <div v-if="friendsSubTab === 'requests'" class="p-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Friend Requests</h3>
            
            <div v-if="friendRequests.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
              <p class="text-gray-600">No pending requests</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="request in friendRequests"
                :key="request.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {{ request.name?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ request.name }}</p>
                    <p class="text-sm text-gray-500">{{ request.email || 'Sent you a friend request' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="acceptFriendRequest(request.id)"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Accept</span>
                  </button>
                  <button
                    @click="rejectFriendRequest(request.id)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
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
  { id: 'lists', name: 'Lists' },
  { id: 'ratings', name: 'My Ratings/Reviews' },
  { id: 'watchlist', name: 'My Watchlist' },
  { id: 'friends', name: 'Friends' },
  { id: 'history', name: 'Watch History' },
  { id: 'activity', name: 'Activity' }
]

const createListForm = ref({
  name: '',
  description: '',
  public: 'yes',
  comments: 'yes',
  sortBy: 'original-asc'
})

const userWatchlists = ref<any[]>([])

// For the new Lists tab
const userLists = ref<any[]>([])

// Watchlist items (movies/TV shows added from individual pages)
const watchlistItems = ref<any[]>([])

// Friends tab state
const friendsSubTab = ref<'all' | 'requests'>('all')
const friendSearchQuery = ref('')
const userFriends = ref<any[]>([])
const friendRequests = ref<any[]>([])

// Lists tab state
const selectedList = ref<any>(null)
const movieSearchQuery = ref('')
const searchedMovies = ref<any[]>([])

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
const userReviews = ref<any[]>([])
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

const removeFromWatchlist = (itemId: number) => {
  watchlistItems.value = watchlistItems.value.filter(item => item.id !== itemId)
}

const acceptFriendRequest = (requestId: number) => {
  // Move from requests to friends
  const request = friendRequests.value.find(r => r.id === requestId)
  if (request) {
    userFriends.value.push({
      id: request.id,
      name: request.name,
      email: request.email,
      avatar: request.avatar
    })
    friendRequests.value = friendRequests.value.filter(r => r.id !== requestId)
  }
}

const rejectFriendRequest = (requestId: number) => {
  friendRequests.value = friendRequests.value.filter(r => r.id !== requestId)
}

const removeFriend = (friendId: number) => {
  userFriends.value = userFriends.value.filter(f => f.id !== friendId)
}

const filteredFriends = computed(() => {
  if (!friendSearchQuery.value.trim()) return userFriends.value
  const query = friendSearchQuery.value.toLowerCase()
  return userFriends.value.filter(friend => 
    friend.name?.toLowerCase().includes(query) || 
    friend.email?.toLowerCase().includes(query)
  )
})

const openList = (list: any) => {
  selectedList.value = list
}

const closeList = () => {
  selectedList.value = null
  movieSearchQuery.value = ''
  searchedMovies.value = []
}

const addMovieToList = (movie: any) => {
  if (!selectedList.value) return
  
  // Check if movie already exists in the list
  if (!selectedList.value.movies) {
    selectedList.value.movies = []
  }
  
  const exists = selectedList.value.movies.some((m: any) => m.id === movie.id)
  if (exists) {
    alert('This movie is already in your list!')
    return
  }
  
  selectedList.value.movies.push({
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    year: movie.year,
    type: movie.type,
    addedDate: new Date().toLocaleDateString()
  })
  
  selectedList.value.itemCount = selectedList.value.movies.length
  
  // Update the list in userLists
  const listIndex = userLists.value.findIndex(l => l.id === selectedList.value.id)
  if (listIndex !== -1) {
    userLists.value[listIndex] = { ...selectedList.value }
  }
  
  movieSearchQuery.value = ''
  searchedMovies.value = []
}

const removeMovieFromList = (movieId: number) => {
  if (!selectedList.value || !selectedList.value.movies) return
  
  selectedList.value.movies = selectedList.value.movies.filter((m: any) => m.id !== movieId)
  selectedList.value.itemCount = selectedList.value.movies.length
  
  // Update the list in userLists
  const listIndex = userLists.value.findIndex(l => l.id === selectedList.value.id)
  if (listIndex !== -1) {
    userLists.value[listIndex] = { ...selectedList.value }
  }
}

const searchMovies = async () => {
  // Clear results if query is too short
  if (movieSearchQuery.value.trim().length < 2) {
    searchedMovies.value = []
    return
  }
  
  // Mock search results with more variety - in real app, this would call TMDB API
  const allMovies = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      year: 1994,
      type: 'Movie'
    },
    {
      id: 2,
      title: 'The Godfather',
      poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      year: 1972,
      type: 'Movie'
    },
    {
      id: 3,
      title: 'The Dark Knight',
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      year: 2008,
      type: 'Movie'
    },
    {
      id: 4,
      title: 'Inception',
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      year: 2010,
      type: 'Movie'
    },
    {
      id: 5,
      title: 'Breaking Bad',
      poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      year: 2008,
      type: 'TV Show'
    },
    {
      id: 6,
      title: 'Game of Thrones',
      poster: 'https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUVQUAEfk.jpg',
      year: 2011,
      type: 'TV Show'
    },
    {
      id: 7,
      title: 'Interstellar',
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      year: 2014,
      type: 'Movie'
    },
    {
      id: 8,
      title: 'Pulp Fiction',
      poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      year: 1994,
      type: 'Movie'
    },
    {
      id: 9,
      title: 'The Matrix',
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      year: 1999,
      type: 'Movie'
    },
    {
      id: 10,
      title: 'Stranger Things',
      poster: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
      year: 2016,
      type: 'TV Show'
    }
  ]
  
  searchedMovies.value = allMovies.filter(movie => 
    movie.title.toLowerCase().includes(movieSearchQuery.value.toLowerCase())
  )
}

const deleteList = (listId: number) => {
  if (confirm('Are you sure you want to delete this list?')) {
    userLists.value = userLists.value.filter(l => l.id !== listId)
    if (selectedList.value?.id === listId) {
      closeList()
    }
  }
}

const updateListSettings = (field: string, value: string) => {
  if (!selectedList.value) return
  
  selectedList.value[field] = value
  
  // Update the list in userLists
  const listIndex = userLists.value.findIndex(l => l.id === selectedList.value.id)
  if (listIndex !== -1) {
    userLists.value[listIndex] = { ...selectedList.value }
  }
}

const submitCreateList = () => {
  if (!createListForm.value.name.trim()) {
    alert('Please enter a list name')
    return
  }

  const newList = {
    id: Date.now(),
    name: createListForm.value.name,
    description: createListForm.value.description,
    public: createListForm.value.public,
    comments: createListForm.value.comments,
    sortBy: createListForm.value.sortBy,
    itemCount: 0,
    movies: [],
    createdAt: new Date().toISOString()
  }

  userLists.value.push(newList)

  createListForm.value = {
    name: '',
    description: '',
    public: 'yes',
    comments: 'yes',
    sortBy: 'original-asc'
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

  // Load user lists from localStorage
  const savedLists = localStorage.getItem('wb_lists')
  if (savedLists) {
    userLists.value = JSON.parse(savedLists)
  }

  // Load watchlist items from localStorage
  const savedWatchlistItems = localStorage.getItem('wb_watchlist_items')
  if (savedWatchlistItems) {
    watchlistItems.value = JSON.parse(savedWatchlistItems)
  }

  // Load friends from localStorage
  const savedFriends = localStorage.getItem('wb_friends')
  if (savedFriends) {
    userFriends.value = JSON.parse(savedFriends)
  }

  // Load friend requests from localStorage
  const savedFriendRequests = localStorage.getItem('wb_friend_requests')
  if (savedFriendRequests) {
    friendRequests.value = JSON.parse(savedFriendRequests)
  }

  // Load user ratings from localStorage
  const savedRatings = localStorage.getItem('wb_ratings')
  if (savedRatings) {
    userRatings.value = JSON.parse(savedRatings)
  }

  // Load user reviews from localStorage
  const savedReviews = localStorage.getItem('wb_reviews')
  if (savedReviews) {
    userReviews.value = JSON.parse(savedReviews)
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

// Watch for changes to userLists and save to localStorage
watch(userLists, (newLists) => {
  localStorage.setItem('wb_lists', JSON.stringify(newLists))
}, { deep: true })

// Watch for changes to watchlistItems and save to localStorage
watch(watchlistItems, (newItems) => {
  localStorage.setItem('wb_watchlist_items', JSON.stringify(newItems))
}, { deep: true })

// Watch for changes to friends and save to localStorage
watch(userFriends, (newFriends) => {
  localStorage.setItem('wb_friends', JSON.stringify(newFriends))
}, { deep: true })

// Watch for changes to friend requests and save to localStorage
watch(friendRequests, (newRequests) => {
  localStorage.setItem('wb_friend_requests', JSON.stringify(newRequests))
}, { deep: true })

// Watch for changes to ratings and save to localStorage
watch(userRatings, (newRatings) => {
  localStorage.setItem('wb_ratings', JSON.stringify(newRatings))
}, { deep: true })

// Watch for changes to reviews and save to localStorage
watch(userReviews, (newReviews) => {
  localStorage.setItem('wb_reviews', JSON.stringify(newReviews))
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

  