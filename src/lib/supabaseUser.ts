import { supabase } from "./supabaseClient";

export async function fetchSupabaseUserId(
  clerkUserId: string | null = null
): Promise<string | null> {
  if (!clerkUserId) return null;

  const cleanId = clerkUserId.trim();
  

  

  const { data, error } = await supabase
    .from('users')
    .select('id, clerk_id')
    .eq('clerk_id', cleanId)
    .maybeSingle();

  if (error) {
    
    return null;
  }

  

  return data?.id || null;
}
