import { supabase } from "@/lib/supabaseClient";
import { fetchSupabaseUserId } from "@/lib/supabaseUser";
import type { Review } from '@/composables/review';


const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

// Movies Section
export async function fetchMovieReviews(movieId: number): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("movie_reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("movie_review_created_at", { ascending: false });

    if (error) {
      
      return [];
    }

    const userReviews: Review[] = (data || []).map((r: any) => ({
      reviewId: r.review_uuid,
      showId: r.movie_id,
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
            showId: movieId,
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
        
      }
    }

    return [...userReviews, ...tmdbReviews];
  } catch (e) {
    
    return [];
  }
}

export async function submitMovieReview(
  movieId: number,
  clerkUserId: string | null = null,
  rating: number,
  comment: string
): Promise<Review | null> {

  if (!clerkUserId) throw new Error("Login to submit a review!");

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
        reviewId: data.review_uuid,
        showId: data.movie_id,
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

// TV Section
export async function fetchTvReviews(tvId: number): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("tv_reviews")
      .select("*")
      .eq("tv_id", tvId)
      .order("tv_review_created_at", { ascending: false });

    if (error) {
      
      return [];
    }

    const userReviews: Review[] = (data || []).map((r: any) => ({
      reviewId: r.review_uuid,
      showId: r.tv_id,
      userId: r.user_id,
      userName: r.username ?? "Anonymous",
      userAvatar: r.user_avatar ?? null,
      rating: r.tv_user_rating,
      comment: r.tv_user_review,
      createdAt: r.tv_review_created_at,
      source: "user" as const,
    }));

    let tmdbReviews: Review[] = [];
    if (TMDB_API_KEY) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/reviews?api_key=${TMDB_API_KEY}`
        );
        if (response.ok) {
          const tmdbData = await response.json();
          tmdbReviews = (tmdbData.results || []).slice(0, 5).map((r: any) => ({
            id: r.id,
            showId: tvId,
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
        
      }
    }

    return [...userReviews, ...tmdbReviews];
  } catch (e) {
    
    return [];
  }
}

export async function submitTvReview(
  tvId: number,
  clerkUserId: string | null = null,
  rating: number,
  comment: string
): Promise<Review | null> {

  if (!clerkUserId) throw new Error("Login to submit a review!");

  const userId = await fetchSupabaseUserId(clerkUserId);
  if (!userId) throw new Error("User record not found.");

  const { data, error } = await supabase
    .from("tv_reviews")
    .insert([
      {
        tv_id: tvId,
        user_id: userId,
        tv_user_rating: rating,
        tv_user_review: comment,
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("You have already reviewed this TV series!");
    } else {
      throw error;
    }
  }

  return data
    ? {
        reviewId: data.review_uuid,
        showId: data.tv_id,
        userId: data.user_id,
        userName: data.username ?? "Anonymous",
        userAvatar: data.user_avatar ?? null,
        rating: data.tv_user_rating,
        comment: data.tv_user_review,
        createdAt: data.tv_review_created_at,
        source: "user",
      }
    : null;
}
