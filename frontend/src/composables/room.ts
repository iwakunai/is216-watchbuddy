import { computed } from 'vue';
import { currentTime } from '@/lib/currentTimeApi';
import { vibes } from '@/composables/vibes';

export interface Room {
  roomid: string;
  name: string;
  movie: string;
  host: string;
  datetime: string;
  duration: number; // minutes
  vibeId?: string;
  posterUrl?: string;
}

export function getVibeEmoji(vibeId: string | undefined): string {
  if (!vibeId) return '';
  const id = vibeId.toLowerCase();
  const v = vibes.find((v) => v.id === id);
  return v ? v.emoji : '';
}

export function useRoomStatus(room: Room) {
  
  const status = computed(() => {
    if (!room.datetime || !room.duration) return 'scheduled';

    const start = new Date(room.datetime);
    const end = new Date(start.getTime() + room.duration * 60 * 1000);

    if (currentTime.value < start) return 'scheduled';
    if (currentTime.value >= start && currentTime.value < end) return 'playing';

    return 'ended';
  });

  function formatStatus(stat: string): string {
    switch (stat) {
      case 'playing':
        return 'Playing';
      case 'scheduled':
        return 'Scheduled';
      case 'ended':
        return 'Ended';
      default:
        return 'Unknown';
    }
  }

  const formattedDatetime = computed(() => {
    if (!room.datetime) return '';
    const date = new Date(room.datetime);
    return date.toLocaleString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Singapore',
    });
  });

  return {
    currentTime,
    status,
    formatStatus,
    formattedDatetime,
    getVibeEmoji,
  };
}