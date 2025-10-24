<template>
  <Toolbar class="mt-3 w-full h-1/4">
    <template #start>
      <div class="flex items-center gap-2 w-1/5 h-full">
          <RouterLink to="/">
            <Image
              src="/images/logo/logo.png"
              imageClass="rounded-lg w-auto h-1/4"
            />
          </RouterLink>
      </div>
    </template>

    <template #center>
      <div class="flex items-center gap-2 w-3/5">
        <ButtonGroup>
          <Button variant="link rounded" class="w-full">
            <RouterLink to="/movies">Movies</RouterLink>
          </Button>
          <Button variant="link rounded" class="w-full">
            <RouterLink to="/tv">TV</RouterLink>
          </Button>
        </ButtonGroup>
      </div>
    </template>

    <template #end>
      <div class="flex items-center gap-2 w-1/5">
          <UserManagement/>
      </div>
    </template>
  </Toolbar>
</template>

<script setup lang="ts"></script>
