export const tabs = [
  { id: "overview", name: "Overview" },
  { id: "lists", name: "Lists" },
  { id: "ratings", name: "Ratings/Reviews" },
  { id: "watchlist", name: "WatchList" },
  { id: "friends", name: "Friends" },
  { id: "history", name: "History" },
  { id: "activity", name: "Activity" },
] as const;

export type TabId = (typeof tabs)[number]["id"];

// type TabId = 'overview' | 'lists' | 'ratings' | 'watchlist' | 'friends' | 'history' |'activity'
