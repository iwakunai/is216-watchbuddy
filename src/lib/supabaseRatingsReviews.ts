import { supabase } from './supabaseClient'
import type { ReviewItem } from '@/types/profile'
import { fetchSupabaseUserId } from './supabaseUser'

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

/**
 * Fetch all movie reviews for a specific user (from movie_reviews table)
 * @param userId - The Supabase user UUID
 * @returns Array of review items
 */
async function getUserMovieReviews(userId: string): Promise<CombinedReview[]> {
  try {
    const { data, error } = await supabase
      .from('movie_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('movie_review_created_at', { ascending: false })

    if (error) {
      console.error('Error fetching movie reviews:', error)
      throw error
    }

    return (data || []).map((review: any) => ({
      id: review.review_uuid,
      tmdb_id: review.movie_id,
      // Handle case where movie_title column doesn't exist
      title: review.movie_title || `Movie ${review.movie_id}`,
      media_type: 'movie' as const,
      // Handle case where movie_year column doesn't exist
      year: review.movie_year || 0,
      // Handle case where movie_poster_path column doesn't exist
      poster_path: review.movie_poster_path || null,
      poster: review.movie_poster_path 
        ? `https://image.tmdb.org/t/p/w200${review.movie_poster_path}`
        : undefined,
      rating: review.movie_user_rating || 0,
      review_text: review.movie_user_review || '',
      created_at: review.movie_review_created_at,
      reviewedDate: new Date(review.movie_review_created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }))
  } catch (err) {
    console.error('Unexpected error fetching movie reviews:', err)
    return []
  }
}

/**
 * Fetch all TV reviews for a specific user (from tv_reviews table)
 * @param userId - The Supabase user UUID
 * @returns Array of review items
 */
async function getUserTvReviews(userId: string): Promise<CombinedReview[]> {
  try {
    const { data, error } = await supabase
      .from('tv_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('tv_review_created_at', { ascending: false })

    if (error) {
      console.error('Error fetching TV reviews:', error)
      throw error
    }

    return (data || []).map((review: any) => ({
      id: review.review_uuid,
      tmdb_id: review.tv_id,
      // Handle case where tv_title column doesn't exist
      title: review.tv_title || `TV Show ${review.tv_id}`,
      media_type: 'tv' as const,
      // Handle case where tv_year column doesn't exist
      year: review.tv_year || 0,
      // Handle case where tv_poster_path column doesn't exist
      poster_path: review.tv_poster_path || null,
      poster: review.tv_poster_path 
        ? `https://image.tmdb.org/t/p/w200${review.tv_poster_path}`
        : undefined,
      rating: review.tv_user_rating || 0,
      review_text: review.tv_user_review || '',
      created_at: review.tv_review_created_at,
      reviewedDate: new Date(review.tv_review_created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }))
  } catch (err) {
    console.error('Unexpected error fetching TV reviews:', err)
    return []
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
  mediaType: 'movie' | 'tv' | 'all' = 'all'
): Promise<CombinedReview[]> {
  try {
    // Convert Clerk ID to Supabase UUID
    const supabaseUserId = await fetchSupabaseUserId(clerkUserId)
    if (!supabaseUserId) {
      console.error('User not found in Supabase')
      return []
    }

    let reviews: CombinedReview[] = []

    // Fetch based on filter
    if (mediaType === 'all' || mediaType === 'movie') {
      const movieReviews = await getUserMovieReviews(supabaseUserId)
      reviews = [...reviews, ...movieReviews]
    }

    if (mediaType === 'all' || mediaType === 'tv') {
      const tvReviews = await getUserTvReviews(supabaseUserId)
      reviews = [...reviews, ...tvReviews]
    }

    // Sort by date (most recent first)
    reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return reviews
  } catch (err) {
    console.error('Unexpected error fetching user reviews:', err)
    return []
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
  try {
    const supabaseUserId = await fetchSupabaseUserId(clerkUserId)
    if (!supabaseUserId) throw new Error('User not found')

    const { error } = await supabase
      .from('movie_reviews')
      .delete()
      .eq('review_uuid', reviewId)
      .eq('user_id', supabaseUserId)

    if (error) {
      console.error('Error deleting movie review:', error)
      throw error
    }
  } catch (err) {
    console.error('Unexpected error deleting movie review:', err)
    throw err
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
    const supabaseUserId = await fetchSupabaseUserId(clerkUserId)
    if (!supabaseUserId) throw new Error('User not found')

    const { error } = await supabase
      .from('tv_reviews')
      .delete()
      .eq('review_uuid', reviewId)
      .eq('user_id', supabaseUserId)

    if (error) {
      console.error('Error deleting TV review:', error)
      throw error
    }
  } catch (err) {
    console.error('Unexpected error deleting TV review:', err)
    throw err
  }
}
