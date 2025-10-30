<template>
    <BaseNavBar />
    <div class="min-h-screen app-bg text-[#eaf0ff]">
        <Headers
            :view="currentView"
            :currentStatus="statusFilter"
            @open-create="openCreateParty"
            @toggle-view="toggleView"
            @status-filter="statusFilter = $event"
        />
        <WatchPartyList
            :view="currentView"
            :status-filter="statusFilter"
        />
        <CreateParty v-if="showCreateParty" @close="closeCreateParty"/>
        <BaseFooter />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseNavBar from "@/components/NavBar/BaseNavBar.vue";
import Headers from "@/components/WatchParty/Header.vue";
import WatchPartyList from "@/components/WatchParty/WatchPartyList.vue";
import CreateParty from "@/components/WatchParty/CreateParty.vue";
import BaseFooter from "@/components/BaseFooter.vue";

const showCreateParty = ref(false);
const currentView = ref<'card' | 'list'>('card');
const statusFilter = ref<'all' | 'waiting' | 'playing' | 'scheduled'>('all');

function openCreateParty() {
    showCreateParty.value = true;
}

function closeCreateParty() {
    showCreateParty.value = false;
}

function toggleView(view: 'card' | 'list') {
    currentView.value = view;
}
</script>

<style scoped>
/* Background */
.app-bg {
  background: radial-gradient(1200px 400px at 10% 10%, rgba(255,255,255,0.02), transparent 8%),
              radial-gradient(800px 300px at 90% 80%, rgba(107,107,255,0.02), transparent 6%),
              linear-gradient(180deg, #07080a 0%, #0b1220 50%, #05060a 100%);
  position: relative;
  overflow: hidden;
}
</style>