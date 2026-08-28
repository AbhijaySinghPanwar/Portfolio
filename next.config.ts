import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single static page, deployed to a CDN. No server runtime needed.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
