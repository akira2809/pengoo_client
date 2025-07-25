'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const OrdersClient = dynamic(
  () => import('./OrdersClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        <div className="text-center py-12">Đang tải đơn hàng...</div>
      </div>
    )
  }
);

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrdersClient />
    </div>
  );
}