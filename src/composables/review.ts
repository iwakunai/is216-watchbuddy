export interface Review {
  id: string;
  movieId: number;
  userId: string | null;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  source: "user" | "tmdb";
}