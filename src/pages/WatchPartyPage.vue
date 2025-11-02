<template>
  <BaseNavBar />
  <Header
    :view="currentView"
    :currentStatus="statusFilter"
    @open-create="openCreateParty"
    @toggle-view="toggleView"
    @status-filter="statusFilter = $event"
    @search="onSearch"
  />

  <WatchPartyList
    ref="watchPartyListRef"
    :view="currentView"
    :status-filter="statusFilter"
    :search-query="searchQuery"
  />
  <CreateParty
    v-if="showCreateParty"
    @close="closeCreateParty"
    @created="onRoomCreated"
  />

  <BaseFooter />
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseNavBar from "@/components/NavBar/BaseNavBar.vue";
import Headers from "@/components/WatchParty/Header.vue";
import WatchPartyList from "@/components/WatchParty/WatchPartyList.vue";
import CreateParty from "@/components/WatchParty/CreateParty.vue";
import BaseFooter from "@/components/BaseFooter.vue";

const showCreateParty = ref(false);
const currentView = ref<"card" | "list">("card");
const statusFilter = ref<"all" | "playing" | "scheduled" | "ended">("all");
const searchQuery = ref("");
const watchPartyListRef: any = ref(null);

function onRoomCreated() {
  if (watchPartyListRef.value?.loadRooms) {
    watchPartyListRef.value.loadRooms();
  }

  closeCreateParty();
}

function openCreateParty() {
  showCreateParty.value = true;
}

function closeCreateParty() {
  showCreateParty.value = false;
}

function toggleView(view: "card" | "list") {
  currentView.value = view;
}

function onSearch(value: string) {
  searchQuery.value = value;
}
</script>

<style scoped></style>
