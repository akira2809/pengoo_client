"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "@/app/stores/store";
import { productService } from "@/app/api/services/productService";
import { collectionService } from "@/app/api/services/collectionService";
import { ProductPageLayout } from "@/app/(public)/products/component/ProductPageLayout";
import { useRouter } from "next/navigation";
import { ProductData } from "@/app/type/product";
import { tagService } from "@/app/api/services/tagService";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  products?: ProductData[];
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  productCount?: number;
  products: ProductData[];
}

// Define the filter type for ProductPageLayout to match what ProductPageLayout expects
type FilterType = {
  name: string;
  category: string;
  minPrice: number;
  maxPrice: number;
};

interface CollectionLoaderProps {
  slug: string;
  initialCollection?: Collection | null;
  initialError?: string | null;
}

export default function CollectionLoader({ 
  slug,
  initialCollection = null,
  initialError = null
}: CollectionLoaderProps) {
  const [tags, setTags] = useState<{ id: string; name: string; type: string }[]>([]);
  const router = useRouter();
  const { isLoading, error } = useStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(initialCollection);
  const [loadError, setLoadError] = useState<string | null>(initialError);

  // Handle filters change
  const handleFiltersChange = useCallback(
    (filters: React.SetStateAction<FilterType>) => {
      // We're not implementing filter changes for the collection page
      // as it's already filtered by category
      console.log("Filters changed:", filters);
    },
    []
  );

  // Load category and products by ID
  useEffect(() => {
    let isMounted = true;

    // Only fetch if we don't have initial data
    if (!initialCollection) {
      const loadCollection = async () => {
        try {
          const res = await collectionService.getCollectionBySlug(slug);
          if (!isMounted) return;
          console.log("Collection API response:", res);
          if (res?.data) {
            setCurrentCollection({
              id: String(res.data.id),
              name: res.data.name,
              slug: String(slug),
              description: res.data.description,
              image_url: res.data.image_url,
              products: res.data.products,
            });
          } else {
            console.warn(`Collection with slug ${slug} not found`);
            setLoadError("Collection not found");
            router.push("/404");
          }
        } catch (err) {
          console.error("Error loading collection:", err);
          setLoadError("Error loading collection");
        }
      };

      loadCollection();
    }

    // Fetch categories
    productService.getCategories().then((res) => {
      if (res?.data && isMounted) setCategories(res.data);
    });
    
    // Fetch tags
    tagService.getAllTags().then((res) => {
      if (res?.data && isMounted) {
        // Ensure tags have the required type property
        const formattedTags = res.data.map(tag => ({
          id: String(tag.id),
          name: tag.name,
          type: tag.type || 'default'
        }));
        setTags(formattedTags);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, router, initialCollection]);

  // Update document title
  useEffect(() => {
    if (currentCollection?.name) {
      document.title = `${currentCollection.name} | Tên cửa hàng`;
    }
    return () => {
      document.title = "Tên cửa hàng";
    };
  }, [currentCollection]);

  console.log("Current collection:", currentCollection);
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gray-200 h-48"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || loadError) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-red-500">
          <p>Đã xảy ra lỗi khi tải sản phẩm: {error || loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {currentCollection?.name || "Danh mục sản phẩm"}
      </h1>

      {currentCollection?.description && (
        <div className="mb-8 text-gray-600">
          {currentCollection.description}
        </div>
      )}

      <ProductPageLayout
        products={currentCollection?.products ?? []}
        isLoading={isLoading}
        error={error || loadError}
        setFilters={handleFiltersChange}
        categories={categories.map((c) => ({
          id: String(c.id),
          name: c.name,
          slug: String(c.slug),
          productCount: c.productCount || 0,
        }))}
        tags={tags.map((t) => ({
          id: String(t.id),
          name: t.name,
          type: t.type,
        }))} collections={[]}        // @todo: Thêm các prop bổ sung khi cần thiết
      />
    </div>
  );
}