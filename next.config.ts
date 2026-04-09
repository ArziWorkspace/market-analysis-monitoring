import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["market-analyzer.arzi.com", "localhost", "127.0.0.1"],
} as const;

export default nextConfig;
