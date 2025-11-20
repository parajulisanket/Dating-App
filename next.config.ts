import type { NextConfig } from "next";

const api = process.env.NEXT_PUBLIC_API_BASE || "";

function buildRemoteFromEnv() {
  try {
    const u = new URL(api);
    return [
      {
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        port: u.port || undefined,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    // "192.168.1.8",
    // "192.168.1.8",
    "https://datingapi-dev.kantipurinfotech.com/",
  ],

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      ...buildRemoteFromEnv(),
      {
        protocol: "https",
        hostname: "datingapi-dev.kantipurinfotech.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
