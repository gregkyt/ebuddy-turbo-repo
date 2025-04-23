import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SERVICE_BASE_URL: process.env.SERVICE_BASE_URL,
  },
  reactStrictMode: false,
};

export default nextConfig;
