"use client";
import { useEffect, useState, useRef } from "react";
import { ProductData } from "@/app/type/product";
import { productService } from "@/app/api/services/productService";
import ProductCard from "@/components/common/ProductCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsYouMayLikeProps {
  currentProductId: number | string;
  categoryId?: number;
  tagIds?: number[];
}

export default function ProductsYouMayLike({
  currentProductId,
  categoryId,
  tagIds,
}: ProductsYouMayLikeProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderInstanceRef, slider] = useKeenSlider<HTMLDivElement>({
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

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      if (slider.current) {
        slider.current.next();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [slider]);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let fetched: ProductData[] = [];
        if (categoryId) {
          const res = await productService.getProducts({
            limit: 8,
            page: 1,
            category: String(categoryId),
          });
          fetched = res.data?.filter((p: ProductData) => p.id !== currentProductId) || [];
        }
        if ((!fetched || fetched.length < 4) && tagIds && tagIds.length > 0) {
          const tagRes = await productService.getProducts({ limit: 12, page: 1 });
          const tagFiltered =
            tagRes.data?.filter(
              (p: ProductData) =>
                p.id !== currentProductId &&
                p.tags?.some((tag) => tagIds.includes(Number(tag)))
            ) || [];
          const ids = new Set(fetched.map((p) => p.id));
          fetched = [...fetched, ...tagFiltered.filter((p) => !ids.has(p.id))];
        }
        if (!cancelled) setProducts(fetched.slice(0, 8));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [currentProductId, categoryId, tagIds]);

  if (loading || !products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <h2 className="text-2xl font-bold mb-6 text-text-900">
        Sản phẩm bạn có thể thích
      </h2>

      <div className="relative">
        {/* Nút điều hướng nằm cùng hàng với slide */}
        {slider && (
          <>
            <button
              onClick={() => slider.current?.prev()}
              className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => slider.current?.next()}
              className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
            >
              <ChevronRight />
            </button>
          </>
        )}

        <div ref={(ref) => {
          sliderRef.current = ref;
          sliderInstanceRef(ref);
        }} className="keen-slider">
          {products.map((product) => (
            <div key={product.id} className="keen-slider__slide">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
