// app/page.tsx
// Đây là Server Component chính cho trang chủ của bạn
import { Metadata } from 'next';
import React from 'react';
import HomePageLoader from '../components/page/Homepage/HomePageLoader'; // Import Client Component wrapper

// Định nghĩa metadata cho trang chủ
// Đây là nơi bạn cần nhúng các từ khóa SEO của mình một cách chiến lược.
// In your page.tsx
export const metadata: Metadata = {
    title: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè | Trải Nghiệm Giải Trí Đỉnh Cao',
    description: 'PENGOO chuyên cung cấp các loại board game, trò chơi gia đình, và đồ chơi trí tuệ độc đáo, giúp gắn kết bạn bè và người thân.',
    keywords: [
      'PENGOO', 
      'board game', 
      'trò chơi board game', 
      'board game gia đình', 
      'board game bạn bè',
      'đồ chơi trí tuệ',
      // ... other keywords
    ],
    // Add Open Graph
    openGraph: {
      title: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè',
      description: 'Khám phá bộ sưu tập board game đa dạng tại PENGOO - Nơi kết nối mọi người thông qua những trò chơi thú vị',
      url: 'https://pengoo.vn',
      siteName: 'PENGOO',
      images: [
        {
          url: '/images/og-image.jpg', // Add your OG image
          width: 1200,
          height: 630,
          alt: 'PENGOO Board Game',
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    // Add Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'PENGOO - Board Game Cho Gia Đình & Bạn Bè',
      description: 'Khám phá bộ sưu tập board game đa dạng tại PENGOO',
      images: ['/images/twitter-card.jpg'], // Add your Twitter card image
    },
    // Add canonical URL
    alternates: {
      canonical: 'https://pengoo.vn',
    },
    // Add viewport (if not in layout)
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    // Add robots meta
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Add other metadata
    authors: [{ name: 'PENGOO' }],
    generator: 'Next.js',
    applicationName: 'PENGOO Board Game',
    themeColor: '#ffffff',
    colorScheme: 'light',
    // Add manifest
    manifest: '/site.webmanifest',
    // Add icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    // Add other meta tags
    other: {
      'msapplication-TileColor': '#ffffff',
    }
  };
  
  // Add JSON-LD structured data
  function addProductJsonLd() {
    return {
      __html: `{
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": "PENGOO Board Game",
        "url": "https://pengoo.vn",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://pengoo.vn/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }`
    };
  }
  
  export default function HomePage() {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addProductJsonLd()}
          key="product-jsonld"
        />
        <HomePageLoader />
      </>
    );
  }