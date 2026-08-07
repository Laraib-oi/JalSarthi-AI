import type { NextConfig } from "next";

/**
 * Next.js configuration for the JalSarthi Platform.
 *
 * Kept intentionally minimal for the foundation phase — no rewrites,
 * no backend proxying, no env wiring. Those are introduced when the
 * FastAPI backend and Gemini-powered AI layer are added.
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
