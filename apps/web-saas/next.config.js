/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ronda/ui'],
  experimental: {
    typedRoutes: false,
  },
};

module.exports = nextConfig;
