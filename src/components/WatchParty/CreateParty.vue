<template>
    <form action="">
        <div class="bg-white/5 p-4 rounded-lg text-center shadow-md w-sm"> 
            <!-- HEADING -->
            <div>
                <h2 class="text-2xl font-semibold mb-4">Create Party</h2>
            </div>
            <!-- PARTY NAME -->
            <div class="text-left mb-4"> 
                <label for="party-name" class="block text-md/6 font-medium text-gray-900 dark:text-white">Party Name</label>
                <div class="mt-2">
                    <input id="party-name" type="text" placeholder="Enter Party Name" name="party-name" 
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500" />
                </div>
            </div>

            <!-- MOVIE/SHOW -->
            <div class="text-left mb-4">
                <label for="movie-show" class="block text-md/6 font-medium text-gray-900 dark:text-white">Movie/Show</label>
                <div class="mt-2">
                    <input id="movie-show" type="text" placeholder="Enter Movie Name" name="movie-show" 
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500" />
                </div>
            </div>

            <!-- DATE TIME -->
            <div class="text-left mb-4">
                <label for="party-datetime" class="block text-md/6 font-medium text-gray-900 dark:text-white">Date Time</label>
                <div class="mt-2">
                    <input id="flatpickr-date-time" type="datetime" placeholder="YYYY-MM-DD HH:MM" name="party-datetime" 
                    class="input block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500" />
                </div>
            </div>
            <!-- TO DO: DATETIME PICKER -->
            <!-- https://flyonui.com/docs/third-party-plugins/flatpickr/#datetime-picker -->

            <!-- PUBLIC PRIVATE -->
            <div class="flex gap-10 mb-4">
                <div class="inline-flex items-center">
                    <label class="relative flex items-center cursor-pointer" for="public-party">
                        <input name="framework" type="radio" class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="public-party" checked>
                        <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 dark:bg-white transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        </span>
                    </label>
                    <label class="ml-2 text-slate-600 cursor-pointer text-sm dark:text-white" for="public-party">Public</label>
                </div>
                
                <div class="inline-flex items-center">
                    <label class="relative flex items-center cursor-pointer" for="private-party">
                        <input name="framework" type="radio" class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="private-party">
                        <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 dark:bg-white transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        </span>
                    </label>
                    <label class="ml-2 text-slate-600 cursor-pointer text-sm dark:text-white" for="private-party">Private</label>
                </div>
            </div>

            <!-- MOOD -->
            <div class="text-left mb-4">
                <label for="party-mood" class="block text-md/6 font-medium text-gray-900 dark:text-white">Mood</label>
                <div class="mt-2">
                    <input id="party-mood" type="text" placeholder="Select Mood" name="party-mood" 
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500" />
                </div>
            </div>

        </div>
    </form>
    
</template>

<script setup lang="ts">

</script>

<style scoped>
</style>