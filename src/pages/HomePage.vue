<template>
  <BaseNavBar />
  
  <!-- Hero Section -->
  <div class="relative min-h-[600px] flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>
    
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <!-- Tag Line -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/50 rounded-full text-green-400 text-sm font-medium mb-8 animate-fade-in">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Watch Together, Anywhere
      </div>
      
      <!-- Main Heading -->
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
        Your Social Movie<br />
        Watching Experience
      </h1>
      
      <!-- Subtitle -->
      <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
        Host synchronized watch parties, get personalized recommendations, share reviews, and earn badges. WatchBuddy brings friends together for the ultimate movie night.
      </p>
      
      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="$router.push('/movies')"
          class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          Browse Movies
        </button>
        <button
          @click="$router.push('/recommend')"
          class="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Get Recommendations
        </button>
      </div>
    </div>
  </div>
  
  <!-- Features Section -->
  <div class="bg-gray-900 text-white py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto">
          Powerful features to enhance your movie watching experience
        </p>
      </div>
      
      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <!-- Watch Parties -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all group">
          <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3">Watch Parties</h3>
          <p class="text-gray-400 leading-relaxed">
            Host synchronized watch parties with friends. Real-time chat, synchronized playback, and interactive quizzes.
          </p>
        </div>
        
        <!-- Smart Recommendations -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all group">
          <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3">Smart Recommendations</h3>
          <p class="text-gray-400 leading-relaxed">
            Get personalized movie suggestions based on your mood, preferences, and what similar users are watching.
          </p>
        </div>
        
        <!-- Reviews & Ratings -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all group">
          <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3">Reviews & Ratings</h3>
          <p class="text-gray-400 leading-relaxed">
            Share your thoughts and discover what others think. Upvote helpful reviews and build your reputation.
          </p>
        </div>
        
        <!-- Badges & Achievements -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all group">
          <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3">Badges & Achievements</h3>
          <p class="text-gray-400 leading-relaxed">
            Earn badges for completing watch parties, marathons, and social milestones. Show off your accomplishments.
          </p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- CTA Section -->
  <div class="bg-gray-800 text-white py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-4xl md:text-5xl font-bold mb-6">Ready to Start Watching?</h2>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
        Join WatchBuddy today and discover a new way to enjoy movies with friends.
      </p>
      <button
        @click="$router.push('/movies')"
        class="px-10 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition-all hover:scale-105 shadow-xl"
      >
        Get Started
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>