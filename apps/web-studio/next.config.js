/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'replicate.delivery' },
      { protocol: 'https', hostname: '*.replicate.delivery' },
      { protocol: 'https', hostname: '*.fal.media' },
      { protocol: 'https', hostname: 'fal.media' },
    ],
  },
};

module.exports = nextConfig;
