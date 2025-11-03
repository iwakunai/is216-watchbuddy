<template>
    <BaseNavBar /> 
    <!-- TODO: Move BaseSearchBar into BaseNavBar ?-->
    <!-- <BaseSearchBar /> -->
    <Trending />
    <HomeMood />
    <WatchPartyList 
    view="card"
    status-filter="playing"
    search-query=""/>
    <!-- <Leaderboard /> -->
    <!-- <BaseFooter /> -->
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>