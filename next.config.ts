// next.config.js
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    // 1. ĐÃ XÓA BỎ loader và path của Cloudinary để dùng trình tối ưu hóa mặc định
    
    // Các cài đặt hình ảnh khác
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,

    // 2. CẤU HÌNH remotePatterns để cho phép các tên miền hình ảnh trên production
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'assets.awwwards.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      // Thêm các hostname khác bạn cần tại đây
    ],
    
    // Các cấu hình còn lại giữ nguyên
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox:",
  },
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
  typescript: {
    // Cho phép build thành công kể cả khi có lỗi TypeScript
    ignoreBuildErrors: true,
  },
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

export default withBundleAnalyzerConfig(nextConfig);