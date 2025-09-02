/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  images: {
    domains: ['supabase.co'],
  },
  // Add error handling and performance optimizations
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
