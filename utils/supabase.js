// Deprecated file kept for backward compatibility.
// Re-export a lazy getter so existing imports continue working without eager initialization.
import { getSupabaseClient } from '../app/lib/supabaseClient'

export const supabase = new Proxy({}, {
  get(_, prop) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Supabase not configured');
    }
    return client[prop];
  }
});
