"use client";

import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { productService } from "@/app/api/services/productService";
import { ProductData } from "@/app/type/product";
import { Skeleton } from "@/components/common/UI/Skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import ScratchMinigamePopup from "@/components/common/scratch-minigame/ScratchMinigamePopup";
import InteractiveExperience from "@/components/layouts/HomePage/InteractiveExperience/InteractiveExperience";
import { useKeenSlider } from "keen-slider/react";

// Tạo một component fallback mặc định
const Fallback = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-100 animate-pulse ${className}`}></div>
);

// Dynamic imports
const Banner = dynamic(
  () =>
    import("@/components/layouts/HomePage/Banner/Banner").then(
      (mod) => mod.default
    ),
  { loading: () => <Fallback className="h-[500px] w-full" />, ssr: false }
);

const BannerHotspot = dynamic(
  () =>
    import("@/components/layouts/HomePage/Banner/Banner-hotspot").then(
      (mod) => mod.default
    ),
  { loading: () => <Fallback className="h-[300px] w-full my-8" />, ssr: false }
);

const CollectionSection = dynamic(
  () =>
    import("@/components/layouts/HomePage/collection/CollectionSection").then(
      (mod) => mod.default
    ),
  { loading: () => <Fallback className="h-[400px] w-full my-8" />, ssr: false }
);

const BenefitsSection = dynamic(
  () =>
    import(
      "@/components/layouts/HomePage/BenefitsSection/BenefitsSection"
    ).then((mod) => mod.default),
  { loading: () => <Fallback className="h-[300px] w-full my-8" />, ssr: false }
);

const HeadlineMarquee = dynamic(
  () =>
    import("@/components/layouts/HomePage/HeadlineMarquee").then(
      (mod) => mod.default
    ),
  { loading: () => <Fallback className="h-[50px] w-full my-4" />, ssr: false }
);

const SmoothScrollHero = dynamic(
  () =>
    import("@/components/layouts/HomePage/HeroScrollZoom").then(
      (mod) => mod.SmoothScrollHero
    ),
  { loading: () => <Fallback className="h-[600px] w-full my-8" />, ssr: false }
);

const AboutPengooSection = dynamic(
  () =>
    import("@/components/layouts/HomePage/AboutPengooSection").then(
      (mod) => mod.AboutPengooSection
    ),
  { loading: () => <Fallback className="h-[500px] w-full my-8" />, ssr: false }
);

const VideoSection = dynamic(
  () =>
    import("@/components/layouts/HomePage/VideoSection").then(
      (mod) => mod.VideoSection
    ),
  { loading: () => <Fallback className="h-[500px] w-full my-8" />, ssr: false }
);

const TestimonialCarousel = dynamic(
  () =>
    import("@/components/layouts/HomePage/TestimonialCarousel").then(
      (mod) => mod.TestimonialCarousel
    ),
  { loading: () => <Fallback className="h-[300px] w-full my-8" />, ssr: false }
);

const BlogSection = dynamic(
  () =>
    import("@/components/common/BlogSection").then((mod) => mod.BlogSection),
  {
    loading: () => (
      <div className="h-[500px] w-full my-8 bg-gray-100 animate-pulse"></div>
    ),
    ssr: true,
  }
);

const DynamicProductCard = dynamic(
  () =>
    import("@/components/common/ProductCard").then((mod) => mod.ProductCard),
  { loading: () => <Fallback className="h-[400px] w-full" />, ssr: true }
);

function HomePage() {
  const [comingSoonSliderRef, comingSoonInstanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1.5,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 24 },
      },
    },
  });
  const [featuredProducts, setFeaturedProducts] = useState<ProductData[]>([]);
  const [comingSoonProducts, setComingSoonProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getProducts();
        // If response is { data: Product[] }
        // const products = response.data;
        // If response is Product[]
        const products = Array.isArray(response) ? response : response?.data;

        if (products && Array.isArray(products)) {
          const availableProducts = products.filter(
            (p) => p.status === "Available" && p.quantity_stock > 0
          );
          const comingSoon = products.filter((p) => p.status === "Coming Soon");

          setComingSoonProducts(comingSoon.slice(0, 4));
          // Multi-criteria sorting for featured products
          const sortedProducts = availableProducts.sort((a, b) => {
            // Priority 1: Products with discount (higher discount first)
            const discountA = Number(a.discount) || 0;
            const discountB = Number(b.discount) || 0;

            if (discountA !== discountB) {
              return discountB - discountA; // Higher discount first
            }

            // Priority 2: Products with sales (higher sales first)
            const soldA = Number(a.quantity_sold) || 0;
            const soldB = Number(b.quantity_sold) || 0;

            if (soldA !== soldB) {
              return soldB - soldA; // Higher sales first
            }

            // Priority 3: Newer products (if dates are available)
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();

            return dateB - dateA; // Newer products first
          });

          setFeaturedProducts(sortedProducts.slice(0, 8));
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Suspense
        fallback={
          <div className="h-[500px] w-full bg-gray-100 animate-pulse" />
        }
      >
        <Banner />
      </Suspense>

      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-text-900 flex items-center  gap-2">
            <span className="text-red-500 text-3xl">🔥</span>
            BOARD GAME GIẢM GIÁ
            <span className="text-red-500 text-3xl">🔥</span>
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                  <DynamicProductCard key={product.id} product={product} />
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

      {(isLoading || comingSoonProducts.length > 0) && (
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-900 flex items-center justify-center gap-2">
                <span className="text-blue-500 text-3xl">🚀</span>
                BOARD GAME SẮP RA MẮT
                <span className="text-blue-500 text-3xl">🚀</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => comingSoonInstanceRef.current?.prev()}
                  className="bg-white hover:bg-gray-100 p-2 rounded-full shadow disabled:opacity-50"
                  disabled={!comingSoonInstanceRef.current}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => comingSoonInstanceRef.current?.next()}
                  className="bg-white hover:bg-gray-100 p-2 rounded-full shadow disabled:opacity-50"
                  disabled={!comingSoonInstanceRef.current}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div ref={comingSoonSliderRef} className="keen-slider">
                {comingSoonProducts.map((product) => (
                  <div key={product.id} className="keen-slider__slide">
                    <DynamicProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-10">
              <Link
                href="/products?status=Coming Soon"
                className="px-6 py-3 border border-black rounded-full text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-colors duration-300"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          </div>
        </section>
      )}

      <Suspense
        fallback={
          <div className="h-[300px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <BannerHotspot />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[400px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <CollectionSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[300px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <BenefitsSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[50px] w-full bg-gray-100 animate-pulse my-4" />
        }
      >
        <HeadlineMarquee />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[600px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <SmoothScrollHero />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[500px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <AboutPengooSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[500px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <VideoSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[300px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <TestimonialCarousel />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[500px] w-full bg-gray-100 animate-pulse my-8" />
        }
      >
        <InteractiveExperience />
      </Suspense>

      <BlogSection />

      

      <ScratchMinigamePopup buttonImage="/images/minigame/greenssrb.png" />
    </>
  );
}

export default HomePage;
