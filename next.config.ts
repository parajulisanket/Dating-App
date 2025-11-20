import type { NextConfig } from "next";

const api = process.env.NEXT_PUBLIC_API_BASE || "";

function buildRemoteFromEnv() {
  try {
    const u = new URL(api);
    return [
      {
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
