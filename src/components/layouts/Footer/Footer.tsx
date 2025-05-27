// components/layouts/Footer/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#F9DEA1] text-[var(--footer-text)] py-12 px-4 md:px-8 lg:px-16">
      {/* Top Section */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-gray-300 pb-8 mb-8">
        {/* Cột Đăng ký (Newsletter) */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-lg mb-4">Đăng ký</h3>
          <p className="text-sm mb-4">
            Nhận ngay mã giảm giá 10% cho đơn đặt hàng đầu tiên
          </p>
          <button className="bg-[#8A5B3D] text-white px-6 py-3 rounded-md hover:bg-[#7a4c30] transition-colors text-sm font-semibold">
            Get 10% off
          </button>
        </div>

        {/* Cột Đăng ký (Giới thiệu, Cách chơi...) */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-lg mb-4">Đăng ký</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">Giới thiệu</Link></li>
            <li><Link href="/how-to-play" className="hover:underline">Cách chơi</Link></li>
            <li><Link href="/commitment" className="hover:underline">Cam kết</Link></li>
            <li><Link href="/press" className="hover:underline">Press</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
          </ul>
        </div>

        {/* Cột Theo dõi */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-lg mb-4">Theo dõi</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</Link></li>
            <li><Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</Link></li>
            <li><Link href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Pinterest</Link></li>
            <li><Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Youtube</Link></li>
          </ul>
        </div>

        {/* Cột Hợp tác */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-lg mb-4">Hợp tác</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/business-gift" className="hover:underline">Quà tặng doanh nghiệp</Link></li>
            <li><Link href="/wholesale-partner" className="hover:underline">Đối tác mua sỉ</Link></li>
            <li><Link href="/custom-design" className="hover:underline">Thiết kế theo yêu cầu</Link></li>
            <li><Link href="/product-catalog" className="hover:underline">Catalogue sản phẩm</Link></li>
          </ul>
        </div>

        {/* Cột Chính sách */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-lg mb-4">Chính sách</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/return-policy" className="hover:underline">Đổi trả</Link></li>
            <li><Link href="/shipping-policy" className="hover:underline">Giao hàng</Link></li>
            <li><Link href="/privacy-policy" className="hover:underline">Bảo mật</Link></li>
            <li><Link href="/contact" className="hover:underline">Liên hệ</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section - Thông tin công ty và bản quyền */}
      {/* Sử dụng text-[var(--footer-text)] cho phần này */}
      <div className="container mx-auto text-sm text-[var(--footer-text)]"> 
        <h4 className="font-semibold text-base mb-2">Công ty TNHH Pengoo</h4>
        <p className="mb-1">
          Địa chỉ: 6/10 Cách Mạng Tháng 8, P.Bến Thành, Q1, TP.HCM
        </p>
        <p className="mb-4">
          GPKD: 0317015950, cấp ngày 05/11/2021, tại sở KH&ĐT TP HCM
        </p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} Pengoo. All rights reserved.</p>
      </div>
    </footer>
  );
}