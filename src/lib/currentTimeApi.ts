import { onMounted, onUnmounted, ref } from "vue";
import { supabase } from "@/lib/supabaseClient";

export const currentTime = ref<Date>(new Date());

export async function fetchInitialTime(): Promise<void> {
  const { data, error } = await supabase
    .from('time_sync')
    .select('current_time_utc')
    .single();

  if (!error && data) {
    currentTime.value = new Date(data.current_time_utc);
  }
}

let subscription: any;

export function startSubscription() {
  if (!subscription) {
    subscription = supabase
      .channel('public:time_sync')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'time_sync', filter: 'id=eq.1' },
        (payload)  => {
          if (payload?.new?.current_time_utc) {
            currentTime.value = new Date(payload.new.current_time_utc);
          }
        }
      )
      .subscribe();
  }
}

export function stopSubscription() {
  if (subscription) {
    supabase.removeChannel(subscription);
    subscription = null;
  }
}
