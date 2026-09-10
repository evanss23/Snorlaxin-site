import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    // Uploaded media is served from our own /uploads route; keep optimisation off
    // so the site runs anywhere without an image CDN.
    unoptimized: true,
  },
};

export default nextConfig;
