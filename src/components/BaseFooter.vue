<template>
  <footer class="footer-bg mt-16">
    <div class="max-w-[1200px] mx-auto px-4 py-12">
      <!-- Top Section: Brand & Social -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-white/10">
        <!-- Brand Section -->
        <div class="md:col-span-1">
          <h3 class="text-3xl font-extrabold mb-4">
            <span class="brand-title">WatchBuddy</span>
          </h3>
          <p class="text-[#98a1b3] leading-relaxed mb-6">
            Discover, watch, and share your favorite movies and TV shows with friends. 
            Join watch parties and climb the leaderboard!
          </p>
          
          <!-- Social Media Icons -->
          <div class="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener" class="social-icon" aria-label="Facebook">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" class="social-icon" aria-label="Twitter">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" class="social-icon" aria-label="Instagram">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" class="social-icon" aria-label="YouTube">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="section-heading mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><router-link to="/" class="footer-link">Home</router-link></li>
            <li><router-link to="/movies" class="footer-link">Movies</router-link></li>
            <li><router-link to="/tv" class="footer-link">TV Shows</router-link></li>
            <li><router-link to="/watchparty" class="footer-link">Watch Party</router-link></li>
            <li><router-link to="/profile" class="footer-link">Profile</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="section-heading mb-4">Support</h4>
          <ul class="space-y-2">
            <li><a href="/contact" class="footer-link">Contact Us</a></li>
            <li><a href="/privacy" class="footer-link">Privacy Policy</a></li>
            <li><a href="/terms" class="footer-link">Terms of Service</a></li>
            <li><a href="/faq" class="footer-link">FAQ</a></li>
            <li><a href="/help" class="footer-link">Help Center</a></li>
          </ul>
        </div>
      </div>

      <!-- App Download Section -->
      <div class="text-center mb-12 pb-12 border-b border-white/10">
        <h3 class="text-2xl font-bold mb-3">
          <span class="section-title">Get the WatchBuddy App</span>
        </h3>
        <p class="text-[#98a1b3] mb-6">For Android and iOS</p>
        <div class="flex justify-center gap-4 flex-wrap">
          <a href="#" class="app-store-btn">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <div class="text-left">
              <div class="text-xs text-[#98a1b3]">Download on the</div>
              <div class="text-sm font-semibold">App Store</div>
            </div>
          </a>
          <a href="#" class="app-store-btn">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
            </svg>
            <div class="text-left">
              <div class="text-xs text-[#98a1b3]">Get it on</div>
              <div class="text-sm font-semibold">Google Play</div>
            </div>
          </a>
        </div>
      </div>

      <!-- Additional Links -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 class="section-heading mb-3">Company</h4>
          <ul class="space-y-2">
            <li><a href="/about" class="footer-link-small">About Us</a></li>
            <li><a href="/press" class="footer-link-small">Press Room</a></li>
            <li><a href="/careers" class="footer-link-small">Careers</a></li>
            <li><a href="/blog" class="footer-link-small">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="section-heading mb-3">Community</h4>
          <ul class="space-y-2">
            <li><a href="/guidelines" class="footer-link-small">Guidelines</a></li>
            <li><a href="/forums" class="footer-link-small">Forums</a></li>
            <li><a href="/events" class="footer-link-small">Events</a></li>
            <li><a href="/leaderboard" class="footer-link-small">Leaderboard</a></li>
          </ul>
        </div>
        <div>
          <h4 class="section-heading mb-3">Developers</h4>
          <ul class="space-y-2">
            <li><a href="/api" class="footer-link-small">API</a></li>
            <li><a href="/docs" class="footer-link-small">Documentation</a></li>
            <li><a href="/opensource" class="footer-link-small">Open Source</a></li>
            <li><a href="/partners" class="footer-link-small">Partners</a></li>
          </ul>
        </div>
        <div>
          <h4 class="section-heading mb-3">Legal</h4>
          <ul class="space-y-2">
            <li><a href="/privacy" class="footer-link-small">Privacy</a></li>
            <li><a href="/terms" class="footer-link-small">Terms</a></li>
            <li><a href="/cookies" class="footer-link-small">Cookies</a></li>
            <li><a href="/dmca" class="footer-link-small">DMCA</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-[#6b7280] text-sm text-center md:text-left">
            © {{ currentYear }} WatchBuddy, Inc. All rights reserved.
          </p>
          <p class="text-[#6b7280] text-xs text-center md:text-right">
            Movie data provided by <a href="https://www.themoviedb.org/" target="_blank" class="tmdb-link">The Movie Database (TMDB)</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
/* Footer Background - Metallic Dark Theme */
.footer-bg {
  background: radial-gradient(1200px 400px at 50% 0%, rgba(107,107,255,0.03), transparent 50%),
              linear-gradient(180deg, #0b1220 0%, #07080a 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

/* Subtle metallic texture overlay */
.footer-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(255,255,255,0.03) 0 1px,
    rgba(0,0,0,0) 1px 4px
  );
  pointer-events: none;
}

/* Brand Title with Gradient */
.brand-title {
  background: linear-gradient(90deg, #fff, #cfd8ff 40%, #8b5cf6 70%, #6b6bff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 900;
  letter-spacing: -0.02em;
}

/* Section Titles */
.section-title {
  background: linear-gradient(90deg, #fff, #cfd8ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
}

.section-heading {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

/* Social Icons */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2));
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #98a1b3;
  transition: all 0.3s cubic-bezier(.2,.9,.2,1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.social-icon:hover {
  background: linear-gradient(180deg, rgba(107,107,255,0.2), rgba(107,107,255,0.1));
  border-color: rgba(107, 107, 255, 0.4);
  color: #6b6bff;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(107,107,255,0.2);
}

/* Footer Links */
.footer-link {
  color: #98a1b3;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #6b6bff;
  transform: translateX(4px);
}

.footer-link-small {
  color: #6b7280;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-link-small:hover {
  color: #98a1b3;
  transform: translateX(3px);
}

/* App Store Buttons */
.app-store-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2));
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #eaf0ff;
  transition: all 0.3s cubic-bezier(.2,.9,.2,1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}

.app-store-btn:hover {
  background: linear-gradient(180deg, rgba(107,107,255,0.15), rgba(107,107,255,0.05));
  border-color: rgba(107, 107, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(107,107,255,0.15);
}

/* TMDB Link */
.tmdb-link {
  color: #6b6bff;
  font-weight: 500;
  transition: color 0.2s ease;
}

.tmdb-link:hover {
  color: #8b5cf6;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .brand-title {
    font-size: 1.75rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
  }
}
</style>