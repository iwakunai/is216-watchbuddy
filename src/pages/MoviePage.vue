<template>
  <BaseNavBar />
  <div class="movies-page">
    <main class="wrap">
      <h1 class="title">Movies <span class="dot">●</span></h1>

      <div v-if="loading" class="loader"><span></span> Loading…</div>
      <div v-else-if="error" class="msg error">Error: {{ error }}</div>
      <div v-else-if="movies.length === 0" class="msg">No movies found.</div>

      <ul v-else class="grid">
        <li
          v-for="(m, i) in movies"
          :key="m.id"
          class="card"
          :style="{ '--i': i }"
        >
          <div class="thumb">
            <img
              v-if="m.poster"
              :src="m.poster"
              :alt="m.title"
              @load="onImgLoad"
              class="img"
              loading="lazy"
            />
            <div class="skeleton"></div>
          </div>
          <div class="meta">
            <div class="name">{{ m.title }}</div>
            <div class="year">{{ m.year }}</div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
import { nextTick, watch, onMounted } from "vue";
import BaseNavBar from "@/components/BaseNavBar.vue";
import { useMovies } from "@/composables/useMovies";

const { movies, loading, error } = useMovies(); // defaults to local JSON

function onImgLoad(e) {
  e.target.classList.add("loaded");
}

// simple observer: add .visible when card is in view
function observeCards() {
  const els = document.querySelectorAll(".card:not(.visible)");
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          o.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => obs.observe(el));
}

watch(
  movies,
  async () => {
    await nextTick();
    observeCards();
  },
  { immediate: true }
);
onMounted(() => observeCards());
</script>

<style scoped>
:root {
  --accent: #6b6bff;
  --muted: #98a1b3;
  --card-bg: rgba(255, 255, 255, 0.02);
  --stagger: 70ms;
}

.movies-page {
  min-height: 100vh;
  background: linear-gradient(120deg, #071229, #0b1220);
  color: #eaf0ff;
  font-family: Inter, system-ui;
  padding: 40px 0;
}
.wrap {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}
.title {
  font-size: 1.9rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(90deg, #fff, #cfd8ff);
  -webkit-background-clip: text;
  color: transparent;
}
.dot {
  color: var(--accent);
  font-size: 0.9rem;
  opacity: 0.95;
  transition: transform 0.25s;
}
.title:hover .dot {
  transform: translateY(-6px) scale(1.08);
}

/* loader */
.loader {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  margin: 18px 0;
}
.loader span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.06);
  border-top-color: var(--accent);
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* grid + card */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 18px;
  padding: 0;
  list-style: none;
}
.card {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.03);
  transform: translateY(18px) scale(0.995);
  opacity: 0;
  transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.26, 1), opacity 0.45s;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
}
.card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: calc(var(--i) * var(--stagger));
}

/* hover */
.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.6);
  border-color: rgba(107, 107, 255, 0.14);
}

/* thumbnail */
.thumb {
  width: 72px;
  height: 104px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02),
    rgba(0, 0, 0, 0.04)
  );
}
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: blur(6px);
  opacity: 0;
  transform: scale(1.02);
  transition: filter 0.36s, opacity 0.36s, transform 0.36s;
}
.img.loaded {
  filter: none;
  opacity: 1;
  transform: scale(1);
}
.skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.03)
  );
  animation: pulse 1400ms infinite;
}
@keyframes pulse {
  0% {
    opacity: 0.16;
  }
  50% {
    opacity: 0.28;
  }
  100% {
    opacity: 0.16;
  }
}

/* meta text */
.meta {
  flex: 1;
  color: #eaf0ff;
}
.name {
  font-weight: 600;
}
.year {
  color: var(--muted);
  font-size: 0.92rem;
  margin-top: 4px;
}

/* messages */
.msg {
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.02);
}
.msg.error {
  background: rgba(255, 20, 20, 0.04);
  color: #ffb3b3;
}

/* responsive */
@media (max-width: 560px) {
  .thumb {
    width: 56px;
    height: 84px;
  }
  .title {
    font-size: 1.4rem;
  }
}
</style>

