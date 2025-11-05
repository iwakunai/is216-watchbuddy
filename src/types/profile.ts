export type MediaType = 'movie' | 'tv'

export interface GenreCount { 
  name: string
  count: number 
}

export interface MoodCount { 
  name: string
  emoji: string
  count: number 
}

export interface FavouriteItem { 
  title: string
  year: number
  poster?: string 
}

export interface Friend { 
  id: string
  name: string
  avatar?: string
  status?: 'online' | 'offline' | 'away'
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
}

export interface BadgeGroups {
  moodMastery: Badge[]
  genreExplorer: Badge[]
  socialButterfly: Badge[]
}

export interface RatingItem {
  id: string
  title: string
  type: MediaType
  year: number
  rating: number
  ratedDate: string
  poster?: string
}

export interface ReviewItem {
  id: string
  title: string
  type: MediaType
  year: number
  poster?: string
  reviewText: string
  reviewedDate: string
}

export interface MovieItem {
  id: string | number
  title: string
  type: MediaType
  year: number
  poster?: string
  poster_path?: string
}

export interface ListBasic { 
  id: string
  name: string
  description?: string
  public: 'yes' | 'no'
  sortBy: 'original-asc' | 'original-desc' | 'date-added' | 'rating'
  itemCount?: number 
}

export interface ListFull extends ListBasic { 
  movies?: MovieItem[]
  comments?: 'yes' | 'no'
  createdAt?: string 
}

export interface Profile {
  username: string
  avatarDataUrl?: string
  defaultAvatar: string
}

export interface WatchItem {
  id: string | number
  title: string
  type: MediaType
  year?: number
  poster?: string
  addedAt?: string
}

export interface HistoryItem {
  id: string | number
  title: string
  type: MediaType
  watchedAt: string
  poster?: string
  year?: number
  rating?: number
}

export type ActivityType = 'rating' | 'review' | 'list' | 'friend' | 'badge' | 'watchparty'

export interface ActivityItem {
  id: string | number
  type: ActivityType
  title: string
  description?: string
  at: string
  icon?: string
  href?: string
}

export interface FriendRequest {
  id: string
  name: string
  avatar?: string
  requestedAt: string
}
