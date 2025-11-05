import type { MediaType, MovieItem } from "@/composables/watchlist";

export interface GenreCount {
  name: string;
  count: number;
}

export interface MoodCount {
  name: string;
  emoji: string;
  count: number;
}

export interface FavouriteItem {
  title: string;
  year: number;
  poster?: string;
}

// export interface WatchItem {
//   id: string | number
//   title: string
//   type: MediaType
//   year?: number
//   poster?: string
//   addedAt?: string
//   status?: 'completed' | 'watching' | 'plan-to-watch'
// }

export interface Profile {
  username: string;
  avatarDataUrl?: string;
  defaultAvatar: string;
}

export interface HistoryItem {
  id: string | number;
  title: string;
  type: MediaType;
  watchedAt: string;
  poster?: string;
  year?: number;
  rating?: number;
}

export type ActivityType =
  | "rating"
  | "review"
  | "list"
  | "friend"
  | "badge"
  | "watchparty";

// export interface ActivityItem {
//   id: string | number;
//   type: ActivityType;
//   title: string;
//   description?: string;
//   at: string;
//   icon?: string;
//   href?: string;
// }

// export interface FriendRequest {
//   id: string;
//   name: string;
//   avatar?: string;
//   requestedAt: string;
// }

export interface WatchpartyHistoryItem {
  id: string | number,
  roomName: string,
  title: string,
  poster?: string,
  lastJoinedAt: string,
  scheduledTime: string,
  duration: string | number,
}
