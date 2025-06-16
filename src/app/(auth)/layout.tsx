// src/app/(auth)/layout.tsx
'use client';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layouts/Auth/Sidebar';

// Danh sách các route không hiển thị sidebar
const NO_SIDEBAR_PATHS = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/register'
];

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Chỉ hiển thị sau khi component đã mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  const showSidebar = !NO_SIDEBAR_PATHS.some(path => 
    pathname?.startsWith(path) ?? false
  );

  // Nếu là trang auth (không hiển thị sidebar), chỉ render children
  if (!showSidebar) {
    return <>{children}</>;
  }

  // Nếu là trang tài khoản (hiển thị sidebar)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}