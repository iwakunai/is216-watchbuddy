import { supabase } from "@/lib/supabaseClient";

// Join a room: insert or update a user in the room.
export async function joinRoom(roomId: string, userId: string, username: string) {
    const { data, error } = await supabase
        .from("party_room_user")
        .upsert(
        {
            room_id: roomId,
            user_id: userId,
            user_username: username,
            joined_at: new Date().toISOString(),
        },
        {
            onConflict: "room_id,user_id", // avoid duplicate entry
        }
        )
        .select();

    if (error) {
        throw error;
    }
    return data?.[0];
}

// Leave a room: delete from party_room_user.
export async function leaveRoom(roomId: string, userId: string) {
    const { error } = await supabase
        .from("party_room_user")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }
}

// Fetch all current users in a room.
export async function fetchRoomUsers(roomId: string) {
    const { data, error } = await supabase
        .from("party_room_user")
        .select("user_id, user_username, joined_at")
        .eq("room_id", roomId);

    if (error) {
        throw error;
    }

    return data.map((u) => ({
        id: u.user_id,
        name: u.user_username,
        initial: u.user_username?.[0]?.toUpperCase() || "?",
        joinedAt: u.joined_at,
    }));
}


// Real-time presence listener for party_room_user table.
// Automatically triggers callback when someone joins or leaves the room.
export function subscribeRoomUsers(roomId: string, callback: (users: any[]) => void) {
  const channel = supabase
    .channel(`room-users-${roomId}`)
    // INSERT = someone joined
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'party_room_user',
        filter: `room_id=eq.${roomId}`,
      },
      async () => {
        const users = await fetchRoomUsers(roomId);
        callback(users);
      }
    )
    // DELETE = someone left
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'party_room_user',
      },
      async (payload) => {
        if (!payload.old?.room_id || payload.old.room_id === roomId) {
          const users = await fetchRoomUsers(roomId);
          callback(users);
        }
      }
    )
    .subscribe();

  return channel;
}

