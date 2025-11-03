// Type definitions for ProfilePage components

export interface Profile {
  user_id: string
  username: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  location: string | null
  website: string | null
  social_links: Record<string, string> | null
  preferences: Record<string, any> | null
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface GenreCount {
  name: string
  count: number
}

export interface MoodCount {
  name: string
  count: number
}

export interface FavouriteItem {
  id: number
  title: string
  type: 'movie' | 'tv'
  posterUrl: string | null
}

export interface Friend {
  id: string
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  status: 'accepted'
  since: string
}

export interface FriendRequest {
  id: string
  from_user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  status: 'pending'
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  tier: string
  requirement: number
  created_at: string
}

export interface UserBadge extends Badge {
  earned_at: string
  progress?: number
}

export interface BadgeGroups {
  moodMastery: UserBadge[]
  genreExplorer: UserBadge[]
  socialButterfly: UserBadge[]
}

export interface RatingItem {
  id: string
  movie_id: number
  title: string
  poster_path: string | null
  rating: number
  rated_at: string
  type: 'movie' | 'tv'
}

export interface ReviewItem {
  id: string
  movie_id: number
  title: string
  poster_path: string | null
  rating: number | null
  review_text: string
  created_at: string
  updated_at: string
  type: 'movie' | 'tv'
}

export interface MovieItem {
  id: number
  title: string
  poster_path: string | null
  release_date?: string
  type: 'movie' | 'tv'
}

export interface ListFull {
  id: string
  name: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  movies?: MovieItem[]
  item_count?: number
}

export interface WatchItem {
  id: string
  movie_id: number
  title: string
  poster_path: string | null
  added_at: string
  type: 'movie' | 'tv'
  release_date?: string
}

export interface HistoryItem {
  id: string
  movie_id: number
  title: string
  poster_path: string | null
  watched_at: string
  rating: number | null
  type: 'movie' | 'tv'
  release_date?: string
}

export interface ActivityItem {
  id: string
  activity_type: 'rating' | 'review' | 'watchlist_add' | 'list_create' | 'friend_add' | 'badge_earned'
  description: string
  created_at: string
  metadata?: Record<string, any>
}
