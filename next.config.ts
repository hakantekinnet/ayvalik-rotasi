import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any source — tighten this when connecting to a CMS
    // e.g., remotePatterns: [{ hostname: "your-cms.supabase.co" }]
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Allow unoptimized local placeholder images during development
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
