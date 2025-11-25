import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure environment variables are available on the client side
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  // Enable React's experimental features
  reactStrictMode: true,
  // Configure images if needed
  images: {
    domains: ['localhost'], // Add your image domains here
  },
};

export default nextConfig;
