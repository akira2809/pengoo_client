// src/components/common/ProductCard.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Import kiểu ProductData từ file types đã cập nhật
import { ProductData } from '@/app/type/product';

interface ProductCardProps {
  product: ProductData; // Sử dụng ProductData mới
}

// Hàm format giá
const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          autoAlpha: 0,
          y: 50,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  // Lấy ảnh chính và ảnh hover (nếu có)
  const mainImage = product.images[0]?.src || '/placeholder.jpg'; // Ảnh chính là ảnh đầu tiên
  const hoverImage = product.images.length > 1 ? product.images[1]?.src : undefined; // Ảnh hover là ảnh thứ hai nếu có

  return (
    <Link
      href={`/product/${product.slug}`} // Sử dụng slug để link
      className="block group"
      passHref
    >
      <article
        ref={cardRef}
        className="product-card bg-[#F5F5F5] rounded-3xl p-4 relative group transition-transform hover:scale-[1.02] cursor-pointer"
        itemScope
        itemType="https://schema.org/Product"
      >
        {product.discount && ( // Sử dụng trường discount mới
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold z-20">
            <span itemProp="discount">{product.discount}</span>
          </div>
        )}

        <div className="relative w-full h-[300px] sm:h-[380px] flex items-center justify-center overflow-hidden">
          <Image
            src={mainImage}
            alt={`${product.name} - hình ảnh`}
            fill
            className="object-contain z-0 transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} khi hover`}
              fill
              className="object-contain z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        <div
          className="mt-4"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <h3
            className="text-sm sm:text-base font-medium text-black"
            itemProp="name"
          >
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-red-600 font-bold" itemProp="price">
              {formatPrice(product.discountedPrice)} {/* Sử dụng discountedPrice */}
            </span>
            {product.originalPrice > product.discountedPrice && ( // Chỉ hiển thị nếu có giảm giá
              <span
                className="text-gray-400 line-through text-sm"
                itemProp="priceCurrency"
                content="VND"
              >
                {formatPrice(product.originalPrice)} {/* Sử dụng originalPrice */}
              </span>
            )}
          </div>
          <link
            itemProp="availability"
            href="https://schema.org/InStock"
          />
        </div>
      </article>
    </Link>
  );
};