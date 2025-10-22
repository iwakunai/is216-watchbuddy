<template>
    <BaseNavBar /> 
    <!-- TODO: Move BaseSearchBar into BaseNavBar ?-->
    <BaseSearchBar />
    <Trending />
    <HomeMood />
    <WatchPartyList />
    <Leaderboard />
    <BaseFooter />
</template>

<script setup lang="ts">
import BaseNavBar from '@/components/BaseNavBar.vue';
import BaseSearchBar from '@/components/BaseSearchBar.vue';
import HomeMood from '@/components/HomeMood.vue';
import Leaderboard from '@/components/Leaderboard.vue';
import Trending from '@/components/Trending.vue';
import WatchPartyList from '@/components/WatchParty/WatchPartyList.vue';
import BaseFooter from '@/components/BaseFooter.vue';


</script>

<style scoped>

</style>