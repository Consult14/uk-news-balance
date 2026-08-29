import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.bbci.co.uk" },
      { protocol: "https", hostname: "**.theguardian.com" },
      { protocol: "https", hostname: "**.independent.co.uk" },
      { protocol: "https", hostname: "**.dailymail.co.uk" },
      { protocol: "https", hostname: "**.skynews.com" },
    ],
  },
};

export default nextConfig;
