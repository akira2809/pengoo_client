// src/app/(public)/product/page.tsx
"use client"
import React, { useEffect } from 'react';
import { ProductPageLayout } from '@/app/(public)/product/component/ProductPageLayout';
import { useStore } from '@/app/stores/store';

export default function ProductsPage() {
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts 
  } = useStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    loadProducts();
  }, [fetchProducts]);

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

  // Format products to match ProductData type
  const formattedProducts = products.map(product => ({
    ...product,
    id: typeof product.id === 'string' ? Number(product.id) : product.id,
    category_ID: typeof product.category_ID === 'string' ? Number(product.category_ID) : product.category_ID,
    publisher_ID: typeof product.publisher_ID === 'string' ? Number(product.publisher_ID) : product.publisher_ID,
    status: String(product.status || ''), // Ensure status is a string
  }));

  return <ProductPageLayout products={formattedProducts} isLoading={isLoading} error={error} />;
}