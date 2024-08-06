/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/summary",
      },
    ];
  },
};

export default nextConfig;
