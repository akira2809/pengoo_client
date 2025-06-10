// src/app/(public)/product/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductData, ProductFeature } from '@/app/type/product';
import { productService } from '@/app/api/services/productService';
// import ProductImageGallery from '@/components/layouts/ProductDetail/ProductImageGallery'; ẩn do testtest
import ProductDetailsSection from '@/components/layouts/ProductDetail/ProductDetailsSection';
import ProductBanner from '@/components/layouts/ProductDetail/component/ProductBanner';
import ProductTabs from '@/components/layouts/ProductDetail/component/ProductTabs';
import GameOfDrunksFeatureSection from '@/components/layouts/ProductDetail/component/GameOfDrunksFeatureSection';
import { BlogSection } from '@/components/common/BlogSection';
import { Skeleton } from '@/components/common/UI/Skeleton';
import { mockFeatureSections, mockMainIntro } from '@/app/api/data/mockProducts';
interface ProductPageProps {
  product: ProductData;
  mainIntro: {
    title: string;
    description: string;
  };
  featureSections: ProductFeature[];
}

const ProductDetailPage: React.FC<ProductPageProps> = ({
  product,
  mainIntro,
  featureSections
}) => {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-8">
          {/* <ProductImageGallery 
            images={product.image_url}     // ẩn do test 
            alt={product.product_name} 
          /> */}
        </div>
        <div className="w-full md:w-1/2 md:pl-8">
          <ProductDetailsSection 
            productName={product.product_name} 
            originalPrice={product.product_price}
            discountedPrice={product.discount}
            description={product.description}
            warranty={product.warranty}
            shippingInfo={product.shipping_info}
            isLoading={false} 
          />
        </div>
      </div>
      
      <ProductBanner />
      <ProductTabs />
      
      <GameOfDrunksFeatureSection
        mainIntro={mainIntro}
        sections={featureSections}
      />
      
      <BlogSection />
    </div>
  );
};

export default function ProductDetailPageWrapper() {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProduct = async () => {
      if (!slug) {
        setError('Không tìm thấy sản phẩm');
        setLoading(false);
        return;
      }

      try {
        const response = await productService.getProductBySlug(slug as string);
        if (!isMounted) return;
        
        if (!response?.data) {
          throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        setProduct(response.data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải thông tin sản phẩm');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

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



  const featureSections: ProductFeature[] = mockFeatureSections;
  const mainIntro = mockMainIntro;
  
  return (
    <ProductDetailPage 
      product={product}
      mainIntro={mainIntro}
      featureSections={featureSections}
    />
  );
}