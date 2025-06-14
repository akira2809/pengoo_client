import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { gsap } from 'gsap'; // Remove gsap import
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Remove ScrollTrigger import

// gsap.registerPlugin(ScrollTrigger); // Remove gsap plugin registration

import { ProductData } from '@/app/type/product';

interface ProductCardProps {
  product: ProductData;
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    currencyDisplay: 'code'
  }).replace('VND', 'đ').trim();
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'translateY(50px)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
          cardRef.current.style.opacity = '1';
          cardRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, []);

  const mainImage = product.image_url || '/placeholder.jpg';
  let hoverImage: string | undefined;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const otherImage = product.images.find(img => 
      img?.url && 
      typeof img.url === 'string' && 
      img.url.trim() !== '' && 
      img.url !== mainImage
    );
    hoverImage = otherImage?.url;
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block group"
      passHref
    >
      <article
        ref={cardRef}
        className="product-card bg-[#F5F5F5] rounded-3xl p-4 relative group transition-transform hover:scale-[1.02] cursor-pointer"
        itemScope
        itemType="https://schema.org/Product"
      >
        {Number(product.discount) > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold z-20">
            <span itemProp="discount">
              {Math.min(99, Math.round((1 - (Number(product.discount) / Number(product.product_price))) * 100))}% OFF
            </span>
          </div>
        )}

        <div className="relative w-full h-[300px] sm:h-[380px] flex items-center justify-center overflow-hidden">
          <Image
            src={mainImage}
            alt={`${product.image_url} - hình ảnh`}
            fill
            className="object-contain z-0 transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.image_url} khi hover`}
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
            {product.product_name}
          </h3>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-red-600 font-bold" itemProp="price">
              {formatPrice(product.discount > 0 ? product.discount : product.product_price)}
            </span>
            {product.discount > 0 && product.discount < product.product_price && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(product.product_price)}
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