// app/components/HomePageLoader.tsx
"use client"; // Đây là một Client Component

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Tạo một component Fallback mặc định
const Fallback = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-100 animate-pulse ${className}`}></div>
);

// Dynamic import của HomePageClient bên trong Client Component này
// Đây là nơi bạn có thể dùng ssr: false một cách an toàn
const HomePageClient = dynamic(
  () => import('./HomePageClient').then((mod) => mod.default),
  { 
    ssr: false, // Hợp lệ ở đây vì HomePageLoader.tsx là Client Component
    loading: () => <Fallback className="min-h-screen w-full" /> 
  }
);

export default function HomePageLoader() {
  return (
    <Suspense fallback={<Fallback className="min-h-screen w-full" />}>
      <HomePageClient />
    </Suspense>
  );
}