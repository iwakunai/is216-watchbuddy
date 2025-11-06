<template>
  <!-- Enhanced Background with Wave Effects -->
  <div class="background-container">
    <!-- Animated Gradient Mesh -->
    <div class="gradient-mesh"></div>
    
    <!-- Particle Background -->
    <div ref="particlesRef" class="particle-container"></div>
    
    <!-- Animated Wave Lines -->
    <div class="wave-container">
      <svg class="wave wave-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="url(#gradient1)"/>
      </svg>
      <svg class="wave wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,70 Q300,20 600,70 T1200,70 L1200,120 L0,120 Z" fill="url(#gradient2)"/>
      </svg>
      <svg class="wave wave-3" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,90 Q300,40 600,90 T1200,90 L1200,120 L0,120 Z" fill="url(#gradient3)"/>
      </svg>
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(168, 85, 247, 0.1);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(59, 130, 246, 0.1);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(139, 92, 246, 0.08);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(168, 85, 247, 0.08);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(59, 130, 246, 0.06);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(139, 92, 246, 0.06);stop-opacity:1" />
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
  <div class="relative min-h-screen flex items-center justify-center text-white overflow-hidden hero-section">
    <!-- Film Strip Effect - Moved here so it scrolls with content -->
    <div class="film-strip"></div>
    
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <!-- Main Heading with Stagger Animation -->
      <div class="hero-content">
        <h1 class="hero-title text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
          <span class="title-line">Your Social Movie</span><br />
          <span class="title-line gradient-text">Watching Experience</span>
        </h1>
        
        <!-- Subtitle -->
        <p class="hero-subtitle text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Host synchronized watch parties, discover personalized recommendations, 
          <br class="hidden md:block"/>
          and share reviews with a vibrant community
        </p>
        
        <!-- CTA Buttons -->
        <div class="cta-container flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            @click="navigate('/movies')"
            class="btn-main group relative px-12 py-6 bg-purple-600 text-white text-lg font-bold rounded-2xl transition-all overflow-hidden"
          >
            <span class="relative z-10 flex items-center gap-3">
              <span class="text-2xl">🎬</span>
              <span>Browse Movies</span>
            </span>
            <div class="btn-gradient"></div>
          </button>
          <button
            @click="navigate('/recommend')"
            class="btn-secondary group relative px-12 py-6 bg-transparent text-white text-lg font-bold rounded-2xl transition-all border-2 border-white/20 backdrop-blur-md hover:border-white/40"
          >
            <span class="flex items-center gap-3">
              <span class="text-2xl">✨</span>
              <span>Get Recommendations</span>
            </span>
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
        <h2 class="text-5xl md:text-7xl font-black mb-8 gradient-text">Everything You Need</h2>
        <div class="section-divider"></div>
        <p class="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light mt-8">
          Transform how you experience movies
        </p>
      </div>
      
      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <!-- Watch Parties -->
        <div 
          @click="$router.push('/watchparty')"
          class="feature-card group cursor-pointer"
        >
          <div class="feature-card-inner">
            <div class="feature-number">01</div>
            <div class="feature-icon-wrapper">
              <div class="feature-icon">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 class="feature-title">Watch Parties</h3>
            <p class="feature-description">
              Synchronized viewing with real-time chat and interactive features for the ultimate shared experience
            </p>
            <div class="feature-arrow">→</div>
          </div>
        </div>
        
        <!-- Smart Recommendations -->
        <div 
          @click="$router.push('/recommend')"
          class="feature-card group cursor-pointer"
        >
          <div class="feature-card-inner">
            <div class="feature-number">02</div>
            <div class="feature-icon-wrapper">
              <div class="feature-icon">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <h3 class="feature-title">Smart Recommendations</h3>
            <p class="feature-description">
              AI-powered suggestions tailored to your taste, mood, and viewing history
            </p>
            <div class="feature-arrow">→</div>
          </div>
        </div>
        
        <!-- Reviews & Community -->
        <div 
          @click="$router.push('/movies')"
          class="feature-card group cursor-pointer"
        >
          <div class="feature-card-inner">
            <div class="feature-number">03</div>
            <div class="feature-icon-wrapper">
              <div class="feature-icon">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h3 class="feature-title">Vibrant Community</h3>
            <p class="feature-description">
              Share reviews, discover perspectives, and connect with passionate movie enthusiasts
            </p>
            <div class="feature-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- CTA Section -->
  <div class="cta-section text-white py-32 relative overflow-hidden">
    <div class="cta-bg"></div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 class="text-5xl md:text-7xl font-black mb-10">Ready to Start?</h2>
      <p class="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-16 font-light">
        Join thousands of movie lovers transforming their viewing experience
      </p>
      <button
        @click="$router.push('/movies')"
        class="btn-cta group relative px-16 py-7 bg-white text-gray-900 text-xl font-bold rounded-2xl transition-all overflow-hidden"
      >
        <span class="relative z-10 flex items-center gap-3">
          <span>Get Started Now</span>
          <svg class="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const particlesRef = ref<HTMLDivElement | null>(null);

const navigate = (path: string) => {
  router.push(path);
};

// Particle attraction to mouse
const handleMouseMove = (e: MouseEvent) => {
  const particles = particlesRef.value?.querySelectorAll('.particle');
  particles?.forEach((particle, index) => {
    if (index % 3 === 0) {
      const htmlParticle = particle as HTMLElement;
      const rect = htmlParticle.getBoundingClientRect();
      const particleX = rect.left + rect.width / 2;
      const particleY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - particleX;
      const deltaY = e.clientY - particleY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < 200) {
        const force = (200 - distance) / 200;
        htmlParticle.style.transform = `translate(${deltaX * force * 0.3}px, ${deltaY * force * 0.3}px)`;
      } else {
        htmlParticle.style.transform = 'translate(0, 0)';
      }
    }
  });
};

// Create particles
const createParticles = () => {
  if (!particlesRef.value) return;
  const particleCount = 60;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = `float ${Math.random() * 6 + 6}s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 3 + 's';
    particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particlesRef.value.appendChild(particle);
  }
};

onMounted(() => {
  createParticles();
  document.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
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
  background: 
    radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #0a0e1a 0%, #1a1f35 50%, #0f1629 100%);
  animation: gradientShift 20s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.9; }
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
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-50px); }
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
  background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%);
  top: -20%;
  right: -10%;
  animation: floatShape 25s ease-in-out infinite;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  bottom: -10%;
  left: -10%;
  animation: floatShape 30s ease-in-out infinite reverse;
}

.shape-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  animation: floatShape 35s ease-in-out infinite;
}

@keyframes floatShape {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(100px, -100px) rotate(120deg); }
  66% { transform: translate(-100px, 50px) rotate(240deg); }
}

/* Film Strip Effect - Realistic Film Strip with Frame Boxes */
.film-strip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

/* Top sprocket bar with realistic perforations */
.film-strip::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background: linear-gradient(180deg, #1a1820 0%, #0f0d12 100%);
  border-bottom: 2px solid #2a2530;
  
  /* Sprocket holes pattern - rectangular perforations */
  background-image: 
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 20px,
      #6b46c1 20px,
      #6b46c1 22px,
      #8b5cf6 22px,
      #8b5cf6 38px,
      #6b46c1 38px,
      #6b46c1 40px,
      transparent 40px,
      transparent 60px
    );
  background-size: 60px 24px;
  background-position: 0 33px;
  animation: scrollFilmStrip 30s linear infinite;
  
  z-index: 2;
}

/* Bottom sprocket bar with realistic perforations */
.film-strip::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background: linear-gradient(0deg, #1a1820 0%, #0f0d12 100%);
  border-top: 2px solid #2a2530;
  
  /* Sprocket holes pattern - rectangular perforations */
  background-image: 
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 20px,
      #6b46c1 20px,
      #6b46c1 22px,
      #8b5cf6 22px,
      #8b5cf6 38px,
      #6b46c1 38px,
      #6b46c1 40px,
      transparent 40px,
      transparent 60px
    );
  background-size: 60px 24px;
  background-position: 0 33px;
  animation: scrollFilmStrip 30s linear infinite;
  
  z-index: 2;
}

/* Film frame boxes in the middle */
.hero-section::before {
  content: '';
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 160px);
  z-index: 1;
  pointer-events: none;
  
  /* Frame boxes with borders - looks like actual film frames */
  background-image: 
    /* Vertical frame dividers */
    repeating-linear-gradient(
      90deg,
      #2a2530 0px,
      #2a2530 8px,
      transparent 8px,
      transparent 180px,
      #2a2530 180px,
      #2a2530 188px,
      transparent 188px,
      transparent 360px
    ),
    /* Inner frame borders (left side of each frame) */
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 8px,
      rgba(42, 37, 48, 0.6) 8px,
      rgba(42, 37, 48, 0.6) 14px,
      transparent 14px,
      transparent 180px
    ),
    /* Inner frame borders (right side of each frame) */
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 174px,
      rgba(42, 37, 48, 0.6) 174px,
      rgba(42, 37, 48, 0.6) 180px,
      transparent 180px,
      transparent 360px
    );
  
  background-size: 360px 100%, 180px 100%, 180px 100%;
  background-position: 0 0, 0 0, 0 0;
  animation: scrollFilmStrip 30s linear infinite;
  
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
}

@keyframes scrollFilmStrip {
  0% { 
    background-position: 0 33px, 0 0, 0 0;
  }
  100% { 
    background-position: -360px 33px, -360px 0, -180px 0;
  }
}

/* Particle Background */
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  pointer-events: none;
  transition: transform 0.3s ease;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-40px) rotate(180deg); }
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
  color: #800080;
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
  box-shadow: 0 10px 40px rgba(168, 85, 247, 0.4);
  position: relative;
}

.btn-main:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 60px rgba(168, 85, 247, 0.6);
}

.btn-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
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
  background: linear-gradient(90deg, transparent, #a855f7, transparent);
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
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 20px 60px rgba(168, 85, 247, 0.2);
}

.feature-number {
  font-size: 80px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
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
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a855f7;
  transition: all 0.4s ease;
}

.feature-card:hover .feature-icon {
  background: rgba(168, 85, 247, 0.2);
  border-color: rgba(168, 85, 247, 0.4);
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
  color: rgba(168, 85, 247, 0.4);
  transition: all 0.4s ease;
}

.feature-card:hover .feature-arrow {
  color: #a855f7;
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
  background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
}

.btn-cta {
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
}

.btn-cta:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 20px 60px rgba(255, 255, 255, 0.3);
}
</style>
