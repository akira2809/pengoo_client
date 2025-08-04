// next.config.js
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    // Use custom loader for Cloudinary
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
    
    // Image formats and settings
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    
    // Allowed remote patterns for images
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'assets.awwwards.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
    
    // In development, this block will override the remotePatterns above
    ...(process.env.NODE_ENV !== 'production' && {
      remotePatterns: [
        { protocol: 'https', hostname: '**' },
      ],
    }),
    
    contentDispositionType: "attachment",
    
    // IMPORTANT FIX: Updated Content Security Policy to allow image sources
    contentSecurityPolicy: "default-src 'self'; img-src 'self' https://res.cloudinary.com https://picsum.photos https://loremflickr.com https://assets.awwwards.com https://placehold.co data:; script-src 'none'; sandbox:",
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