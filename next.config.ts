// next.config.js
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'assets.awwwards.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox:",
  },
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
})(nextConfig);
