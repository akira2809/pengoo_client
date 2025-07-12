// src/app/(public)/product/[slug]/page.tsx
// Đây là Server Component chính cho trang chi tiết sản phẩm
import { Metadata } from 'next';
import { productService } from '@/app/api/services/productService'; // Đảm bảo đường dẫn đúng
import { ProductData } from '@/app/type/product'; // Đảm bảo đường dẫn đúng

// Import ProductLoader Client Component wrapper
import ProductLoader from './ProductLoader';

// Hàm fetch dữ liệu sản phẩm (sẽ chạy trên server)
async function getProductBySlug(slug: string): Promise<{ product: ProductData | null; error: string | null }> {
  if (!slug) {
    return { product: null, error: 'Slug sản phẩm không hợp lệ' };
  }

  try {
    const response = await productService.getProductBySlug(slug);
    if (response?.data) {
      return { product: response.data, error: null };
    }
    return { product: null, error: 'Không tìm thấy sản phẩm' };
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm trên server:', err);
    return { product: null, error: 'Đã xảy ra lỗi khi tải thông tin sản phẩm' };
  }
}

// Hàm generateMetadata để tạo metadata động (Chỉ chạy trên server)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Lấy slug từ params (đã được resolve bởi Next.js)
  const { slug } = await Promise.resolve(params);
  if (!slug) {
    return {
      title: 'Sản phẩm không tồn tại - PENGOO',
      description: 'Xin lỗi, sản phẩm bạn tìm kiếm không tồn tại.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  
  const { product, error } = await getProductBySlug(slug);

  if (!product) {
    console.warn(`Không tìm thấy sản phẩm với slug: ${slug}. Lỗi: ${error || 'Không rõ.'}`); 
    return {
      title: 'Sản phẩm không tồn tại - PENGOO',
      description: 'Xin lỗi, sản phẩm bạn tìm kiếm không tồn tại.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName = product.product_name || 'Sản phẩm Board Game';
  const productDescription = product.description || `Khám phá ${productName} - một trò chơi board game tuyệt vời từ PENGOO.`;
  const productImageUrl = product.images?.[0]?.url || '/placeholder-product.jpg';
  const productPrice = product.product_price || 0;
  const productRating = product.average_rating || 4.5;
  const reviewCount = product.review_count || 10;
  const productAvailability = product.quantity_stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  
  const productKeywords = [
    productName.toLowerCase(), 
    product.category_ID?.name.toLowerCase() || 'board game', 
    'PENGOO', 
    'trò chơi', 
    'board game', 
    `mua ${productName.toLowerCase()}`,
    ...(product.features || []).map(f => f.title).filter(Boolean).map(f => f.toLowerCase()), 
    ...(product.tags || []).filter((t): t is string => typeof t === 'string' && t.trim() !== '').map(t => t.toLowerCase()),
  ].filter(Boolean).slice(0, 10);

  return {
    title: `${productName} | Board Game Chính Hãng tại PENGOO`,
    description: productDescription,
    keywords: productKeywords,
    openGraph: {
      title: `${productName} | Board Game Chính Hãng tại PENGOO`,
      description: productDescription,
      url: `https://yourwebsite.com/product/${product.slug}`,
      siteName: 'PENGOO',
      images: [
        {
          url: productImageUrl,
          width: 800,
          height: 600,
          alt: `Hình ảnh ${productName} - Board Game PENGOO`,
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | Board Game Chính Hãng tại PENGOO`,
      description: productDescription,
      creator: '@yourtwitterhandle',
      images: [productImageUrl],
    },
    alternates: {
        canonical: `https://yourwebsite.com/product/${product.slug}`,
    },
  };
}

// Đây là component trang chính của bạn
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Lấy slug từ params (đã được resolve bởi Next.js)
  const { slug } = await Promise.resolve(params);
  if (!slug) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
  
  const { product, error } = await getProductBySlug(slug);

  const schemaData = product ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.product_name || 'Sản phẩm Board Game',
      image: product.images?.[0]?.url || '/placeholder-product.jpg',
      description: product.description || `Khám phá ${product.product_name || 'Sản phẩm Board Game'} - một trò chơi board game tuyệt vời từ PENGOO.`,
      sku: product.sku,
      mpn: product.mpn,
      brand: {
          '@type': 'Brand',
          name: 'PENGOO',
      },
      offers: {
          '@type': 'Offer',
          url: `https://yourwebsite.com/product/${product.slug}`,
          priceCurrency: 'VND',
          price: product.product_price || 0,
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.quantity_stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
              '@type': 'Organization',
              name: 'PENGOO',
          },
      },
      aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.average_rating || 4.5,
          reviewCount: product.review_count || 10,
      },
  } : null;

  return (
    <>
      {/* Render Schema Markup nếu có dữ liệu sản phẩm */}
      {schemaData && (
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />
      )}
      {/* Truyền dữ liệu sản phẩm đã fetch được vào Client Component Loader */}
      <ProductLoader initialProduct={product} initialError={error} />
    </>
  );
}