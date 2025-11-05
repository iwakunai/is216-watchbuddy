import type { WatchlistItem } from '@/composables/watchlist'
import { supabase } from '@/lib/supabaseClient'

// Set the current user context for RLS policies
export const setUserContext = async (userId: string) => {
  await supabase.rpc('set_config', {
    name: 'app.user_id',
    value: userId
  })
}

// ============================================
// WATCHLIST OPERATIONS
// ============================================
export const getWatchlist = async (userId: string) => {
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })
  
  if (error) throw error
  return data as WatchlistItem[]
}

export const addToWatchlist = async (item: WatchlistItem) => {
  const { data, error } = await supabase
    .from('watchlist')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const removeFromWatchlist = async (userId: string, tmdbId: number, mediaType: 'movie' | 'tv') => {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
  
  if (error) throw error
}

// ============================================
// WATCH HISTORY OPERATIONS
// ============================================
export interface WatchHistoryItem {
  id?: string
  user_id: string
  tmdb_id: number
  title: string
  media_type: 'movie' | 'tv'
  poster_path?: string
  release_year?: number
  rating?: number
  watched_at?: string
}

export const getWatchHistory = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('watch_history')
    .select('*')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as WatchHistoryItem[]
}

export const addToWatchHistory = async (item: WatchHistoryItem) => {
  const { data, error } = await supabase
    .from('watch_history')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// CUSTOM LISTS OPERATIONS
// ============================================
export interface UserList {
  id?: string
  user_id: string
  name: string
  description?: string
  is_public: boolean
  allow_comments: boolean
  sort_by: 'original-asc' | 'original-desc' | 'date-added' | 'rating'
  created_at?: string
  updated_at?: string
}

export interface ListItem {
  id?: string
  list_id: string
  tmdb_id: number
  title: string
  media_type: 'movie' | 'tv'
  poster_path?: string
  release_year?: number
  position: number
  added_at?: string
}

export const getUserLists = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as UserList[]
}

export const createList = async (list: UserList) => {
  const { data, error } = await supabase
    .from('user_lists')
    .insert(list)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateList = async (listId: string, updates: Partial<UserList>) => {
  const { data, error } = await supabase
    .from('user_lists')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', listId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteList = async (listId: string) => {
  const { error } = await supabase
    .from('user_lists')
    .delete()
    .eq('id', listId)
  
  if (error) throw error
}

export const getListItems = async (listId: string) => {
  const { data, error } = await supabase
    .from('list_items')
    .select('*')
    .eq('list_id', listId)
    .order('position', { ascending: true })
  
  if (error) throw error
  return data as ListItem[]
}

export const addItemToList = async (item: ListItem) => {
  const { data, error } = await supabase
    .from('list_items')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const removeItemFromList = async (listId: string, tmdbId: number, mediaType: 'movie' | 'tv') => {
  const { error } = await supabase
    .from('list_items')
    .delete()
    .eq('list_id', listId)
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
  
  if (error) throw error
}

// ============================================
// FRIENDSHIPS OPERATIONS
// ============================================
export interface Friendship {
  id?: string
  user_id: string
  friend_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at?: string
  updated_at?: string
}

export const getFriends = async (userId: string) => {
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      *,
      friend:user_profiles!friendships_friend_id_fkey(user_id, username, avatar_url)
    `)
    .eq('user_id', userId)
    .eq('status', 'accepted')
  
  if (error) throw error
  return data
}

export const getFriendRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      *,
      requester:user_profiles!friendships_user_id_fkey(user_id, username, avatar_url)
    `)
    .eq('friend_id', userId)
    .eq('status', 'pending')
  
  if (error) throw error
  return data
}

export const sendFriendRequest = async (userId: string, friendId: string) => {
  const { data, error } = await supabase
    .from('friendships')
    .insert({
      user_id: userId,
      friend_id: friendId,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const acceptFriendRequest = async (requestId: string) => {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const rejectFriendRequest = async (requestId: string) => {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', requestId)
  
  if (error) throw error
}

export const removeFriend = async (userId: string, friendId: string) => {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
  
  if (error) throw error
}



// ============================================
// BADGES OPERATIONS
// ============================================
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'moodMastery' | 'genreExplorer' | 'socialButterfly' | 'general'
}

export interface UserBadge {
  id?: string
  user_id: string
  badge_id: string
  earned_at?: string
}

export const getAllBadges = async () => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('category')
  
  if (error) throw error
  return data as Badge[]
}

export const getUserBadges = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:badges(*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const awardBadge = async (userId: string, badgeId: string) => {
  const { data, error } = await supabase
    .from('user_badges')
    .insert({ user_id: userId, badge_id: badgeId })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ============================================
// ACTIVITY FEED OPERATIONS
// ============================================
export interface Activity {
  id?: string
  user_id: string
  activity_type: 'rating' | 'review' | 'list' | 'friend' | 'badge' | 'watchparty'
  title: string
  description?: string
  icon?: string
  reference_id?: string
  created_at?: string
}

export const getUserActivity = async (userId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('activity_feed')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as Activity[]
}

export const getFriendActivity = async (userId: string, limit = 20) => {
  // Get activities from friends
  const friends = await getFriends(userId)
  if (!friends || friends.length === 0) return []
  
  const friendIds = friends.map((f: any) => f.friend_id)
  
  const { data, error } = await supabase
    .from('activity_feed')
    .select(`
      *,
      user:user_profiles!activity_feed_user_id_fkey(username, avatar_url)
    `)
    .in('user_id', friendIds)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

export const addActivity = async (activity: Activity) => {
  const { data, error } = await supabase
    .from('activity_feed')
    .insert(activity)
    .select()
    .single()
  
  if (error) throw error
  return data
}
