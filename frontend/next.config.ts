import type { NextConfig } from "next";

/**
 * Next.js configuration for the JalSarthi AI prototype.
 *
 * Kept intentionally minimal: the application uses its own Next.js API
 * route and does not proxy to, or integrate with, external government APIs.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  compiler: {
    // Strip console.* calls from production client bundles, keep errors.
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;
