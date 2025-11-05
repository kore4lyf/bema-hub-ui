import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack and use Webpack instead
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
