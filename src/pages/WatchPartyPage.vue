<template>
  <BaseNavBar />
  <Header
    :currentStatus="statusFilter"
    @open-create="openCreateParty"
    @status-filter="statusFilter = $event"
    @search="onSearch"
  />

  <WatchPartyList
    ref="watchPartyListRef"
    :status-filter="statusFilter"
    :search-query="searchQuery"
  />
  <CreateParty
    v-if="showCreateParty"
    @close="closeCreateParty"
    @created="onRoomCreated"
  />

  <!-- <BaseFooter /> -->
</template>

<script setup lang="ts">
import { ref } from "vue";

const showCreateParty = ref(false);
const statusFilter = ref<"all" | "playing" | "scheduled">("all");
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

function onSearch(value: string) {
  searchQuery.value = value;
}
</script>

<style scoped></style>
