<template>
    <div class="search py-2 bg-gray-50">
        <form action="/search" id="inner_search_form">
            <label class="inner_search_wrapper">
                <input type="text" name="query" placeholder="Search...">
            </label>


            <input type="submit" value="Search" role="button" data-role="button">
        </form>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>