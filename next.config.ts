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
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

export default withBundleAnalyzerConfig(nextConfig);
