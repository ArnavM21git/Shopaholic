/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Enable edge runtime
  experimental: {
    runtime: 'experimental-edge',
  }
}

module.exports = nextConfig
