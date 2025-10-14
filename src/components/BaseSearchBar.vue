<template>
    <div class="search py-2 bg-gray-300 text-black">
        <form action="/search" id="inner_search_form">
            <label class="inner_search_wrapper text-black">
                <input type="text" name="query" placeholder="Search...">
            </label>

      <input type="submit" value="Search" role="button" data-role="button" />
    </form>
  </div>
</template>

<script setup lang="ts">
// TODO: Fix logic
// TODO: Fix styles/ add button for search
</script>

<style scoped>
</style>
