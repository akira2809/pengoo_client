// next.config.js
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'] as const,
    domains: [
      'res.cloudinary.com',
      'picsum.photos',
      'loremflickr.com',
      'assets.awwwards.com',
      'placehold.co',
      "localhost",
    
      // 'https://example.com/image.jpg', // BỎ DÒNG NÀY ĐI
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox:"
  },
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
    // turbopack: true, // NẾU BẠN MUỐN THỬ VÔ HIỆU HÓA TURBOPACK ĐỂ LOẠI BỎ CẢNH BÁO `params`
  },
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

export default withBundleAnalyzerConfig(nextConfig);