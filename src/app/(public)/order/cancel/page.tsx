'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Create a client component that handles the dynamic import
const OrderCancelClient = dynamic(
  () => import('./OrderCancelContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <div className="h-6 w-6 text-red-600"></div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Đang xử lý...</h1>
            <div className="mt-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
            </div>
          </div>
        </div> email
      </div>
    )
  }
);

// This is now a client component that wraps the dynamic import
export default function OrderCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <div className="h-6 w-6 text-red-600"></div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Đang tải...</h1>
          </div>
        </div>
      </div>
    }>
      <OrderCancelClient />
    </Suspense>
  );
}
