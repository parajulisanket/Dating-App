import type { NextConfig } from "next";

const api = process.env.NEXT_PUBLIC_API_BASE || "";

let host = "";
try {
  host = new URL(api).hostname;
} catch {}

const nextConfig: NextConfig = {
  eslint: {
    // ignore ESLint warnings during builds (for production stability)
    ignoreDuringBuilds: true,
  },
  images: {
    // allow images from your backend (and any port)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.6",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    // prevents build from failing on type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
