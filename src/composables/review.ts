import { computed } from "vue";

export interface Review {
  id: string;
  showId: number;
  userId: string | null;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  source: "user" | "tmdb";
}

export function formatVoteCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}