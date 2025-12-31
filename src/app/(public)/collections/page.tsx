// app/(public)/collections/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionsContent from './CollectionsContent';

// --- SEO: Định nghĩa Metadata cho trang Collections ---
export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Board Game - Khám Phá Danh Mục Đa Dạng | PENGOO',
  description: 'Khám phá bộ sưu tập board game đa dạng tại PENGOO. Từ game chiến thuật, gia đình, đến party game - tìm kiếm trò chơi phù hợp cho mọi dịp và độ tuổi.',
  keywords: [
    'bộ sưu tập board game', 'danh mục board game', 'collections PENGOO',
    'board game theo chủ đề', 'phân loại board game', 'board game đa dạng',
    'game chiến thuật', 'game gia đình', 'party game', 'board game theo độ tuổi',
    'trò chơi board game', 'bộ sưu tập game', 'danh mục trò chơi'
  ],
  alternates: {
    canonical: 'https://pengoo.store/collections',
  },
  openGraph: {
    title: 'Bộ Sưu Tập Board Game Đa Dạng | PENGOO',
    description: 'Khám phá hàng trăm board game được phân loại theo chủ đề, độ tuổi và thể loại tại PENGOO.',
    url: 'https://pengoo.store/collections',
    images: [
      {
        url: 'https://pengoo.store/images/collections-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PENGOO - Bộ sưu tập board game đa dạng',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bộ Sưu Tập Board Game Đa Dạng | PENGOO',
    description: 'Khám phá hàng trăm board game được phân loại theo chủ đề tại PENGOO.',
    images: ['https://pengoo.store/images/collections-twitter-image.jpg'],
  },
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
};

// Add JSON-LD structured data for collections
function addCollectionsJsonLd() {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      "name": "Bộ Sưu Tập Board Game PENGOO",
      "description": "Khám phá bộ sưu tập board game đa dạng được phân loại theo chủ đề, độ tuổi và thể loại",
      "url": "https://pengoo.store/collections",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Danh mục Board Game",
        "description": "Các danh mục board game được tổ chức theo chủ đề"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": "https://pengoo.store"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Bộ sưu tập",
            "item": "https://pengoo.store/collections"
          }
        ]
      }
    }`
  };
}
// --- Hết phần SEO ---

const CollectionsPage: React.FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addCollectionsJsonLd()}
        key="collections-jsonld"
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải bộ sưu tập...
        </div>
      }>
        <CollectionsContent />
      </Suspense>
    </>
  );
};

export default CollectionsPage;
