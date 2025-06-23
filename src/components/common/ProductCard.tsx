'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductData } from '@/app/type/product';

interface ProductCardProps {
  product: ProductData;
}

// Định dạng giá tiền
const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return 'N/A';
  return num.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).replace('VND', 'đ').trim();
};

// --- ĐIỀU CHỈNH QUAN TRỌNG TẠI ĐÂY ---
// Hàm normalizePrice giờ đây sẽ xử lý cả số và chuỗi số nguyên (có/không có dấu phân cách)
const normalizePrice = (price: string | number): number => {
  if (typeof price === 'number') {
    return price; // Nếu đã là số, trả về luôn
  }
  // Nếu là chuỗi, loại bỏ tất cả các ký tự không phải số
  // Sau đó chuyển đổi thành số nguyên.
  const cleanedString = String(price).replace(/[^0-9]/g, ''); 
  return parseInt(cleanedString, 10); // Đảm bảo chuyển thành số nguyên
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  console.log(product.product_price);
  console.log(product.discount);
  // Loại bỏ logic HOT_VIEW_THRESHOLD và isHot nếu bạn không sử dụng chúng
  // Nếu vẫn muốn giữ, hãy tách ra useEffect riêng và cân nhắc logic server/client như đã bàn

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'translateY(50px)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          cardRef.current.style.opacity = '1';
          cardRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, []);

  const mainImage = product.images?.[0]?.url || '/placeholder.jpg';
  const hoverImage = product.images?.find(img => img?.url !== mainImage)?.url;

  // Lấy giá gốc và giảm giá
  const originalPrice = parseFloat(String(product.product_price).replace(/[^0-9]/g, '')) || 0;
  const discountPercentage = parseFloat(String(product.discount)) || 0;

  // Tính toán giá sau giảm giá chính xác
  const discountAmount = Math.round((originalPrice * discountPercentage) / 100);
  const finalPrice = originalPrice - discountAmount;

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <article
        ref={cardRef}
        className="bg-white rounded-3xl p-4 transition-transform hover:scale-[1.02]"
      >
        {/* Các nhãn giảm giá / Best Seller */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              {Math.min(99, Math.round(discountPercentage))}% OFF
            </div>
          )}
          {Number(product.quantity_sold) >= 10 && (
            <div className="bg-blue-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              Best Seller
            </div>
          )}
        </div>

        {/* Hình ảnh sản phẩm */}
        <div className="relative w-full h-[300px] sm:h-[380px] overflow-hidden">
          <Image
            src={mainImage}
            alt={product.product_name}
            fill
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // Placeholder và blurDataURL chỉ hoạt động nếu hình ảnh là tĩnh hoặc bạn có blurDataURL động
            // Nếu bạn dùng external images, Next.js sẽ tự động tạo placeholder hoặc bạn cần cấu hình loader
            // placeholder="blur" 
            // blurDataURL="/blur-placeholder.jpg" 
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.product_name} - hover`}
              fill
              className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        {/* Tên + Giá */}
        <div className="mt-4">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 h-10">
            {product.product_name}
          </h2>
          <div className="mt-2 flex items-center">
            {discountPercentage > 0 ? (
              <>
                <span className="text-red-500 font-bold text-sm sm:text-base">
                  {formatPrice(finalPrice)}
                </span>
                <span className="ml-2 text-gray-500 text-xs line-through">
                  {formatPrice(originalPrice)}
               </span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-sm sm:text-base">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;