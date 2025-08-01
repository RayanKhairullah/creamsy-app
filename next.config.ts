import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tgmpgrjhjzyuzoznjppt.supabase.co',
      },
    ],
  },
};

export default nextConfig;