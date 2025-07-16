// src/app/(public)/product/[slug]/ProductClientPage.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { ProductData } from '@/app/type/product';
import { productService } from '@/app/api/services/productService';
import { Skeleton } from '@/components/common/UI/Skeleton';
import ProductReviewsSection from '@/components/common/ProductReviewsSection';

const ProductImageGallery = dynamic(
  () => import('@/components/layouts/ProductDetail/ProductImageGallery').then(mod => mod.default),
  { loading: () => <div className="w-full h-[500px] bg-gray-100 animate-pulse" />, ssr: false }
);

const ProductDetailsSection = dynamic(
  () => import('@/components/layouts/ProductDetail/ProductDetailsSection').then(mod => mod.default),
  { loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse" />, ssr: false }
);

const ProductBanner = dynamic(
  () => import('@/components/layouts/ProductDetail/component/ProductBanner').then(mod => mod.default),
  { loading: () => <div className="w-full h-[200px] bg-gray-100 animate-pulse my-8" />, ssr: false }
);

const ProductTabs = dynamic(
  () => import('@/components/layouts/ProductDetail/component/ProductTabs').then(mod => mod.default),
  { loading: () => <div className="w-full h-[300px] bg-gray-100 animate-pulse my-8" />, ssr: false }
);

const FeaturedSection = dynamic(
  () => import('@/components/layouts/ProductDetail/component/FeaturedSection').then(mod => mod.default),
  { loading: () => <div className="w-full h-[600px] bg-gray-100 animate-pulse my-8" />, ssr: false }
);

const BlogSection = dynamic(
  () => import('@/components/common/BlogSection').then(mod => mod.BlogSection),
  { loading: () => <div className="w-full h-[400px] w-full my-8 bg-gray-100 animate-pulse"></div>, ssr: false }
);

const ProductsYouMayLike = dynamic(
  () => import('@/components/layouts/ProductDetail/ProductsYouMayLike').then(mod => mod.default),
  { ssr: false }
);

interface ProductClientPageProps {
  initialProduct: ProductData | null;
  initialError: string | null;
  mainIntro?: {
    title: string;
    description: string;
  };
}

const ProductClientPage: React.FC<ProductClientPageProps> = ({
  initialProduct,
  initialError,
  mainIntro = { title: 'Đặc điểm nổi bật', description: 'Khám phá những điểm đặc biệt của sản phẩm' }
}) => {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const [product, setProduct] = useState<ProductData | null>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct && !initialError);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      if (initialProduct || initialError) {
        setLoading(false);
        return;
      }
      if (!slug) {
        setError('Không tìm thấy sản phẩm');
        setLoading(false);
        return;
      }
      try {
        const response = await productService.getProductBySlug(slug as string);
        if (!isMounted) return;
        if (!response?.data) throw new Error('Không tìm thấy thông tin sản phẩm');
        setProduct(response.data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải thông tin sản phẩm');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [slug, initialProduct, initialError]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <Skeleton className="h-12 w-1/3 mb-6" />
            <div className="space-y-2 mb-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full max-w-xs" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Không tìm thấy sản phẩm'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  const cms = product?.cmsContent;

  return (
    <div className="container mx-auto px-4">
      {/* Image Gallery - CMS driven */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-8">
          <ProductImageGallery
            product={{
              ...product,
              images: cms?.sliderImages?.length
                ? cms.sliderImages.map((url, i) => ({ url, name: `gallery-${i}` }))
                : product.images
            }}
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-8">
          <ProductDetailsSection
            productId={product.id}
            productName={product.product_name || 'Sản phẩm không có tên'}
            originalPrice={product.product_price || 0}
            discount={product.discount || 0}
            description={cms?.detailsContent || product.description || ''}
            features={product.features?.map(f => f.title) || []}
            warranty={cms?.warranty || product.warranty || 'Không có thông tin bảo hành'}
            shippingInfo={cms?.shippingInfo || product.shipping_info || 'Vận chuyển toàn quốc'}
            image_url={product.images?.[0]?.url || ''}
            slug={product.slug || String(product.id)}
            tags={product.tags as any}
            category={typeof product.category_ID === 'object' ? product.category_ID : undefined}
          />
        </div>
      </div>

      {/* Product Banner - CMS driven */}
      <ProductBanner
        title={cms?.aboutTitle}
        subtitle={cms?.aboutText}
        images={cms?.aboutImages}
      />

      {/* Product Tabs - CMS driven */}
      <ProductTabs tabs={cms?.tabs || []} />

      {/* Featured Section (2-column blocks) - CMS driven */}
      <FeaturedSection
        mainIntro={{
          title: cms?.heroTitle || mainIntro.title,
          description: cms?.heroSubtitle || mainIntro.description
        }}
        sections={
          cms?.featuredSections?.length
            ? cms.featuredSections
            : product.features?.map((feature, index) => ({
                title: feature.title || `Tính năng ${index + 1}`,
                description: feature.content || '',
                imageSrc: feature.image || '/placeholder-feature.jpg',
                imageAlt: feature.title || `Feature ${index + 1}`,
                textBgColor: index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
                isImageRight: index % 2 !== 0,
              })) || []
        }
      />

      <ProductReviewsSection productId={product.id} />
      {/* Move ProductsYouMayLike here, under reviews */}
      <ProductsYouMayLike
        currentProductId={product.id}
        categoryId={typeof product.category_ID === "object" ? product.category_ID.id : undefined}
        tagIds={Array.isArray(product.tags) ? product.tags.map(tag => tag.id) : undefined}
      />
      {/* Blog and posts section below */}
      <BlogSection />
    </div>
  );
};

export default ProductClientPage;