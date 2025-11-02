// src/lib/supabaseChat.ts
import { supabase } from './supabaseClient';

export async function sendMessage(roomId: string, user_clerk_id: string, text: string) {
    const { data, error } = await supabase
        .from('pr_messages') // updated table name
        .insert([{ room_id: roomId, user_clerk_id, text }]) // match table columns
        .select()
        .single();

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
            user_clerk_id,
            users: user_clerk_id (username)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

    console.log('fetchMessages data:', data, 'error:', error); // debug

    if (error) throw error;
    return data;
}

export function subscribeToMessages(roomId: string, callback: (msg: any) => void) {
  const subscription = supabase
    .channel(`room-${roomId}`)
    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "pr_messages",
            filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
            // Attach username dynamically
            const newMsg = payload.new;
            const { data: userData } = await supabase
                .from("users")
                .select("username")
                .eq("clerk_id", newMsg.user_clerk_id)
                .single();

            callback({
                id: newMsg.id,
                text: newMsg.text,
                user: {
                    id: newMsg.user_clerk_id,
                    name: userData?.username || "Unknown",
                    initial: userData?.username?.[0]?.toUpperCase() || "?",
                },
            });
        }
    )
    .subscribe();

  return subscription;
}
