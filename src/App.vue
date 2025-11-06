<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { fetchInitialTime, startSubscription, stopSubscription } from '@/lib/currentTimeApi';
import GlobalCursor from '@/components/GlobalCursor.vue';

onMounted(() => {
  fetchInitialTime();
  startSubscription();
});

onUnmounted(() => {
  stopSubscription();
});
</script>

<template>
  <GlobalCursor />
  <RouterView />
</template>

<style>
/* Hide default cursor globally */
* {
  cursor: none !important;
}
</style>
