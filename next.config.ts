import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"assests.coingecko.com",
      },
      {
        protocol:"https",
        hostname:"coin-images.coingecko.com",
      }
    ]
  }
};

export default nextConfig;
