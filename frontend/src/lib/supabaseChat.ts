import { supabase } from "@/lib/supabaseClient";

export async function sendMessage(
  roomId: string,
  user_clerk_id: string,
  text: string
) {
  const { data, error } = await supabase
    .from("pr_messages")
    .insert([{ room_id: roomId, user_clerk_id, text }]) // match table columns
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchMessages(roomId: string) {
  const { data, error } = await supabase
    .from("pr_messages")
    .select(
      `
            id,
            text,
            created_at,
            user_clerk_id,
            users: user_clerk_id (username, profile_image_url)
        `
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export function subscribeToMessages(
  roomId: string,
  callback: (msg: any) => void
) {
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
          .select("username, profile_image_url")
          .eq("clerk_id", newMsg.user_clerk_id)
          .single();

        callback({
          id: newMsg.id,
          text: newMsg.text,
          user: {
            id: newMsg.user_clerk_id,
            name: userData?.username || "Unknown",
            initial: userData?.username?.[0]?.toUpperCase() || "?",
            profile_image_url: userData?.profile_image_url || null,
          },
        });
      }
    )
    .subscribe();

  return subscription;
}
