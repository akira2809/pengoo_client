// src/app/(public)/product/[slug]/ProductLoader.tsx
"use client"; // Đây là một Client Component

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import { ProductData } from '@/app/type/product';

// Tạo một component Fallback mặc định
const Fallback = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-100 animate-pulse ${className}`}></div>
);

// Dynamic import của ProductClientPage bên trong Client Component này
// Đây là nơi bạn có thể dùng ssr: false một cách an toàn
const ProductClientPage = dynamic(
  () => import('../../../../components/page/Detailpage/ProductClientPage').then((mod) => mod.default),
  {
    ssr: false, // Hợp lệ ở đây vì ProductLoader.tsx là Client Component
    loading: () => (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-8">
            <Fallback className="aspect-square w-full rounded-lg" />
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Fallback key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <Fallback className="h-8 w-3/4 mb-4" />
            <Fallback className="h-6 w-1/3 mb-4" />
            <Fallback className="h-4 w-1/2 mb-6" />
            <Fallback className="h-12 w-1/3 mb-6" />
            <div className="space-y-2 mb-6">
              {[1, 2, 3].map((i) => (
                <Fallback key={i} className="h-4 w-full" />
              ))}
            </div>
            <Fallback className="h-12 w-full max-w-xs" />
          </div>
        </div>
      </div>
    ),
  }
);

interface ProductLoaderProps {
    initialProduct: ProductData | null;
    initialError: string | null;
}

export default function ProductLoader({ initialProduct, initialError }: ProductLoaderProps) {
  return (
    <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 md:pr-8">
                    <Fallback className="aspect-square w-full rounded-lg" />
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Fallback key={i} className="aspect-square rounded-md" />
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-1/2 md:pl-8">
                    <Fallback className="h-8 w-3/4 mb-4" />
                    <Fallback className="h-6 w-1/3 mb-4" />
                    <Fallback className="h-4 w-1/2 mb-6" />
                    <Fallback className="h-12 w-1/3 mb-6" />
                    <div className="space-y-2 mb-6">
                        {[1, 2, 3].map((i) => (
                            <Fallback key={i} className="h-4 w-full" />
                        ))}
                    </div>
                    <Fallback className="h-12 w-full max-w-xs" />
                </div>
            </div>
        </div>
    }>
      <ProductClientPage initialProduct={initialProduct} initialError={initialError} />
    </Suspense>
  );
}