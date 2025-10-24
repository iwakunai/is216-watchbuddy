// REMOVE THIS AFTER INTEGRATING SUPABASE

import { defineStore } from 'pinia';
import { ref } from "vue";

export type Room = {
    roomid: string
    name: string
    movie: string
    datetime: string
    joined: number
    tags: string[]
    mood: string[]
}

export const useUserStore = defineStore('user', ()=> {
    const userInfo = ref({
        id: 1,
        username: 'yiting',
        joinedParties: [] as Room[],
        createdParties: [] as Room[],
    });

    const selectedMood = ref<string | null>(null)

    function toggleJoin(room: Room) {
        const idx = userInfo.value.joinedParties.findIndex(p => p.roomid === room.roomid)
        if (idx === -1) {
            userInfo.value.joinedParties.push(room)
        } else {
            userInfo.value.joinedParties.splice(idx,1)
        }
    }

    function createParty(room: Room){
        if (!userInfo.value.createdParties.find(p => p.roomid === room.roomid)){
            userInfo.value.createdParties.push(room);
        }
    }
    return { userInfo, selectedMood, toggleJoin, createParty };
});