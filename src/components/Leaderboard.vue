<template>
    <div class="px-6 my-8">
        <h2 class="text-2xl font-semibold mb-4">Leaderboard</h2>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left w-12">#</th>
                        <th class="px-4 py-3 text-left">User</th>
                        <th class="px-4 py-3 text-right">Points</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="(user, index) in topUsers" 
                        :key="user.id"
                        class="border-t hover:bg-gray-50 transition"
                    >
                        <td class="px-4 py-3 font-semibold text-gray-700">{{ index + 1 }}</td>
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <div class="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                                    {{ user.initials }}
                                </div>
                                <div class="text-left">
                                    <p class="font-medium leading-5">{{ user.name }}</p>
                                    <p class="text-sm text-gray-500">{{ user.watched }} watched</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-right font-semibold">{{ user.points }} pts</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type LeaderboardUser = {
    id: number
    name: string
    initials: string
    watched: number
    points: number
}

const topUsers = ref<LeaderboardUser[]>([
    { id: 1, name: 'Lisa Lim', initials: 'LL', watched: 124, points: 1520 },
    { id: 2, name: 'Brenda Lee', initials: 'BL', watched: 110, points: 1410 },
    { id: 3, name: 'Drizzy Divy', initials: 'DD', watched: 98, points: 1315 },
    { id: 4, name: 'Yu Jia', initials: 'YJ', watched: 87, points: 1180 },
    { id: 5, name: 'Evan Ong', initials: 'EO', watched: 76, points: 1055 },
])
</script>

<style scoped>

</style>