<template>
  <!-- Custom Cursors -->
  <div ref="cursorRef" class="cursor"></div>
  <div ref="followerRef" class="cursor-follower"></div>
  <div ref="glowRef" class="glow-effect"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const cursorRef = ref<HTMLDivElement | null>(null);
const followerRef = ref<HTMLDivElement | null>(null);
const glowRef = ref<HTMLDivElement | null>(null);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let animationFrameId: number;

// Custom cursor movement
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  if (cursorRef.value) {
    cursorRef.value.style.left = mouseX + 'px';
    cursorRef.value.style.top = mouseY + 'px';
  }
  
  if (glowRef.value) {
    glowRef.value.style.left = mouseX + 'px';
    glowRef.value.style.top = mouseY + 'px';
  }
};

// Smooth follower animation
const animateFollower = () => {
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;
  
  if (followerRef.value) {
    followerRef.value.style.left = followerX + 'px';
    followerRef.value.style.top = followerY + 'px';
  }
  
  animationFrameId = requestAnimationFrame(animateFollower);
};

// Hover effects for interactive elements
const addHoverEffects = () => {
  const updateHoverClass = () => {
    const elements = document.querySelectorAll('button, a, .card, input, select, textarea, [role="button"]');
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRef.value?.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorRef.value?.classList.remove('hover');
      });
    });
  };
  
  updateHoverClass();
  
  // Re-run after a delay to catch dynamically added elements
  const observer = new MutationObserver(() => {
    updateHoverClass();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

onMounted(() => {
  animateFollower();
  document.addEventListener('mousemove', handleMouseMove);
  setTimeout(addHoverEffects, 100);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* Custom Cursor - Popcorn */
.cursor {
  width: 32px;
  height: 32px;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease, filter 0.1s ease;
  transform: translate(-50%, -50%);
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  will-change: transform;
}

.cursor::before {
  content: '🍿';
  display: block;
}

.cursor.hover {
  transform: translate(-50%, -50%) scale(1.5) rotate(20deg);
  filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.8));
}

/* .cursor-follower {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(168, 85, 247, 0.4);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
  will-change: transform;
} */

/* Glow Effect */
.glow-effect {
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 2;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  will-change: transform;
}
</style>
