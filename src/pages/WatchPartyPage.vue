<script setup lang="ts">
import { ref, computed } from 'vue'

const showModal = ref(false)
const partyName = ref('')
const partyDate = ref('')
const partyShow = ref('')
const inviteeText = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const allParties = ref<any[]>([])

function openModal() {
    showModal.value = true
}
function closeModal() {
    showModal.value = false
}

// Accepts optional custom message for toast notification
function copyPartyLink(partyId: number, message = "Party link copied to clipboard!") {
    const link = `${window.location.origin}/party/${partyId}`
    navigator.clipboard.writeText(link)
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
}

function submitParty() {
    const newParty = {
        id: Date.now(),
        name: partyName.value,
        date: partyDate.value,
        show: partyShow.value,
        invitees: inviteeText.value.split(',').map((v: string) => v.trim()).filter((v: string) => v)
    }
    allParties.value.push(newParty)
    closeModal()
    toastMessage.value = "New party created!"
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)

    partyName.value = ''
    partyDate.value = ''
    partyShow.value = ''
    inviteeText.value = ''
}

const upcomingParties = computed(() =>
  allParties.value.filter(party => new Date(party.date) >= new Date())
)

const pastParties = computed(() =>
  allParties.value.filter(party => new Date(party.date) < new Date())
)
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <!-- Toast popup -->
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600  px-6 py-3 rounded shadow-lg z-50">
      {{ toastMessage }}
    </div>

    <!-- Header -->
    <div class="mb-10 border-b pb-6">
      <h1 class="text-3xl font-bold mb-2">My Watch Parties</h1>
      <p class="mb-4 text-gray-600">Join or create watch parties with your friends!</p>
      <button @click="openModal" class="create-party-btn bg-blue-500 hover:bg-blue-600  py-2 px-4 rounded">+ Create New Party</button>
    </div>

    <!-- Upcoming Parties Section -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-3">Upcoming Parties</h2>
      <div v-if="upcomingParties.length === 0" class="bg-gray-50 p-5 rounded shadow text-gray-500">
        No upcoming parties to display. Check back later or create a new one!
      </div>
      <div v-else class="space-y-4">
        <div v-for="party in upcomingParties" :key="party.id" class="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="font-semibold text-lg">{{ party.name }}</h3>
            <p class="text-gray-600">{{ party.show }}</p>
            <p class="text-gray-500 text-sm">{{ new Date(party.date).toLocaleString() }}</p>
            <p class="text-gray-700 mt-2" v-if="party.invitees.length">Invitees: 
              <span v-for="user in party.invitees" :key="user" class="mr-1">@{{ user }}</span>
            </p>
          </div>
          <button @click="copyPartyLink(party.id)" class="mt-3 md:mt-0 bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded border border-gray-300">Copy Party Link</button>
        </div>
      </div>
    </section>

    <!-- Past Parties Section -->
    <section>
      <h2 class="text-xl font-semibold mb-3">Past Parties</h2>
      <div v-if="pastParties.length === 0" class="bg-gray-50 p-5 rounded shadow text-gray-500">
        No past parties to display.
      </div>
      <div v-else class="space-y-4">
        <div v-for="party in pastParties" :key="party.id" class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold text-lg">{{ party.name }}</h3>
          <p class="text-gray-600">{{ party.show }}</p>
          <p class="text-gray-500 text-sm">{{ new Date(party.date).toLocaleString() }}</p>
          <p class="text-gray-700 mt-2" v-if="party.invitees.length">Invitees: 
            <span v-for="user in party.invitees" :key="user" class="mr-1">@{{ user }}</span>
          </p>
        </div>
      </div>
    </section>
  </div>

  <!-- Create Party Modal -->
  <div v-if="showModal" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <div class="bg-white w-full max-w-md p-8 rounded shadow-lg relative">
      <h3 class="text-2xl font-bold mb-4">Create New Party</h3>
      <form @submit.prevent="submitParty">
        <div class="mb-3">
          <label class="block mb-1 font-medium">Party Name</label>
          <input v-model="partyName" required class="border rounded w-full p-2" placeholder="Enter party name" />
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium">Date/Time</label>
          <input v-model="partyDate" required type="datetime-local" class="border rounded w-full p-2"/>
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium">Show/Movie</label>
          <input v-model="partyShow" required class="border rounded w-full p-2" placeholder="Movie/Show title" />
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium">Invite friends (type <b>@username</b> or paste/copy link):</label>
          <input v-model="inviteeText" class="border rounded w-full p-2 mb-2" placeholder="@bob, @alice, ..." />
          <div class="mt-1 flex gap-2">
            <button type="button" @click="copyPartyLink(Date.now(), 'Invite link copied!')" class="text-blue-600 underline">Copy Invite Link</button>
            <span class="text-gray-500 text-xs">(Or share above link in chat)</span>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal" class="bg-gray-300 px-3 py-2 rounded">Cancel</button>
          <button type="submit" class="bg-blue-500  px-3 py-2 rounded">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
