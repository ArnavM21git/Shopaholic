/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  // Add specific Supabase domains to the image domains list
  images: {
    domains: ['supabase.co'],
  },
  // Ensure cookies are handled properly
  cookies: {
    sameSite: 'lax'
  }
}

module.exports = nextConfig
