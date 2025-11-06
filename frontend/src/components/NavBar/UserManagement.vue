<template>
  <!-- Base (Mobile) -->
  <div class="flex flex-col md:hidden items-center justify-center">
    <!-- User Signed Out -->
    <SignedOut class="flex flex-col md:hidden items-center justify-center">
      <SignInButton>
        <button class="nav-link">Login</button>
      </SignInButton>
      <SignUpButton>
        <button class="nav-link">Sign Up</button>
      </SignUpButton>
    </SignedOut>
  </div>

  <!-- Medium ++ -->
  <div class="hidden md:block">
    <!-- User Signed Out -->
    <SignedOut>
      <SignInButton>
        <button class="nav-link">Login</button>
      </SignInButton>
      <SignUpButton>
        <button class="nav-link">Sign Up</button>
      </SignUpButton>
    </SignedOut>

    <!-- Profile Button for signed in users -->
    <ProfileButton />
  </div>
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/vue";
</script>

<style scoped></style>
