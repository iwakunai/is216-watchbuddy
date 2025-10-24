<template>
    <BaseNavBar />
    <MoodSelector />
    <WatchPartyList />
    <SearchBar />
    <div class="flex gap-5 mt-10">
        <CreateParty />
        <UserParty />
    </div>
    <PartyRoom />
    <BaseFooter />
</template>

<script setup lang="ts">
import BaseNavBar from "@/components/BaseNavBar.vue";
import MoodSelector from '@/components/WatchParty/MoodSelector.vue';
import WatchPartyList from '@/components/WatchParty/WatchPartyList.vue';
import CreateParty from '@/components/WatchParty/CreateParty.vue';
import UserParty from '@/components/WatchParty/UserParty.vue';
import SearchBar from '@/components/WatchParty/SearchBar.vue';
import BaseFooter from '@/components/BaseFooter.vue';
</script>

<style scoped>
</style>