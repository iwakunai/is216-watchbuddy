import type {
  MediaType,
  WatchlistItem,
  WatchStatus,
} from "@/composables/watchlist";
import { supabase } from "@/lib/supabaseClient";
import { fetchSupabaseUserId } from "@/lib/supabaseUser";

// Individual Item (Movie/Tv) CRUD

// Fetch individual item status
export async function getWatchlistStatus(
  clerkUserId: string,
  tmdbId: string,
  mediaType: MediaType
): Promise<WatchStatus | null> {
  const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
  if (!supabaseUserId) return null;

  const { data, error } = await supabase
    .from("watchlist")
    .select("status")
    .eq("user_id", supabaseUserId)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data?.status || null;
}

// Add item to user watchlist 
export async function addToWatchlist(
  clerkUserId: string,
  tmdbId: string,
  mediaType: MediaType,
  status: WatchStatus,
  title: string,
  posterPath: string | null,
  year: number | null
): Promise<void> {
  const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
  if (!supabaseUserId) throw new Error("User not found in database");

  // Check for existence in user watchlist
  const exist = await getWatchlistStatus(clerkUserId, tmdbId, mediaType);

  // If does not exist, add to watchlist
  if (exist == null) {
    const { error } = await supabase.from("watchlist").insert({
      user_id: supabaseUserId,
      tmdb_id: tmdbId,
      media_type: mediaType,
      status,
      title,
      poster_path: posterPath,
      year,
    });

    if (error) throw error;
  // else update item status
  } else {
    await updateWatchlistStatus(clerkUserId, tmdbId, mediaType, status);
  }
}

// Update item status
export async function updateWatchlistStatus(
  clerkUserId: string,
  tmdbId: string,
  mediaType: MediaType,
  newStatus: WatchStatus
): Promise<void> {
  const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
  if (!supabaseUserId) throw new Error("User not found");

  const { error } = await supabase
    .from("watchlist")
    .update({ status: newStatus })
    .eq("user_id", supabaseUserId)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType);

  if (error) throw error;
}

// Remove item from watchlist
export async function removeFromWatchlist(
  clerkUserId: string,
  tmdbId: string,
  mediaType: MediaType
): Promise<void> {
  const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
  if (!supabaseUserId) throw new Error("User not found");

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", supabaseUserId)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType);

  if (error) throw error;
}

// All of user's watchlist items

// Get all items
export async function getUserWatchlist(
  clerkUserId: string,
  mediaType?: MediaType,
  status?: WatchStatus
): Promise<WatchlistItem[]> {
  const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
  if (!supabaseUserId) return [];

  let query = supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", supabaseUserId)
    .order("added_at", { ascending: false });

  if (mediaType) query = query.eq("media_type", mediaType);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}
