// Tab definitions for ProfilePage
export type TabId = 'overview' | 'lists' | 'ratings' | 'reviews' | 'badges' | 'watchlist' | 'friends' | 'history' | 'activity'

export interface Tab {
  id: TabId
  label: string
  icon: string
}

export const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: 'pi pi-home' },
  { id: 'lists', label: 'Lists', icon: 'pi pi-list' },
  { id: 'ratings', label: 'Ratings', icon: 'pi pi-star' },
  { id: 'reviews', label: 'Reviews', icon: 'pi pi-comment' },
  { id: 'badges', label: 'Badges', icon: 'pi pi-trophy' },
  { id: 'watchlist', label: 'Watchlist', icon: 'pi pi-bookmark' },
  { id: 'friends', label: 'Friends', icon: 'pi pi-users' },
  { id: 'history', label: 'History', icon: 'pi pi-clock' },
  { id: 'activity', label: 'Activity', icon: 'pi pi-bell' },
]
