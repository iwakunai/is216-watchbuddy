import { computed } from "vue";

export interface Review {
  reviewId: string;
  showId: number;
  userId: string | null;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  source: "user" | "tmdb";
}

export interface CombinedReview {
  id: string
  tmdb_id: number
  title: string
  media_type: 'movie' | 'tv'
  year: number
  poster_path: string | null
  poster: string | undefined
  rating: number
  review_text: string
  created_at: string
  reviewedDate: string
}

export function formatVoteCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}