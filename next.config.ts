import type { NextConfig } from "next";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy API requests to API Gateway seamlessly
        source: "/api/:path*",
        destination: `${GATEWAY_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
