/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    runtime: 'experimental-edge',
  }
}

module.exports = nextConfig
