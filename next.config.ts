import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.fal.media" },
      { protocol: "https", hostname: "fal.media" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    dangerouslyAllowSVG: false,
    // Allow base64 data URLs from HuggingFace blob responses
    unoptimized: false,
  },
};

export default nextConfig;
