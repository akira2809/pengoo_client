// src/app/(auth)/_components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';

const menuItems = [
  { name: 'Thông tin tài khoản', href: '/account' },
  { name: 'Đơn hàng của tôi', href: '/account/orders' },
  { name: 'Địa chỉ giao hàng', href: '/account/addresses' },
  { name: 'Đổi mật khẩu', href: '/account/change-password' },
  { name: 'Yêu thích', href: '/account/wishlist' },
  { name: 'Mã khuyến mãi', href: '/account/voucher' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
        <div>
          <h2 className="text-xl font-bold mb-6">Tài khoản của tôi</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}