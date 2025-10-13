<template>
    <div>
        Home
    </div>
    <BaseNavBar />
    <BaseSearchBar />
    <Trending />
    <HomeMood />
    <WatchParty />
    <Leaderboard />
</template>

<script setup lang="ts">
import BaseNavBar from '@/components/BaseNavBar.vue';
import BaseSearchBar from '@/components/BaseSearchBar.vue';
import HomeMood from '@/components/HomeMood.vue';
import Leaderboard from '@/components/Leaderboard.vue';
import Trending from '@/components/Trending.vue';
import WatchParty from '@/components/WatchParty.vue';


</script>

<style scoped>

</style>