import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseClient

if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing environment variables for Supabase configuration')
  }
  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export { supabaseClient }
