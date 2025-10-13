<script>
export default {
  name: 'App',
  data() {
    return {
      selectedMood: '',
      searchQuery: '',
      moods: [
        { name: 'Happy', emoji: '😊' },
        { name: 'Sad', emoji: '😢' },
        { name: 'Excited', emoji: '🤩' },
        { name: 'Relaxed', emoji: '😌' },
        { name: 'Adventurous', emoji: '🗺️' },
        { name: 'Romantic', emoji: '💕' }
      ],
      featuredMovies: [
        {
          id: 1,
          title: 'The Matrix',
          year: '1999',
          rating: 8.7,
          poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Matrix'
        },
        {
          id: 2,
          title: 'Inception',
          year: '2010',
          rating: 8.8,
          poster: 'https://via.placeholder.com/300x450/2a2a2a/ffffff?text=Inception'
        },
        {
          id: 3,
          title: 'Interstellar',
          year: '2014',
          rating: 8.6,
          poster: 'https://via.placeholder.com/300x450/3a3a3a/ffffff?text=Interstellar'
        },
        {
          id: 4,
          title: 'The Dark Knight',
          year: '2008',
          rating: 9.0,
          poster: 'https://via.placeholder.com/300x450/4a4a4a/ffffff?text=Dark+Knight'
        }
      ],
      watchParties: [
        {
          id: 1,
          movie: 'Avengers: Endgame',
          host: 'Sarah M.',
          time: 'Today 8:00 PM',
          participants: 12
        },
        {
          id: 2,
          movie: 'The Office (Season 1 )',
          host: 'Mike T.',
          time: 'Tomorrow 7:30 PM',
          participants: 8
        },
        {
          id: 3,
          movie: 'Spirited Away',
          host: 'Emma L.',
          time: 'Sunday 6:00 PM',
          participants: 15
        }
      ]
    }
  },
  computed: {
    moodRecommendations() {
      // Mock recommendations based on selected mood
      const recommendations = {
        'Happy': [
          { id: 5, title: 'The Grand Budapest Hotel', genre: 'Comedy', rating: 8.1, poster: 'https://via.placeholder.com/300x450/ff6b6b/ffffff?text=Grand+Budapest' },
          { id: 6, title: 'La La Land', genre: 'Musical', rating: 8.0, poster: 'https://via.placeholder.com/300x450/4ecdc4/ffffff?text=La+La+Land' }
        ],
        'Sad': [
          { id: 7, title: 'Inside Out', genre: 'Animation', rating: 8.1, poster: 'https://via.placeholder.com/300x450/45b7d1/ffffff?text=Inside+Out' },
          { id: 8, title: 'Her', genre: 'Drama', rating: 8.0, poster: 'https://via.placeholder.com/300x450/f9ca24/ffffff?text=Her' }
        ],
        'Excited': [
          { id: 9, title: 'Mad Max: Fury Road', genre: 'Action', rating: 8.1, poster: 'https://via.placeholder.com/300x450/f0932b/ffffff?text=Mad+Max' },
          { id: 10, title: 'John Wick', genre: 'Action', rating: 7.4, poster: 'https://via.placeholder.com/300x450/eb4d4b/ffffff?text=John+Wick' }
        ],
        'Relaxed': [
          { id: 11, title: 'Studio Ghibli Collection', genre: 'Animation', rating: 8.5, poster: 'https://via.placeholder.com/300x450/6c5ce7/ffffff?text=Ghibli' },
          { id: 12, title: 'The Great British Bake Off', genre: 'Reality', rating: 8.6, poster: 'https://via.placeholder.com/300x450/a55eea/ffffff?text=Bake+Off' }
        ],
        'Adventurous': [
          { id: 13, title: 'Indiana Jones', genre: 'Adventure', rating: 8.4, poster: 'https://via.placeholder.com/300x450/26de81/ffffff?text=Indiana+Jones' },
          { id: 14, title: 'The Lord of the Rings', genre: 'Fantasy', rating: 8.8, poster: 'https://via.placeholder.com/300x450/20bf6b/ffffff?text=LOTR' }
        ],
        'Romantic': [
          { id: 15, title: 'The Princess Bride', genre: 'Romance', rating: 8.0, poster: 'https://via.placeholder.com/300x450/fd79a8/ffffff?text=Princess+Bride' },
          { id: 16, title: 'Before Sunrise', genre: 'Romance', rating: 8.1, poster: 'https://via.placeholder.com/300x450/fdcb6e/ffffff?text=Before+Sunrise' }
        ]
      };
      return recommendations[this.selectedMood] || [];
    }
  },
  methods: {
    selectMood(mood ) {
      this.selectedMood = mood;
    }
  }
}
</script>

<template>
  <div id="app">
    <!-- Header Navigation -->
    <header class="header">
      <nav class="navbar">
        <div class="nav-brand">
          <h1>🎬 WatchBuddy</h1>
        </div>
        <div class="nav-links">
          <a href="#home" class="nav-link active">Home</a>
          <a href="#discover" class="nav-link">Discover</a>
          <a href="#watchlist" class="nav-link">My Watchlist</a>
          <a href="#parties" class="nav-link">Watch Parties</a>
          <a href="#profile" class="nav-link">Profile</a>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h2 class="hero-title">Discover Your Next Favourite Movie</h2>
          <p class="hero-subtitle">Let your mood guide you to the perfect entertainment experience</p>

          <!-- Mood Selector -->
          <div class="mood-selector">
            <h3>How are you feeling today?</h3>
            <div class="mood-buttons">
              <button v-for="mood in moods" :key="mood.name" class="mood-btn"
                :class="{ active: selectedMood === mood.name }" @click="selectMood(mood.name)">
                {{ mood.emoji }} {{ mood.name }}
              </button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="search-section">
            <div class="search-bar">
              <input type="text" placeholder="Search for movies, TV shows, or genres..." v-model="searchQuery"
                class="search-input">
              <button class="search-btn">🔍</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Content -->
      <section class="featured-section">
        <h3>Trending Now</h3>
        <div class="movie-grid">
          <div v-for="movie in featuredMovies" :key="movie.id" class="movie-card">
            <div class="movie-poster">
              <img :src="movie.poster" :alt="movie.title">
              <div class="movie-overlay">
                <button class="play-btn">▶️ Watch</button>
                <button class="add-btn">+ Watchlist</button>
              </div>
            </div>
            <div class="movie-info">
              <h4>{{ movie.title }}</h4>
              <p class="movie-year">{{ movie.year }}</p>
              <div class="movie-rating">
                ⭐ {{ movie.rating }}/10
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mood-Based Recommendations -->
      <section class="recommendations-section" v-if="selectedMood">
        <h3>Perfect for Your {{ selectedMood }} Mood</h3>
        <div class="movie-grid">
          <div v-for="movie in moodRecommendations" :key="movie.id" class="movie-card">
            <div class="movie-poster">
              <img :src="movie.poster" :alt="movie.title">
              <div class="movie-overlay">
                <button class="play-btn">▶️ Watch</button>
                <button class="add-btn">+ Watchlist</button>
              </div>
            </div>
            <div class="movie-info">
              <h4>{{ movie.title }}</h4>
              <p class="movie-genre">{{ movie.genre }}</p>
              <div class="movie-rating">
                ⭐ {{ movie.rating }}/10
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Watch Parties Section -->
      <section class="watch-parties-section">
        <h3>Upcoming Watch Parties</h3>
        <div class="parties-grid">
          <div v-for="party in watchParties" :key="party.id" class="party-card">
            <div class="party-info">
              <h4>{{ party.movie }}</h4>
              <p class="party-host">Hosted by {{ party.host }}</p>
              <p class="party-time">{{ party.time }}</p>
              <p class="party-participants">{{ party.participants }} participants</p>
            </div>
            <button class="join-btn">Join Party</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 WatchBuddy. Made with ❤️ for movie lovers.</p>
    </footer>
  </div>

</template>

<style scoped>
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>
