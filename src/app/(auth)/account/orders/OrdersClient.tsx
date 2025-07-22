'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrdersContent } from '@/app/(auth)/account/orders/OrdersContent';

// This is the component that will be dynamically imported
export default function OrdersClient() {
  // This hook call is needed for Suspense boundary
  // We're not using the searchParams value directly, but the hook must be called
  useSearchParams();
  
  return (
    <Suspense fallback={<div className="text-center py-12">Đang tải...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
