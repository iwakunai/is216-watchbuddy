<!-- TODO: Debug and refactor -->

<script setup lang="ts">
// @ts-nocheck remove when typed
import BaseNavBar from "@/components/BaseNavBar.vue";
import { ref, computed } from "vue";

const currentUser = ref("my_username");

const showModal = ref(false);
const partyName = ref("");
const partyDate = ref("");
const partyShow = ref("");
const inviteeText = ref("");
const isPublicParty = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const allParties = ref([]);
const liveChatPartyId = ref(null);
const joinedPublicIds = ref([]);

const demoPublicParties = ref([
  {
    id: 9001,
    name: "One Piece Marathon",
    show: "One Piece",
    date: new Date(Date.now() + 3600 * 1000 * 4).toISOString(),
    public: true,
  },
  {
    id: 9002,
    name: "Horror Night",
    show: "The Conjuring",
    date: new Date(Date.now() + 3600 * 1000 * 6).toISOString(),
    public: true,
  },
]);

function openModal() {
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

function showNotification(msg) {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 2000);
}

function copyPartyLink(partyId, msg = "Party link copied to clipboard!") {
  const link = window.location.origin + "/party/" + partyId;
  navigator.clipboard.writeText(link);
  showNotification(msg);
}

function submitParty() {
  const newParty = {
    id: Date.now(),
    name: partyName.value,
    date: partyDate.value,
    show: partyShow.value,
    invitees: inviteeText.value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v),
    public: isPublicParty.value,
  };
  allParties.value.push(newParty);
  showNotification("New party created!");
  closeModal();
  partyName.value = "";
  partyDate.value = "";
  partyShow.value = "";
  inviteeText.value = "";
  isPublicParty.value = false;
}

const now = ref(new Date());
setInterval(() => (now.value = new Date()), 10000);

const upcomingParties = computed(() =>
  allParties.value.filter((p) => new Date(p.date) >= now.value)
);

const pastParties = computed(() =>
  allParties.value.filter((p) => new Date(p.date) < now.value)
);

function isPartyNow(date) {
  const partyTime = new Date(date).getTime();
  const nowTime = new Date().getTime();
  const windowMs = 20 * 60 * 1000;
  return Math.abs(nowTime - partyTime) < windowMs;
}

function joinPartyLive(partyId) {
  liveChatPartyId.value = partyId;
  showNotification("Joined party. Live chat started!");
}

const chatMessages = ref([]);
const chatInput = ref("");

function sendMessage() {
  if (chatInput.value.trim() !== "") {
    chatMessages.value.push({
      user: currentUser.value,
      text: chatInput.value.trim(),
    });
    chatInput.value = "";
    setTimeout(() => {
      const chatBox = document.getElementById("chat-messages-box");
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 0);
  }
}

function closeChat() {
  liveChatPartyId.value = null;
  chatMessages.value = [];
}

const publicParties = computed(() =>
  demoPublicParties.value.filter(
    (party) =>
      !joinedPublicIds.value.includes(party.id) &&
      new Date(party.date) >= now.value
  )
);

function joinPublicParty(party) {
  allParties.value.push({ ...party, invitees: [], public: true });
  joinedPublicIds.value.push(party.id);
  showNotification("Joined public party!");
}
</script>

<template>
    <div>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>