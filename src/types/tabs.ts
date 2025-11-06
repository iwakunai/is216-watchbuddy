export const tabs = [
  // { id: "overview", name: "Overview" },
  { id: "ratings", name: "Ratings/Reviews" },
  { id: "watchlist", name: "WatchList" },
  { id: "history", name: "Watch Party History" },
] as const;

export type TabId = (typeof tabs)[number]["id"];

