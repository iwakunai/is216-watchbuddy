import { supabase } from './supabaseClient'

export interface Review {
  id: string
  movie_id: number
  user_id: string
  user_name: string
  user_avatar: string | null
  rating: number
  comment: string
  created_at: string
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('movie_reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }

  return data as Review[]
}

export async function getMovieReviews(movieId: number) {
  const { data, error } = await supabase
    .from('movie_reviews')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching movie reviews:', error)
    return []
  }

  return data as Review[]
}
