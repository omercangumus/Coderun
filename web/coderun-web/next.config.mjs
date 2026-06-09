/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    const internalApiUrl =
      process.env.INTERNAL_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'http://backend:8000/api/v1'
        : 'http://localhost:8000/api/v1');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${internalApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
