<template>
    <BaseNavBar />
    <HomeMood />
    <WatchPartyList />
    <!-- <CreateParty /> -->
    <BaseFooter />
</template>

<script setup lang="ts">
import BaseNavBar from "@/components/BaseNavBar.vue";
import HomeMood from '@/components/HomeMood.vue';
import WatchPartyList from '@/components/WatchParty/WatchPartyList.vue';
import CreateParty from '@/components/WatchParty/CreateParty.vue';
import BaseFooter from '@/components/BaseFooter.vue';
</script>

<style scoped>
</style>