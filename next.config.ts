import type { NextConfig } from "next";

const api = process.env.NEXT_PUBLIC_API_BASE || "";

// Build remotePatterns from NEXT_PUBLIC_API_BASE if provided
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
    "192.168.1.8",
    "192.168.1.8",
    // You can also use wildcards, e.g. "*.local.mydomain.dev"
  ],

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      ...buildRemoteFromEnv(),
      {
        protocol: "http",
        hostname: "192.168.1.6",
        port: "8080",
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
      }, // fixed
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/**",
      }, // fixed
    ],
  },
};

export default nextConfig;
