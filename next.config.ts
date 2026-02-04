import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://200.9.154.222:25573/api/:path*",
      },
    ];
  },
};

export default nextConfig;
