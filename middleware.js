import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export const runtime = 'experimental-edge'

export async function middleware(req) {
  const res = NextResponse.next()

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => req.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove: (name, options) => {
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )
    await supabase.auth.getSession()
    return res
  } catch (err) {
    console.error('middleware error:', err)
    return res
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
