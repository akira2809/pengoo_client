"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { ProductPageLayout } from '@/app/(public)/products/component/ProductPageLayout';
import { useStore } from '@/app/stores/store';
import { productService } from '@/app/api/services/productService';

export default function ProductsPage() {
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts 
  } = useStore();

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: 0,
    maxPrice: 5000000
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const searchParams = useSearchParams();
  const sort = searchParams.get('sort');

  // Chỉ fetch dữ liệu 1 lần và lọc hiển thị theo sort
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts(); // fetch và lưu vào store
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    const loadTags = async () => {
      try {
        const response = await productService.getTags();
        setTags(response.data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };

    loadProducts();
    loadCategories();
    loadTags();
  }, [sort]);  // 👈 KHÔNG phụ thuộc filters nữa

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Định dạng lại dữ liệu sản phẩm và lọc theo `sort`
  const formattedProducts = products
    .map(product => ({
      ...product,
      id: typeof product.id === 'string' ? Number(product.id) : product.id,
      category_ID: typeof product.category_ID === 'string' ? Number(product.category_ID) : product.category_ID,
      publisher_ID: typeof product.publisher_ID === 'string' ? Number(product.publisher_ID) : product.publisher_ID,
      status: String(product.status || ''),
      discount: Number(product.discount) || 0,
      createdAt: product.createdAt || '',
    }))
    .filter(product => {
      if (sort === 'discount') return product.discount > 0;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  return (
    <ProductPageLayout 
      products={formattedProducts} 
      isLoading={isLoading} 
      error={error} 
      setFilters={setFilters} 
      categories={categories} 
      tags={tags}
    />
  );
}
