// next.config.js
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
    formats: ["image/webp", "image/avif"] as const,
    domains: [
      'res.cloudinary.com',
      'picsum.photos',
      'loremflickr.com',
      'assets.awwwards.com',
      'placehold.co',
      'localhost',
    ],
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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