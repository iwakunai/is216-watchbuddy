import type { WatchlistItem } from '@/composables/watchlist'
import { supabase } from '@/lib/supabaseClient'

// Set the current user context for RLS policies
export const setUserContext = async (userId: string) => {
  await supabase.rpc('set_config', {
    name: 'app.user_id',
    value: userId
  })
}

// WATCHLIST OPERATIONS
export const getWatchlist = async (userId: string) => {
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })
  
  if (error) throw error
  return data as WatchlistItem[]
}

export const addToWatchlist = async (item: WatchlistItem) => {
  const { data, error } = await supabase
    .from('watchlist')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const removeFromWatchlist = async (userId: string, tmdbId: number, mediaType: 'movie' | 'tv') => {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
  
  if (error) throw error
}

// WATCH HISTORY OPERATIONS
export async function fetchWatchpartyHistory() {
  const { data, error } = await supabase
  .from("wp_history")
  .select(`
    id,
    room_id,
    last_joined_at,
    created_at,
    party_rooms:room_id (
      room_name,
      title,
      poster_url,
      scheduled_time,
      duration
    )
  `)
  .order("last_joined_at", { ascending: false });

  if (error) throw error;
  return data;
}