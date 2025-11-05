export type MediaType = 'movie' | 'tv'

export type WatchStatus = "completed" | "watching" | "plan-to-watch";

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
  updated_at: string;
}

export interface WatchItem {
  id: string
  title: string
  type: MediaType
  year?: number
  poster?: string
  addedAt?: string
  status?: 'completed' | 'watching' | 'plan-to-watch'
}

export interface MovieItem {
  id: string | number
  title: string
  type: MediaType
  year: number
  poster?: string
  poster_path?: string
}