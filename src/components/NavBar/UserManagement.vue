<template>
    <SignedOut>
      <SignInButton/>
    </SignedOut>
    <SignedIn>
      <BaseUserButton />
    </SignedIn>
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue';


</script>

<style scoped></style>
