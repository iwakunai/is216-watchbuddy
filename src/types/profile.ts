export interface Profile {
  username: string;
  avatarDataUrl?: string;
  defaultAvatar: string;
}

export interface WatchpartyHistoryItem {
  id: string | number,
  roomName: string,
  title: string,
  poster?: string,
  lastJoinedAt: string,
  scheduledTime: string,
  duration: string | number,
}
