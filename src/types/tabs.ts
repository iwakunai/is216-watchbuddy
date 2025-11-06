export const tabs = [
  // { id: "overview", name: "Overview" },
  { id: "ratings", name: "My Ratings/Reviews" },
  { id: "watchlist", name: "My Watchlist" },
  { id: "history", name: "My Watch Party History" },
] as const;

export type TabId = (typeof tabs)[number]["id"];

