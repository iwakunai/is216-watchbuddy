<template>
  <!-- Enhanced Background with Wave Effects -->
  <div class="background-container">
    <!-- Animated Gradient Mesh -->
    <div class="gradient-mesh"></div>

    <!-- Animated Wave Lines -->
    <div class="wave-container">
      <svg
        class="wave wave-1"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="url(#gradient1)"
        />
      </svg>
      <svg
        class="wave wave-2"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,70 Q300,20 600,70 T1200,70 L1200,120 L0,120 Z"
          fill="url(#gradient2)"
        />
      </svg>
      <svg
        class="wave wave-3"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,90 Q300,40 600,90 T1200,90 L1200,120 L0,120 Z"
          fill="url(#gradient3)"
        />
      </svg>
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            style="stop-color: rgba(59, 130, 246, 0.1); stop-opacity: 1"
          />
          <stop
            offset="100%"
            style="stop-color: rgba(37, 99, 235, 0.1); stop-opacity: 1"
          />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            style="stop-color: rgba(37, 99, 235, 0.08); stop-opacity: 1"
          />
          <stop
            offset="100%"
            style="stop-color: rgba(29, 78, 216, 0.08); stop-opacity: 1"
          />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            style="stop-color: rgba(29, 78, 216, 0.06); stop-opacity: 1"
          />
          <stop
            offset="100%"
            style="stop-color: rgba(37, 99, 235, 0.06); stop-opacity: 1"
          />
        </linearGradient>
      </defs>
    </div>

    <!-- Floating Shapes -->
    <div class="shapes-container">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>

  <BaseNavBar />

  <!-- Hero Section -->
  <div
    class="relative min-h-screen flex items-center justify-center text-white overflow-hidden hero-section"
  >
    <!-- Film Strip Effect -->
    <div class="film-strip"></div>

    <div
      class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center"
    >
      <!-- Main Heading with Stagger Animation -->
      <div class="hero-content">
        <h1
          class="hero-title text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
        >
          <span class="title-line">Find Your Perfect Watch</span><br />
          <span class="title-line gradient-text">Based On Your Mood</span>
        </h1>

        <!-- Subtitle -->
        <p
          class="hero-subtitle text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          <br class="hidden md:block" />
          Let your emotions guide your next watch.
        </p>

        <!-- CTA Buttons -->
        <div class="cta-container flex items-center justify-center">
          <button
            @click="navigate('/recommend')"
            class="btn-main group relative px-16 py-8 bg-blue-600 text-white text-2xl font-bold rounded-2xl transition-all overflow-hidden"
          >
            <span class="relative z-10 flex items-center gap-3">
              <span class="text-3xl">✨</span>
              <span>Discover By Mood</span>
            </span>
            <div class="btn-gradient"></div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div class="features-section text-white py-32 relative">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-24">
        <h2 class="text-5xl md:text-7xl font-black mb-8 gradient-text">
          Everything You Need
        </h2>
        <div class="section-divider"></div>
        <p
          class="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light mt-8"
        >
          Transform how you experience movies & shows
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <!-- Smart Recommendations -->
        <div class="feature-card group">
          <div class="feature-card-inner">
            <div class="feature-number">01</div>
            <div class="feature-icon-wrapper">
              <div class="feature-icon">
                <svg
                  class="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 class="feature-title">Smart Recommendations</h3>
            <p class="feature-description">
              AI-powered suggestions tailored to your mood, taste, and viewing
              history
            </p>
          </div>
        </div>

        <!-- Watch Parties -->
        <div class="feature-card group">
          <div class="feature-card-inner">
            <div class="feature-number">02</div>
            <div class="feature-icon-wrapper">
              <div class="feature-icon">
                <svg
                  class="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 class="feature-title">Watch Parties</h3>
            <p class="feature-description">
              Synchronised viewing with real-time chat and interactive features
              for the ultimate shared experience
            </p>
          </div>
        </div>

        <!-- Reviews & Community -->
        <div class="feature-card group">
          <div class="feature-card-inner">
            <div class="feature-number">03</div>
            <div class="feature-icon-wrapper">
              <div class="feature-icon">
                <svg
                  class="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
            </div>
            <h3 class="feature-title">Track & Review</h3>
            <p class="feature-description">
              Track your watching progress on your watchlist, rate and review
              movies, and discover perspectives from fellow enthusiasts
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="cta-section text-white py-32 relative overflow-hidden">
    <div class="cta-bg"></div>
    <div
      class="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
    >
      <h2 class="text-5xl md:text-7xl font-black mb-10">Ready to Start?</h2>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button
          @click="navigateToTop('/movies')"
          class="btn-cta group relative px-16 py-7 bg-blue-600 text-white text-xl font-bold rounded-2xl transition-all overflow-hidden"
        >
          <span class="relative z-10 flex items-center gap-3">
            <span class="text-2xl">🎬</span>
            <span>Browse Movies</span>
          </span>
        </button>
        <button
          @click="navigateToTop('/tv')"
          class="btn-cta-secondary group relative px-16 py-7 bg-blue-600 text-white text-xl font-bold rounded-2xl transition-all overflow-hidden"
        >
          <span class="relative z-10 flex items-center gap-3">
            <span class="text-2xl">📺</span>
            <span>Browse TV Shows</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const navigate = (path: string) => {
  router.push(path);
};

const navigateToTop = async (path: string) => {
  // Scroll to top first, before navigation
  window.scrollTo(0, 0);
  await router.push(path);
  // Ensure we're at top after navigation completes
  window.scrollTo(0, 0);
};
</script>

<style scoped>
/* Remove any custom cursor effects */
* {
  cursor: default !important;
}

/* Background Container */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

/* Animated Gradient Mesh */
.gradient-mesh {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(59, 130, 246, 0.12) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(37, 99, 235, 0.12) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 50% 50%,
      rgba(29, 78, 216, 0.08) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, #0a0e1a 0%, #1a1f35 50%, #0f1629 100%);
  animation: gradientShift 20s ease infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

/* Animated Wave Lines */
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300px;
  pointer-events: none;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wave-1 {
  animation: waveMove 15s ease-in-out infinite;
  opacity: 0.6;
}

.wave-2 {
  animation: waveMove 18s ease-in-out infinite reverse;
  opacity: 0.4;
}

.wave-3 {
  animation: waveMove 22s ease-in-out infinite;
  opacity: 0.3;
}

@keyframes waveMove {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50px);
  }
}

/* Floating Shapes */
.shapes-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.4) 0%,
    transparent 70%
  );
  top: -20%;
  right: -10%;
  animation: floatShape 25s ease-in-out infinite;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.3) 0%,
    transparent 70%
  );
  bottom: -10%;
  left: -10%;
  animation: floatShape 30s ease-in-out infinite reverse;
}

.shape-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(29, 78, 216, 0.35) 0%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  animation: floatShape 35s ease-in-out infinite;
}

@keyframes floatShape {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(100px, -100px) rotate(120deg);
  }
  66% {
    transform: translate(-100px, 50px) rotate(240deg);
  }
}

/* Film Strip Effect - Pure Black & White */
.film-strip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  cursor: default;
}

/* Top film strip with perforations - Realistic Film Strip */
.film-strip::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #000000;
  border-bottom: 4px solid #000000;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;

  /* Sprocket holes on LEFT side */
  background-image: 
    /* Left sprocket holes - rectangular perforations */ repeating-linear-gradient(
      90deg,
      #000000 0px,
      #000000 10px,
      transparent 10px,
      transparent 30px,
      #000000 30px,
      #000000 50px
    ),
    /* Right sprocket holes - rectangular perforations */
      repeating-linear-gradient(
        90deg,
        #000000 0px,
        #000000 10px,
        transparent 10px,
        transparent 30px,
        #000000 30px,
        #000000 50px
      ),
    /* Frame numbers (optional white text area) */
      linear-gradient(90deg, #000000 0%, #000000 100%);

  background-size: 50px 20px, 50px 20px, 100% 100%;
  background-position: 0 15px, 0 45px, 0 0;
  background-repeat: repeat-x, repeat-x, no-repeat;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
  z-index: 2;

  /* Create actual sprocket hole cutouts */
  -webkit-mask-image: 
    /* Top row of sprockets */ repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 15px,
      #000000 15px,
      #000000 25px,
      transparent 25px,
      transparent 50px
    ),
    /* Bottom row of sprockets */
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 15px,
        #000000 15px,
        #000000 25px,
        transparent 25px,
        transparent 50px
      ),
    /* Main film body */ linear-gradient(#000000, #000000);
  -webkit-mask-size: 100% 16px, 100% 16px, 100% 100%;
  -webkit-mask-position: 0 8px, 0 56px, 0 0;
  -webkit-mask-repeat: repeat-x, repeat-x, no-repeat;
  -webkit-mask-composite: destination-out, destination-out, source-over;
  animation: scrollFilmStripMask 10s linear infinite;

  mask-image: 
    /* Top row of sprockets */ repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 15px,
      #000000 15px,
      #000000 25px,
      transparent 25px,
      transparent 50px
    ),
    /* Bottom row of sprockets */
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 15px,
        #000000 15px,
        #000000 25px,
        transparent 25px,
        transparent 50px
      ),
    /* Main film body */ linear-gradient(#000000, #000000);
  mask-size: 100% 16px, 100% 16px, 100% 100%;
  mask-position: 0 8px, 0 56px, 0 0;
  mask-repeat: repeat-x, repeat-x, no-repeat;
  mask-composite: exclude, exclude, add;
}

/* Bottom film strip with perforations - Realistic Film Strip */
.film-strip::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #000000;
  border-top: 4px solid #000000;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.9);
  z-index: 2;

  /* Create actual sprocket hole cutouts */
  -webkit-mask-image: 
    /* Top row of sprockets */ repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 15px,
      #000000 15px,
      #000000 25px,
      transparent 25px,
      transparent 50px
    ),
    /* Bottom row of sprockets */
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 15px,
        #000000 15px,
        #000000 25px,
        transparent 25px,
        transparent 50px
      ),
    /* Main film body */ linear-gradient(#000000, #000000);
  -webkit-mask-size: 100% 16px, 100% 16px, 100% 100%;
  -webkit-mask-position: 0 8px, 0 56px, 0 0;
  -webkit-mask-repeat: repeat-x, repeat-x, no-repeat;
  -webkit-mask-composite: destination-out, destination-out, source-over;
  animation: scrollFilmStripMask 10s linear infinite;

  mask-image: 
    /* Top row of sprockets */ repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 15px,
      #000000 15px,
      #000000 25px,
      transparent 25px,
      transparent 50px
    ),
    /* Bottom row of sprockets */
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 15px,
        #000000 15px,
        #000000 25px,
        transparent 25px,
        transparent 50px
      ),
    /* Main film body */ linear-gradient(#000000, #000000);
  mask-size: 100% 16px, 100% 16px, 100% 100%;
  mask-position: 0 8px, 0 56px, 0 0;
  mask-repeat: repeat-x, repeat-x, no-repeat;
  mask-composite: exclude, exclude, add;
  animation: scrollFilmStripMask 10s linear infinite;
}

/* Film frame boxes - Vertical frame dividers like real film */
.hero-section::before {
  content: "";
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 160px);
  z-index: 1;
  pointer-events: none;

  /* Black background with rounded corners */
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0 0 0 0;

  /* Vertical frame dividers - thick black lines between frames */
  background-image: repeating-linear-gradient(
    90deg,
    #000000 0px,
    #000000 12px,
    transparent 12px,
    transparent 400px
  );

  background-size: 412px 100%;
  background-position: 0 0;
  animation: scrollFilmStripVertical 10s linear infinite;

  /* Clip path to create rounded corners that connect to strips */
  clip-path: inset(0 0 0 0 round 0 0 0 0);
}

@keyframes scrollFilmStrip {
  0% {
    background-position: 0 15px, 0 45px, 0 0;
  }
  100% {
    background-position: -50px 15px, -50px 45px, 0 0;
  }
}

@keyframes scrollFilmStripMask {
  0% {
    -webkit-mask-position: 0 8px, 0 56px, 0 0;
    mask-position: 0 8px, 0 56px, 0 0;
  }
  100% {
    -webkit-mask-position: -412px 8px, -412px 56px, 0 0;
    mask-position: -412px 8px, -412px 56px, 0 0;
  }
}

@keyframes scrollFilmStripVertical {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -412px 0;
  }
}

/* Hero Section */
.hero-section {
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.hero-content {
  animation: fadeInUp 1s ease-out;
  position: relative;
  z-index: 10;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  text-shadow: 0 4px 40px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
}

.title-line {
  display: inline-block;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1s ease-out 0.2s both;
}

.cta-container {
  animation: fadeInUp 1s ease-out 0.4s both;
}

/* Button Styles */
.btn-main {
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
  position: relative;
}

.btn-main:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.6);
}

.btn-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-main:hover .btn-gradient {
  opacity: 1;
}

.btn-secondary {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-4px) scale(1.02);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 60px rgba(255, 255, 255, 0.1);
}

/* Features Section */
.features-section {
  background: rgba(10, 14, 26, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
}

.section-divider {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  margin: 0 auto;
}

/* Feature Cards */
.feature-card {
  position: relative;
  height: 100%;
  transition: transform 0.4s ease;
}

.feature-card:hover {
  transform: scale(1.05);
}

.feature-card-inner {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 48px 36px;
  height: 100%;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.feature-card:hover .feature-card-inner {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.feature-number {
  font-size: 80px;
  font-weight: 900;
  color: rgb(90, 108, 213);
  position: absolute;
  top: 20px;
  right: 30px;
  line-height: 1;
}

.feature-icon-wrapper {
  margin-bottom: 32px;
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  transition: all 0.4s ease;
}

.feature-card:hover .feature-icon {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  transform: scale(1.1);
}

.feature-title {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
}

.feature-description {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  font-weight: 300;
  margin-bottom: 24px;
}

.feature-arrow {
  font-size: 32px;
  color: rgba(59, 130, 246, 0.4);
  transition: all 0.4s ease;
}

.feature-card:hover .feature-arrow {
  color: #3b82f6;
  transform: translateX(10px);
}

/* CTA Section */
.cta-section {
  background: rgba(10, 14, 26, 0.9);
  position: relative;
  z-index: 10;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 70%
  );
}

.btn-cta {
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
  transition: all 0.4s ease;
}

.btn-cta:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.6);
}

.btn-cta-secondary {
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
  transition: all 0.4s ease;
}

.btn-cta-secondary:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.6);
}
</style>
