import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any source — tighten this when connecting to a CMS
    // e.g., remotePatterns: [{ hostname: "your-cms.supabase.co" }]
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Allow unoptimized local placeholder images during development
    unoptimized: process.env.NODE_ENV === "development",
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.ayvalikrotasi.com",
          },
        ],
        destination: "https://ayvalikrotasi.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "ayvalik-rotasi.vercel.app",
          },
        ],
        destination: "https://ayvalikrotasi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
