// src/app/HomePage.tsx (hoặc src/app/page.tsx)
"use client"; // Đảm bảo dòng này ở đầu file

import React from 'react';
import Banner from '@/components/layouts/HomePage/Banner/Banner';
import { ProductCard } from '@/components/common/ProductCard';
import BannerHotspot from '@/components/layouts/HomePage/Banner/Banner-hotspot';
import CollectionSection from '@/components/layouts/HomePage/collection/CollectionSection';
import BenefitsSection from '@/components/layouts/HomePage/BenefitsSection/BenefitsSection';
import HeadlineMarquee from '@/components/layouts/HomePage/HeadlineMarquee';
import { SmoothScrollHero } from '@/components/layouts/HomePage/HeroScrollZoom';
import { AboutMaztermindSection } from '@/components/layouts/HomePage/AboutMaztermindSection';
import { VideoSection } from '@/components/layouts/HomePage/VideoSection';
import { TestimonialCarousel } from '@/components/layouts/HomePage/TestimonialCarousel';
import { BlogSection } from '@/components/common/BlogSection';
import Link from 'next/link';
// Đảm bảo đường dẫn đúng cho DUMMY_PRODUCTS
import { DUMMY_PRODUCTS } from '@/app/api/data/product';

function HomePage() {

  return (
    <>
      <Banner />

      {/* Cách 2: Hiển thị nhiều sản phẩm trong một lưới */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Sản phẩm nổi bật 🔥
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"> {/* Thêm md:grid-cols-3 cho màn hình trung bình */}
            {DUMMY_PRODUCTS.slice(0, 4).map(product => ( // Lấy 4 sản phẩm đầu tiên để hiển thị
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