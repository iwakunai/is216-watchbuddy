<template>
  <div class="flex flex-col md:flex-row items-center ml-1 md:m-3" @click="toggleDropdown" @blur="closeDropdown" tabindex="0">
    <UserButton>
        <UserButton.MenuItems>
            <UserButton.Link label="Profile" href="/profile"> 
                <template #labelIcon>
                </template>
            </UserButton.Link>
            <UserButton.Link label="Friends" href="/friends"> 
                <template #labelIcon>
                </template>
            </UserButton.Link>
            <UserButton.Action label="manageAccount"/>
            <UserButton.Action label="signOut"/>
        </UserButton.MenuItems>
    </UserButton>
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
