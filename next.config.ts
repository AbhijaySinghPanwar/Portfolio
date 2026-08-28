import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single static page, deployed to a CDN. No server runtime needed.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // The circular badge in the bottom-left corner is Next's dev indicator. It
  // never shipped in the static export, but it obscures the corner while
  // reviewing, so turn it off.
  devIndicators: false,
  // A stray lockfile in the home directory makes Next infer the wrong
  // workspace root, which breaks dev-server chunk resolution.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
