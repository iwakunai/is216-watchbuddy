import { supabase } from '@/lib/supabaseClient';
import type { Room } from '@/composables/room'; 

export async function fetchPublicRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('party_rooms')
    .select('id, room_name, title, host_username, scheduled_time, duration, vibe, poster_url')
    .eq('public_status', true)
    .order('scheduled_time', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((r: any) => ({
    roomid: r.id,
    name: r.room_name,
    movie: r.title,
    host: r.host_username || "Unknown",
    datetime: r.scheduled_time,
    duration: r.duration ?? 120,
    vibeId: r.vibe,
    posterUrl: r.poster_url ?? "",
  }));
}

export interface CreateRoomParams {
  roomName: string;
  hostId: string;
  title: string;
  scheduledTime: string; // ISO
  duration: number;
  publicStatus: boolean;
  vibeId?: string;
  posterUrl?: string;
}

export async function createRoom(params: CreateRoomParams): Promise<Room | null> {
  const { data, error } = await supabase
    .from('party_rooms')
    .insert([
      {
        room_name: params.roomName,
        host_id: params.hostId,
        title: params.title,
        scheduled_time: params.scheduledTime,
        duration: params.duration,
        public_status: params.publicStatus,
        vibe: params.vibeId,
        poster_url: params.posterUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    roomid: data.id,
    name: data.room_name,
    movie: data.title,
    host: data.host_username || 'Unknown',
    datetime: data.scheduled_time,
    duration: data.duration ?? 120,
    vibeId: data.vibe,
    posterUrl: data.poster_url ?? "",
  };
}