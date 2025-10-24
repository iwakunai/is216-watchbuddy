<template>
  <header>
    <SignedOut>
      <SignInButton />
    </SignedOut>

    <SignedIn>
      <UserButton />
    </SignedIn>
  </header>
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/vue";
</script>

<style scoped></style>
