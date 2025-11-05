import { supabase } from "./supabaseClient";
import { fetchSupabaseUserId } from "./supabaseUser";

export type WatchStatus = "completed" | "watching" | "plan-to-watch";
export type MediaType = "movie" | "tv";

export interface WatchlistItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: MediaType;
  status: WatchStatus;
  title: string;
  poster_path: string | null;
  year: number | null;
  added_at: string;
}

// Add or update an item in the user's watchlist
export async function addToWatchlist(
  clerkUserId: string,
  tmdbId: number,
  mediaType: MediaType,
  status: WatchStatus,
  title: string,
  posterPath: string | null,
  year: number | null
): Promise<void> {
  try {
    const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
    if (!supabaseUserId) {
      throw new Error("User not found in database");
    }

    // console.log('Adding to watchlist:', {
    //   supabaseUserId,
    //   tmdbId,
    //   mediaType,
    //   status,
    //   title
    // })

    // Check if item already exists
    const { data: existing, error: checkError } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", supabaseUserId)
      .eq("tmdb_id", tmdbId)
      .eq("media_type", mediaType)
      .single();

    // if (checkError && checkError.code !== 'PGRST116') {
    //   // PGRST116 is "not found" error, which is fine
    //   console.error('Error checking existing watchlist item:', checkError)
    //   throw new Error(`Database error: ${checkError.message}`)
    // }

    if (existing) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from("watchlist")
        .update({
          status,
          title,
          poster_path: posterPath,
          year,
        })
        .eq("user_id", supabaseUserId)
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType);

      if (updateError) {
        throw new Error(`Failed to update: ${updateError.message}`);
      }
    } else {
      // Insert new entry
      const { error: insertError } = await supabase.from("watchlist").insert({
        user_id: supabaseUserId,
        tmdb_id: tmdbId,
        media_type: mediaType,
        status,
        title,
        poster_path: posterPath,
        year,
      });

      if (insertError) {
        throw new Error(`Failed to add: ${insertError.message}`);
      }
      // console.log('Successfully added to watchlist')
    }
  } catch (err) {
    // console.error('Error adding to watchlist:', err)
    throw err;
  }
}

// Remove an item from the watchlist

export async function removeFromWatchlist(
  clerkUserId: string,
  tmdbId: number,
  mediaType: MediaType
): Promise<void> {
  try {
    const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
    if (!supabaseUserId) throw new Error("User not found");

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", supabaseUserId)
      .eq("tmdb_id", tmdbId)
      .eq("media_type", mediaType);

    if (error) throw error;
  } catch (err) {
    // console.error('Error removing from watchlist:', err)
    throw err;
  }
}

// Update the status of a watchlist item
export async function updateWatchlistStatus(
  clerkUserId: string,
  tmdbId: number,
  mediaType: MediaType,
  newStatus: WatchStatus
): Promise<void> {
  try {
    const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
    if (!supabaseUserId) throw new Error("User not found");

    const { error } = await supabase
      .from("watchlist")
      .update({ status: newStatus })
      .eq("user_id", supabaseUserId)
      .eq("tmdb_id", tmdbId)
      .eq("media_type", mediaType);

    if (error) throw error;
  } catch (err) {
    // console.error('Error updating watchlist status:', err)
    throw err;
  }
}

// Get watchlist status for a specific item

export async function getWatchlistStatus(
  clerkUserId: string,
  tmdbId: number,
  mediaType: MediaType
): Promise<WatchStatus | null> {
  try {
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
  } catch (err) {
    // console.error('Error getting watchlist status:', err)
    return null;
  }
}

/**
 * Get all watchlist items for a user
 */
export async function getUserWatchlist(
  clerkUserId: string,
  mediaType?: MediaType,
  status?: WatchStatus
): Promise<WatchlistItem[]> {
  try {
    const supabaseUserId = await fetchSupabaseUserId(clerkUserId);
    if (!supabaseUserId) return [];

    let query = supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", supabaseUserId)
      .order("added_at", { ascending: false });

    if (mediaType) {
      query = query.eq("media_type", mediaType);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error("Error getting user watchlist:", err);
    return [];
  }
}
