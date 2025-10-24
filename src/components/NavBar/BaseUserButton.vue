<template>
  <div class="relative" @click="toggleDropdown" @blur="closeDropdown" tabindex="0">
    <UserButton>
        <UserButton.MenuItems>
            <UserButton.Link label="Profile" href="/profile"> 
                <template #labelIcon>
                </template>
            </UserButton.Link>
            <UserButton.Action label="manageAccount"/>
            <UserButton.Action label="signOut"/>
        </UserButton.MenuItems>
    </UserButton>

    <!-- <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
      <a href="/profile" class="block px-4 py-2 hover:bg-gray-200">Profile</a>
      <button @click="signOut" class="block w-full text-left px-4 py-2 hover:bg-gray-200">Sign Out</button>
      
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserButton, useAuth } from '@clerk/vue';

const isOpen = ref(false);
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
const closeDropdown = () => {
  isOpen.value = false;
};

const { signOut } = useAuth();
</script>
