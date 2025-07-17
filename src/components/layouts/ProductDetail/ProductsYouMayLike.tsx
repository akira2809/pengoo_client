"use client";
import { useEffect, useState } from "react";
import { ProductData } from "@/app/type/product";
import { productService } from "@/app/api/services/productService";
import ProductCard from "@/components/common/ProductCard";

interface ProductsYouMayLikeProps {
  currentProductId: number | string;
  categoryId?: number;
  tagIds?: number[];
}

export default function ProductsYouMayLike({ currentProductId, categoryId, tagIds }: ProductsYouMayLikeProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Prefer category, fallback to tags
        let fetched: ProductData[] = [];
        if (categoryId) {
          const res = await productService.getProducts({ limit: 8, page: 1, category: String(categoryId) });
          fetched = res.data?.filter((p: ProductData) => p.id !== currentProductId) || [];
        }
        // If not enough, or no category, try tags
        if ((!fetched || fetched.length < 4) && tagIds && tagIds.length > 0) {
          const tagRes = await productService.getProducts({ limit: 12, page: 1 });
          const tagFiltered = tagRes.data?.filter((p: ProductData) =>
            p.id !== currentProductId &&
            p.tags?.some((tag: any) => tagIds.includes(tag.id))
          ) || [];
          // Merge and deduplicate
          const ids = new Set(fetched.map(p => p.id));
          fetched = [...fetched, ...tagFiltered.filter(p => !ids.has(p.id))];
        }
        if (!cancelled) setProducts(fetched.slice(0, 8));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [currentProductId, categoryId, tagIds]);

  if (loading) return null;
  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Sản phẩm bạn có thể thích</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}