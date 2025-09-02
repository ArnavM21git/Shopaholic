import { createBrowserClient } from '@supabase/ssr'

// Lazy (on-demand) browser client creation to avoid throwing during build/prerender
// when env vars might not be injected (e.g. CI without public keys set).
let _supabaseClient = null

export function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    // In the browser, surface a clear error for developers; silently return null during SSR.
    if (typeof window !== 'undefined') {
      console.error('Supabase not configured: missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    return null
  }

  _supabaseClient = createBrowserClient(url, anon)
  return _supabaseClient
}

// (Optional) helper to assert existence and throw a more descriptive message if needed elsewhere.
export function requireSupabaseClient() {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error('Supabase client unavailable - missing environment variables.')
  }
  return client
}
