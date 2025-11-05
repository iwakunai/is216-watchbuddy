<template>
  <div
    class="flex flex-col md:flex-row items-center ml-1 md:m-3"
    @click="toggleDropdown"
    @blur="closeDropdown"
    tabindex="0"
  >
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link label="Profile" href="/profile">
          <template #labelIcon
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M12 12a5 5 0 100-10 5 5 0 000 10z"
              />
            </svg>
          </template>
        </UserButton.Link>
        <!-- <UserButton.Link label="Friends" href="/friends">
          <template #labelIcon> </template>
        </UserButton.Link> -->
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserButton, useAuth } from "@clerk/vue";

const isOpen = ref(false);
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
const closeDropdown = () => {
  isOpen.value = false;
};

const { signOut } = useAuth();
</script>
