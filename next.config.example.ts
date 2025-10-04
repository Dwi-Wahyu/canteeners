import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ["192.168.1.7"],
  images: {
    domains: ["192.168.1.7"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1gb",
    },
  },
};

export default nextConfig;
