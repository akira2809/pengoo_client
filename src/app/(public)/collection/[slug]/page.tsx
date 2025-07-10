"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/app/stores/store';
import { productService } from '@/app/api/services/productService';
import { collectionService } from '@/app/api/services/collectionService';
import { ProductPageLayout } from '@/app/(public)/products/component/ProductPageLayout';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/stores/type';
import { tagService } from '@/app/api/services/tagService';

/**
 * TODO: Chuyển đổi từ ID-based routing sang slug-based routing khi backend hỗ trợ
 * - Hiện tại đang sử dụng ID làm slug tạm thời
 * - Khi có API slug, cần thay đổi:
 *   1. Thay đổi thư mục từ [id] thành [slug]
 *   2. Cập nhật interface CollectionPageProps.params
 *   3. Cập nhật logic tìm kiếm category trong useEffect
 */

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  products?: Product[];
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  productCount?: number;
  products: Product[];
}

interface CollectionPageProps {
  params: {
    /**
     * @todo Chuyển đổi thành slug khi backend hỗ trợ
     * Hiện tại đang sử dụng ID để tương thích với API hiện có
     */
    id: string;
    slug: string;  
  };
}

// Define the filter type for ProductPageLayout
type FilterType = {
  name: string;
  category: string;
  tags: string;
  minPrice: number;
  maxPrice: number;
};

// Define a type for the product with additional UI-specific fields
type ProductWithUI = Product & {
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  product:Product[]
};

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;
  const [tags, setTags] = useState<{id: string, name: string, type: string}[]>([]);
  const router = useRouter();
  const { 
    products, 
    isLoading, 
    error,  
  } = useStore();
  
  // Map the products to match the expected type for ProductPageLayout
  const productDataForLayout = products.map((p: Product): ProductWithUI => {
    // Helper to safely get category name from category_ID
    const getCategoryName = (categoryId: unknown): string => {
      if (!categoryId) return '';
      if (typeof categoryId === 'object' && categoryId !== null && 'name' in categoryId) {
        return String((categoryId as { name: string }).name);
      }
      return String(categoryId);
    };

    // Create a base product with all required fields
    const baseProduct: Product = {
      id: p.id || '',
      product_name: p.product_name || p.name || '',
      name: p.name || p.product_name || '',
      description: p.description || '',
      product_price: p.product_price || 0,
      slug: p.slug || '',
      status: p.status || 1,
      discount: p.discount || 0,
      image_url: p.image_url || '',
      images: p.images || [],
      features: p.features || [],
      quantity_sold: p.quantity_sold || 0,
      category_ID: p.category_ID || '',
      publisher_ID: p.publisher_ID || 0,
      meta_title: p.meta_title || '',
      meta_description: p.meta_description || '',
      tags: p.tags || [],
      created_at: p.created_at || new Date().toISOString(),
      updated_at: p.updated_at || new Date().toISOString(),
      quantity_stock: p.quantity_stock || 0,
    };

    // Combine with UI-specific properties
    return {
      ...baseProduct,
      price: baseProduct.product_price,
      image: baseProduct.image_url,
      rating: 0,
      reviews: 0,
      category: getCategoryName(baseProduct.category_ID)
    };
  });

  const [categories, setCategories] = useState<Category[]>([]);
  // const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  // const [collection, setCollection] = useState<Collection | null>(null);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);

  // Handle filters change
  const handleFiltersChange = useCallback((filters: FilterType | ((prev: FilterType) => FilterType)) => {
    // We're not implementing filter changes for the collection page
    // as it's already filtered by category
    console.log('Filters changed:', filters);
  }, []);

  // Load category and products by ID
useEffect(() => {
  let isMounted = true;

  const loadCollection = async () => {
    try {
      const res = await collectionService.getCollectionById(slug);
      if (!isMounted) return;

      if (res?.data) {
        setCurrentCollection({
          id: String(res.data.id),
          name: res.data.name,
          slug: String(slug),
          description: res.data.description,
          image: res.data.image_url,
          products: res.data.products
        });
      } else {
        console.warn(`Collection with slug ${slug} not found`);
        router.push('/404');
      }
    } catch (err) {
      console.error('Error loading collection:', err);
    }
  };

  loadCollection();

  // Fetch categories
  productService.getCategories().then(res => {
    if (res?.data) setCategories(res.data);
  });
  // Fetch tags
  tagService.getAllTags().then(res => {
    if (res?.data) setTags(res.data);
  });
  
  return () => {
    isMounted = false;
  };
}, [slug, router]);


  // Update document title
  useEffect(() => {
    if (currentCollection?.name) {
      document.title = `${currentCollection.name} | Tên cửa hàng`;
    }
    return () => {
      document.title = 'Tên cửa hàng';
    };
  }, [currentCollection]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
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

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-red-500">
          <p>Đã xảy ra lỗi khi tải sản phẩm: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {currentCollection?.name || 'Danh mục sản phẩm'}
      </h1>
      
      {currentCollection?.description && (
        <div className="mb-8 text-gray-600">
          {currentCollection.description}
        </div>
      )}
      
<ProductPageLayout 
        products={currentCollection?.products ?? []}
        isLoading={isLoading}
        error={error} 
        setFilters={handleFiltersChange}
        categories={categories.map(c => ({
          id: String(c.id),
          name: c.name,
          slug: String(c.slug),
          productCount: c.productCount || 0
        }))}
        tags={tags.map(t => ({
          id: String(t.id),
          name: t.name,
          type: t.type
        }))}
        // @todo: Thêm các prop bổ sung khi cần thiết
      />
    </div>
  );
}
