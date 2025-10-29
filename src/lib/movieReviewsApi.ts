import { supabase } from "@/lib/supabaseClient";
import { fetchSupabaseUserId } from "@/lib/supabaseUser";

interface Review {
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

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

export async function fetchReviews(movieId: number): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("movie_reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("movie_review_created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    const userReviews = (data || []).map((r: any) => ({
      id: r.review_uuid,
      movieId: r.movie_id,
      userId: r.user_id,
      userName: r.username ?? "Anonymous",
      userAvatar: r.user_avatar ?? null,
      rating: r.movie_user_rating,
      comment: r.movie_user_review,
      createdAt: r.movie_review_created_at,
      source: "user" as const,
    }));

    let tmdbReviews: Review[] = [];
    if (TMDB_API_KEY) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`
        );
        if (response.ok) {
          const tmdbData = await response.json();
          tmdbReviews = (tmdbData.results || []).slice(0, 5).map((r: any) => ({
            id: r.id,
            movieId,
            userId: null,
            userName: r.author_details.username || r.author,
            userAvatar: null,
            rating: r.author_details.rating || 0,
            comment: r.content,
            createdAt: r.created_at,
            source: "tmdb" as const,
          }));
        }
      } catch (e) {
        console.warn("Failed to fetch TMDB reviews:", e);
      }
    }

    return [...userReviews, ...tmdbReviews];
  } catch (e) {
    console.error("Unexpected error fetching reviews:", e);
    return [];
  }
}

export async function submitReview(
  movieId: number,
  clerkUserId: string | null = null,
  rating: number,
  comment: string
): Promise<Review | null> {
  console.log(clerkUserId);

  if (!clerkUserId) throw new Error("User not authenticated.");

  const userId = await fetchSupabaseUserId(clerkUserId);
  if (!userId) throw new Error("User record not found.");

  const { data, error } = await supabase
    .from("movie_reviews")
    .insert([
      {
        movie_id: movieId,
        user_id: userId,
        movie_user_rating: rating,
        movie_user_review: comment,
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("You have already reviewed this movie!");
    } else {
      throw error;
    }
  }

  return data
    ? {
        id: data.review_uuid,
        movieId: data.movie_id,
        userId: data.user_id,
        userName: data.username ?? "Anonymous",
        userAvatar: data.user_avatar ?? null,
        rating: data.movie_user_rating,
        comment: data.movie_user_review,
        createdAt: data.movie_review_created_at,
        source: "user",
      }
    : null;
}
