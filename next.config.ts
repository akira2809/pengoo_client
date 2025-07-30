// next.config.js
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    // Use Cloudinary loader for production
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/do6lj4onq/image/upload/',
    
    // Image formats and settings
    formats: ["image/webp", "image/avif"] as const,
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    
    // Allowed domains
    domains: [
      'res.cloudinary.com',
      'picsum.photos',
      'loremflickr.com',
      'assets.awwwards.com',
      'placehold.co',
      'localhost',
    ],
    
    // For development, allow all image sources
    ...(process.env.NODE_ENV !== 'production' && {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    }),
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox:",
  },
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
    // turbopack: true, // NẾU BẠN MUỐN THỬ VÔ HIỆU HÓA TURBOPACK ĐỂ LOẠI BỎ CẢNH BÁO `params`
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

export default withBundleAnalyzerConfig(nextConfig);