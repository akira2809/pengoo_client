// src/app/HomePage.tsx (hoặc src/app/page.tsx)
"use client"; // Đảm bảo dòng này ở đầu file

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/common/ProductCard';
import Banner from '@/components/layouts/HomePage/Banner/Banner';
import BannerHotspot from '@/components/layouts/HomePage/Banner/Banner-hotspot';
import CollectionSection from '@/components/layouts/HomePage/collection/CollectionSection';
import BenefitsSection from '@/components/layouts/HomePage/BenefitsSection/BenefitsSection';
import HeadlineMarquee from '@/components/layouts/HomePage/HeadlineMarquee';
import { SmoothScrollHero } from '@/components/layouts/HomePage/HeroScrollZoom';
import { AboutMaztermindSection } from '@/components/layouts/HomePage/AboutMaztermindSection';
import { VideoSection } from '@/components/layouts/HomePage/VideoSection';
import { TestimonialCarousel } from '@/components/layouts/HomePage/TestimonialCarousel';
import { BlogSection } from '@/components/common/BlogSection';
import { productService } from '@/app/api/services/productService';
import { ProductData } from '@/app/type/product';
import { Skeleton } from '@/components/common/UI/Skeleton';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        // Fetch featured products (you might want to add a specific endpoint for featured products)
        const response = await productService.getProducts();
        if (response?.data) {
          setFeaturedProducts(response.data.slice(0, 4)); // Get first 4 products as featured
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Banner />

      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Sản phẩm nổi bật 🔥
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Link
                  href="/products"
                  className="px-6 py-3 border border-black rounded-full text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-colors duration-300"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <BannerHotspot />
      <CollectionSection />
      <BenefitsSection />
      <HeadlineMarquee />
      <SmoothScrollHero />
      <AboutMaztermindSection />
      <VideoSection />
      <TestimonialCarousel />
      <BlogSection />
    </>
  );
}

export default HomePage;