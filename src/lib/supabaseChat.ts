// src/lib/supabaseChat.ts
import { supabase } from './supabaseClient';

export async function sendMessage(roomId: string, username: string, text: string) {
    const { data, error } = await supabase
        .from('pr_messages') // updated table name
        .insert([{ room_id: parseInt(roomId), username, text }]) // match table columns
        .select();

    if (error) throw error;
    return data;
}

export async function fetchMessages(roomId: string) {
    const { data, error } = await supabase
        .from('pr_messages') // updated table name
        .select(`
            id,
            text,
            created_at,
            username
        `)
        .eq('room_id', parseInt(roomId))
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

export function subscribeToMessages(roomId: string, callback: (msg: any) => void) {
    const subscription = supabase
        .channel(`room-${roomId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'pr_messages', // updated table name
                filter: `room_id=eq.${parseInt(roomId)}`
            },
            (payload) => callback(payload.new)
        )
        .subscribe();

    return subscription;
}
