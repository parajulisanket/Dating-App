import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      // Production — both http + https
      {
        protocol: "http",
        hostname: "datingapi-dev.kantipurinfotech.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "datingapi-dev.kantipurinfotech.com",
        pathname: "/**",
      },

      // Localhost backend
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },

      // Local network backend
      {
        protocol: "http",
        hostname: "192.168.1.8",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
