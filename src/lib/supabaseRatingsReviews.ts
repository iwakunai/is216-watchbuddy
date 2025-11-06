import { supabase } from "@/lib/supabaseClient";
import { fetchSupabaseUserId } from "@/lib/supabaseUser";
import { getMovieDetails, getTVShowDetails } from "@/lib/tmdbFetch";
import type { CombinedReview } from "@/composables/review";

export async function getUserMovieReviews(
  userId: string
): Promise<CombinedReview[]> {
  try {
    // Retrieve user reviews
    const { data, error } = await supabase
      .from("movie_reviews")
      .select("*")
      .eq("user_id", userId)
      .order("movie_review_created_at", { ascending: false });

    if (error) throw error;

    return await Promise.all(
      (data || []).map(async (review: any) => {
        const movie = await getMovieDetails(review.movie_id);
        return {
          id: review.review_uuid,
          tmdb_id: review.movie_id,
          title: movie?.title || `Movie ${review.movie_id}`,
          media_type: "movie",
          year: movie?.year || 0,
          poster_path: movie?.poster || null,
          poster: movie?.poster || undefined,
          rating: review.movie_user_rating || 0,
          review_text: review.movie_user_review || "",
          created_at: review.movie_review_created_at,
          reviewedDate: new Date(
            review.movie_review_created_at
          ).toLocaleDateString("en-SG", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          overview: movie?.overview || "",
          vote_average: movie?.rating || 0,
          runtime: movie?.runtime || 0,
          genres: movie?.genres || [],
        };
      })
    );
  } catch (err) {
    return [];
  }
}

export async function getUserTvReviews(
  userId: string
): Promise<CombinedReview[]> {
  try {
    // Retrieve user reviews
    const { data, error } = await supabase
      .from("tv_reviews")
      .select("*")
      .eq("user_id", userId)
      .order("tv_review_created_at", { ascending: false });

    if (error) throw error;

    return await Promise.all(
      (data || []).map(async (review: any) => {
        const tv = await getTVShowDetails(review.tv_id);
        return {
          id: review.review_uuid,
          tmdb_id: review.tv_id,
          title: tv?.title || `TV ${review.tv_id}`,
          media_type: "tv",
          year: tv?.year || 0,
          poster_path: tv?.poster || null,
          poster: tv?.poster || undefined,
          rating: review.tv_user_rating || 0,
          review_text: review.tv_user_review || "",
          created_at: review.tv_review_created_at,
          reviewedDate: new Date(
            review.tv_review_created_at
          ).toLocaleDateString("en-SG", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          overview: tv?.overview || "",
          vote_average: tv?.rating || 0,
          // runtime: tv?.runtime || 0,
          genres: tv?.genres || [],
        };
      })
    );
  } catch (err) {
    return [];
  }
}

/**
 * Fetch all reviews (movies + TV shows) for a specific user
 * @param clerkUserId - The Clerk user ID
 * @param mediaType - Optional filter: 'movie', 'tv', or 'all'
 * @returns Array of combined review items
 */
export async function getUserReviews(
  clerkUserId: string,
  mediaType: "movie" | "tv" | "all" = "all"
): Promise<CombinedReview[]> {
  try {
    // Convert Clerk ID to Supabase UUID
    const userId = await fetchSupabaseUserId(clerkUserId);
    if (!userId) {
      return [];
    }

    let reviews: CombinedReview[] = [];

    // Fetch based on filter
    if (mediaType === "all" || mediaType === "movie") {
      const movieReviews = await getUserMovieReviews(userId);
      reviews = [...reviews, ...movieReviews];
    }

    if (mediaType === "all" || mediaType === "tv") {
      const tvReviews = await getUserTvReviews(userId);
      reviews = [...reviews, ...tvReviews];
    }

    // Sort by date (most recent first)
    reviews.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return reviews;
  } catch (err) {
    return [];
  }
}

/**
 * Delete a movie review
 * @param clerkUserId - The Clerk user ID
 * @param reviewId - The UUID of the review to delete
 */
export async function deleteMovieReview(
  clerkUserId: string,
  reviewId: string
): Promise<void> {
  console.log(reviewId)
  try {
    const userId = await fetchSupabaseUserId(clerkUserId);

    console.log(userId)
    const { error } = await supabase
      .from("movie_reviews")
      .delete()
      .eq("review_uuid", reviewId)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  } catch (err) {
    throw err;
  }
}

/**
 * Delete a TV review
 * @param clerkUserId - The Clerk user ID
 * @param reviewId - The UUID of the review to delete
 */
export async function deleteTvReview(
  clerkUserId: string,
  reviewId: string
): Promise<void> {
  try {
    const userId = await fetchSupabaseUserId(clerkUserId);

    const { error } = await supabase
      .from("tv_reviews")
      .delete()
      .eq("review_uuid", reviewId)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  } catch (err) {
    throw err;
  }
}
