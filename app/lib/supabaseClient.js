import { createBrowserClient } from '@supabase/ssr'

let supabaseClient

try {
  if (!supabaseClient && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error)
}

export { supabaseClient }
