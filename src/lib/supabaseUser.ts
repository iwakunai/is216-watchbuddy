import { supabase } from "./supabaseClient";

export async function fetchSupabaseUserId(
  clerkUserId: string | null = null
): Promise<string | null> {
  if (!clerkUserId) return null;

  const cleanId = clerkUserId.trim();
  console.log(clerkUserId);

  console.log('Querying Supabase user for Clerk ID:', `"${cleanId}"`);

  // Query for exact match of clerk_id
  const { data, error } = await supabase
    .from('users')
    .select('id, clerk_id')
    .eq('clerk_id', cleanId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user UUID:', error);
    return null;
  }

  console.log('Fetch result:', data);

  // data is either null or an object with id and clerk_id
  return data?.id || null;
}
