import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://72.62.104.117:25572/api/:path*",
      },
    ];
  },
};

export default nextConfig;
