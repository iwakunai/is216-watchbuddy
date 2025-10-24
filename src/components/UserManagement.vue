<template>
    <SignedOut>
      <SignInButton/>
      <button>Out Test Button</button>
    </SignedOut>
    <SignedIn>
      <UserButton/>
      <button>In Test Button</button>
    </SignedIn>
    <!-- <button>Test Button</button> -->
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue';


</script>

<style scoped></style>
