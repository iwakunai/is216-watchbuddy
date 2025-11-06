<template>
  <div>
    <!-- User Signed In -->
    <SignedIn>
      <BaseUserButton />
    </SignedIn>
  </div>
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/vue";
</script>
