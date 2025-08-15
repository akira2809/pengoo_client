// app/(public)/products/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsContent from './ProductsContent';


// --- SEO: Định nghĩa Metadata cho trang Products ---
export const metadata: Metadata = {
  title: 'Tất Cả Sản Phẩm Board Game - Mua Board Game Chính Hãng | PENGOO',
  description: 'Khám phá hàng trăm board game chính hãng tại PENGOO. Từ game chiến thuật, gia đình đến party game với giá tốt nhất. Miễn phí giao hàng toàn quốc. Mua ngay!',
  keywords: [
    'mua board game', 'board game chính hãng', 'cửa hàng board game', 
    'board game Việt Nam', 'trò chơi board game', 'game chiến thuật',
    'board game gia đình', 'party game', 'board game giá rẻ',
    'board game online', 'PENGOO products', 'tất cả sản phẩm board game',
    'board game sale', 'board game khuyến mãi', 'board game mới nhất'
  ],
  alternates: {
    canonical: 'https://pengoo.store/products',
  },
  openGraph: {
    title: 'Tất Cả Sản Phẩm Board Game Chính Hãng | PENGOO',
    description: 'Hàng trăm board game chính hãng với giá tốt nhất. Miễn phí giao hàng toàn quốc.',
    url: 'https://pengoo.store/products',
    images: [
      {
        url: 'https://pengoo.store/images/products-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PENGOO - Tất cả sản phẩm board game chính hãng',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tất Cả Sản Phẩm Board Game Chính Hãng | PENGOO',
    description: 'Hàng trăm board game chính hãng với giá tốt nhất tại PENGOO.',
    images: ['https://pengoo.store/images/products-twitter-image.jpg'],
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

// Add JSON-LD structured data for products page
function addProductsJsonLd() {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      "name": "Tất Cả Sản Phẩm Board Game PENGOO",
      "description": "Bộ sưu tập đầy đủ các board game chính hãng tại PENGOO",
      "url": "https://pengoo.store/products",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Danh sách Board Game",
        "description": "Tất cả sản phẩm board game có sẵn tại PENGOO"
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
            "name": "Sản phẩm",
            "item": "https://pengoo.store/products"
          }
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "PENGOO",
        "url": "https://pengoo.store"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://pengoo.store/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }`
  };
}

// Add WebSite JSON-LD for search functionality
function addWebSiteJsonLd() {
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "PENGOO Board Game Store",
      "url": "https://pengoo.store",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://pengoo.store/products?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }`
  };
}
// --- Hết phần SEO ---

const ProductsPage: React.FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addProductsJsonLd()}
        key="products-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addWebSiteJsonLd()}
        key="website-jsonld"
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải sản phẩm...
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </>
  );
};

export default ProductsPage;
