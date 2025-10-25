<template>
  <!-- User Signed Out -->
  <SignedOut>
    <SignInButton>
      <button
        class="nav-link"
      >
        Login
      </button>
    </SignInButton>
    <SignUpButton>
      <button
        class="nav-link"
      >
        Sign Up
      </button>
    </SignUpButton>
  </SignedOut>

  <!-- User Signed In -->
  <SignedIn>
    <BaseUserButton />
  </SignedIn>
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/vue";
</script>

<style scoped></style>
