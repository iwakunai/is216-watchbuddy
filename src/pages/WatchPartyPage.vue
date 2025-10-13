<script setup lang="ts">
import BaseNavBar from '@/components/BaseNavBar.vue';
import { ref, computed } from 'vue'

const currentUser = ref('my_username')

const showModal = ref(false)
const partyName = ref('')
const partyDate = ref('')
const partyShow = ref('')
const inviteeText = ref('')
const isPublicParty = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const allParties = ref([])
const liveChatPartyId = ref(null)
const joinedPublicIds = ref([])

const demoPublicParties = ref([
  { id: 9001, name: 'One Piece Marathon', show: 'One Piece', date: new Date(Date.now() + 3600*1000*4).toISOString(), public: true },
  { id: 9002, name: 'Horror Night', show: 'The Conjuring', date: new Date(Date.now() + 3600*1000*6).toISOString(), public: true },
])

function openModal() { showModal.value = true }
function closeModal() { showModal.value = false }

function showNotification(msg) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 2000)
}

function copyPartyLink(partyId, msg = "Party link copied to clipboard!") {
  const link = window.location.origin + '/party/' + partyId
  navigator.clipboard.writeText(link)
  showNotification(msg)
}

function submitParty() {
  const newParty = {
    id: Date.now(),
    name: partyName.value,
    date: partyDate.value,
    show: partyShow.value,
    invitees: inviteeText.value.split(',').map(v => v.trim()).filter(v => v),
    public: isPublicParty.value
  }
  allParties.value.push(newParty)
  showNotification("New party created!")
  closeModal()
  partyName.value = ''
  partyDate.value = ''
  partyShow.value = ''
  inviteeText.value = ''
  isPublicParty.value = false
}

const now = ref(new Date())
setInterval(() => now.value = new Date(), 10000)

const upcomingParties = computed(() =>
  allParties.value.filter(p => new Date(p.date) >= now.value)
)

const pastParties = computed(() =>
  allParties.value.filter(p => new Date(p.date) < now.value)
)

function isPartyNow(date) {
  const partyTime = new Date(date).getTime()
  const nowTime = new Date().getTime()
  const windowMs = 20 * 60 * 1000
  return Math.abs(nowTime - partyTime) < windowMs
}

function joinPartyLive(partyId) {
  liveChatPartyId.value = partyId
  showNotification("Joined party. Live chat started!")
}

const chatMessages = ref([])
const chatInput = ref('')

function sendMessage() {
  if(chatInput.value.trim() !== '') {
    chatMessages.value.push({ user: currentUser.value, text: chatInput.value.trim() })
    chatInput.value = ''
    setTimeout(() => {
      const chatBox = document.getElementById('chat-messages-box')
      if(chatBox) chatBox.scrollTop = chatBox.scrollHeight
    }, 0)
  }
}

function closeChat() {
  liveChatPartyId.value = null
  chatMessages.value = []
}

const publicParties = computed(() =>
  demoPublicParties.value.filter(party =>
    !joinedPublicIds.value.includes(party.id) && new Date(party.date) >= now.value
  )
)

function joinPublicParty(party) {
  allParties.value.push({ ...party, invitees: [], public: true })
  joinedPublicIds.value.push(party.id)
  showNotification("Joined public party!")
}
</script>

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
  <BaseNavBar />
  <div class="max-w-4xl mx-auto p-8">
    <!-- Toast popup -->
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600  px-6 py-3 rounded shadow-lg z-50">
      {{ toastMessage }}
    </div>


    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 px-6 py-3 rounded shadow-lg z-50">
      {{ toastMessage }}
    </div>

    <div class="mb-10 border-b pb-6">
      <h1 class="text-3xl font-bold mb-2">My Watch Parties</h1>
      <p class="mb-4 text-gray-600">Join or create watch parties with your friends!</p>
      <button @click="openModal" class="create-party-btn bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded">
        + Create New Party
      </button>
    </div>

    <!-- Public Parties -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-3">Public Parties</h2>
      <div v-if="publicParties.length === 0" class="bg-gray-50 p-5 rounded shadow text-gray-500">
        No public parties available at the moment.
      </div>
      <div v-else class="space-y-4">
        <div v-for="party in publicParties" :key="party.id" class="bg-yellow-50 p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between border border-yellow-200">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-lg text-yellow-900">{{ party.name }}</h3>
              <span class="text-xs font-bold rounded bg-green-100 text-green-700 px-2 py-1">Public</span>
            </div>
            <p class="text-gray-700">{{ party.show }}</p>
            <p class="text-gray-500 text-sm">{{ new Date(party.date).toLocaleString() }}</p>
          </div>
          <button @click="joinPublicParty(party)" class="mt-2 md:mt-0 bg-yellow-400 hover:bg-yellow-500  px-4 py-2 rounded font-semibold">
            Join
          </button>
        </div>
      </div>
    </section>

    <!-- Upcoming Parties -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-3">Upcoming Parties</h2>
      <div v-if="upcomingParties.length === 0" class="bg-gray-50 p-5 rounded shadow text-gray-500">
        No upcoming parties to display. Check back later or create a new one!
      </div>
      <div v-else class="space-y-4">
        <div v-for="party in upcomingParties" :key="party.id" class="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-lg">{{ party.name }}</h3>
              <span v-if="party.public" class="text-xs font-bold rounded bg-green-100 text-green-700 px-2 py-1">
                Public
              </span>
              <span v-else class="text-xs font-bold rounded bg-gray-200 text-gray-600 px-2 py-1">
                Private
              </span>
            </div>
            <p class="text-gray-600">{{ party.show }}</p>
            <p class="text-gray-500 text-sm">{{ new Date(party.date).toLocaleString() }}</p>
            <p v-if="party.invitees.length" class="text-gray-700 mt-2">
              Invitees:
              <span v-for="user in party.invitees" :key="user" class="mr-1">@{{ user }}</span>
            </p>
          </div>
          <div class="flex flex-col gap-2 mt-3 md:mt-0">
            <button @click="copyPartyLink(party.id)" class="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded border border-gray-300">
              Copy Party Link
            </button>
            <button v-if="isPartyNow(party.date) && liveChatPartyId !== party.id" @click="joinPartyLive(party.id)" class="bg-green-500 px-4 py-1 rounded">
              Join Live Chat
            </button>
          </div>
        </div>
      </div>

      <!-- Live Chat Popover -->
      <div v-if="liveChatPartyId" class="fixed bottom-8 right-8 z-40 w-[500px] h-[420px] max-w-full bg-white rounded shadow-lg border border-green-500 flex flex-col">
        <div class="flex justify-between items-center px-4 py-2 border-b bg-green-50">
          <span class="font-bold text-green-700">Live Chat</span>
          <button @click="closeChat" class="text-gray-400 hover:text-black text-xl font-bold">&times;</button>
        </div>
        <div id="chat-messages-box" class="p-4 flex-1 overflow-y-auto flex flex-col">
          <div v-if="chatMessages.length === 0" class="text-gray-400 text-sm flex-1">No messages yet.</div>
          <div v-for="(msg, i) in chatMessages" :key="i" class="my-2 flex flex-col items-end">
            <span class="font-semibold text-blue-700 mb-1">{{ msg.user }}</span>
            <span class="bg-green-100 px-4 py-2 rounded-xl max-w-[75%] text-gray-900 text-right shadow">{{ msg.text }}</span>
          </div>
        </div>
        <form class="flex items-center gap-2 px-4 py-2 border-t" @submit.prevent="sendMessage">
          <input v-model="chatInput" class="border rounded flex-1 px-2 py-2" placeholder="Type a message..." autocomplete="off" />
          <button type="submit" class="bg-green-500 rounded px-4 py-2">Send</button>
        </form>
      </div>
    </section>

    <!-- Past Parties -->
    <section>
      <h2 class="text-xl font-semibold mb-3">Past Parties</h2>
      <div v-if="pastParties.length === 0" class="bg-gray-50 p-5 rounded shadow text-gray-500">
        No past parties to display.
      </div>
      <div v-else class="space-y-4">
        <div v-for="party in pastParties" :key="party.id" class="bg-white p-4 rounded shadow">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-lg">{{ party.name }}</h3>
            <span v-if="party.public" class="text-xs font-bold rounded bg-green-100 text-green-700 px-2 py-1">Public</span>
            <span v-else class="text-xs font-bold rounded bg-gray-200 text-gray-600 px-2 py-1">Private</span>
          </div>
          <p class="text-gray-600">{{ party.show }}</p>
          <p class="text-gray-500 text-sm">{{ new Date(party.date).toLocaleString() }}</p>
          <p v-if="party.invitees.length" class="text-gray-700 mt-2">
            Invitees:
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
          <input v-model="partyDate" required type="datetime-local" class="border rounded w-full p-2" />
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium">Show/Movie</label>
          <input v-model="partyShow" required class="border rounded w-full p-2" placeholder="Movie/Show title" />
        </div>
        <div class="mb-3">
          <label>
            <input type="checkbox" v-model="isPublicParty" class="mr-2" />
            Make party public (open for anyone to join)
          </label>
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
          <button type="submit" class="bg-blue-500 px-3 py-2 rounded">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
