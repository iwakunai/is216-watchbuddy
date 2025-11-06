<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { fetchInitialTime, startSubscription, stopSubscription } from '@/lib/currentTimeApi';

onMounted(() => {
  fetchInitialTime();
  startSubscription();
});

onUnmounted(() => {
  stopSubscription();
});
</script>

<template>
  <RouterView />
</template>

<style>
</style>
