import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const [isHot, setIsHot] = useState(false);
  const HOT_VIEW_THRESHOLD = 5; // Số lần xem cần thiết để sản phẩm được đánh dấu là "Hot"

  useEffect(() => {
    // Kiểm tra xem sản phẩm đã "Hot" chưa
    const checkIfHot = () => {
      const views = JSON.parse(localStorage.getItem('productViews') || '{}');
      if ((views[product.id] || 0) >= HOT_VIEW_THRESHOLD) {
        setIsHot(true);
      } else {
        setIsHot(false);
      }
    };

    // Chỉ kiểm tra khi chạy ở phía client
    if (typeof window !== 'undefined') {
      // Kiểm tra trạng thái hot ban đầu
      checkIfHot();
      
      // Theo dõi số lần xem sản phẩm trong localStorage
      const trackView = () => {
        const views = JSON.parse(localStorage.getItem('productViews') || '{}');
        const viewCount = (views[product.id] || 0) + 1;
        views[product.id] = viewCount;
        localStorage.setItem('productViews', JSON.stringify(views));
        
        // Cập nhật state isHot dựa trên viewCount mới
        if (viewCount >= HOT_VIEW_THRESHOLD) {
          setIsHot(true);
        } else {
          setIsHot(false);
        }
      };

      trackView();
    }

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
  }, [product.id]);

  const mainImage = product.images?.[0] || '/placeholder.jpg';
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
        className="product-card bg-white rounded-3xl p-4 relative group transition-transform hover:scale-[1.02] cursor-pointer"
        itemScope
        itemType="https://schema.org/Product"
      >
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {Number(product.discount) > 0 && (
            <div className="bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              <span itemProp="discount">
                {Math.min(99, Math.round((1 - (Number(product.discount) / Number(product.product_price))) * 100))}% OFF
              </span>
            </div>
          )}
          
          {/* {isHot && (
            <div className="bg-yellow-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              HOT
            </div>
          )} */}
          
          {Number(product.quantity_sold) >= 10 && (
            <div className="bg-blue-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              Best Seller
            </div>
          )}
        </div>

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
          <h2
            className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 h-10"
            itemProp="name"
          >
            {product.product_name}
          </h2>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              {Number(product.discount) > 0 ? (
                <>
                  <span className="text-red-500 font-bold text-sm sm:text-base">
                    {formatPrice(product.discount)}
                  </span>
                  <span className="ml-2 text-gray-500 text-xs line-through">
                    {formatPrice(product.product_price)}
                  </span>
                </>
              ) : (
                <span className="text-gray-900 font-bold text-sm sm:text-base">
                  {formatPrice(product.product_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;