// components/ProductCard.tsx
"use client";

import React, { useState, useEffect, useRef, MouseEvent, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { ProductData } from "@/app/type/product";
import { useCartStore } from "@/app/stores/slice/cartStore";
import toast from "react-hot-toast";
import { wishlistService } from "@/app/api/services/wishlistService";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import { useRouter } from "next/navigation";
import router from "next/router";

interface ImageType {
  id: number;
  url: string;
  name?: string;
  ord?: number | null;
}

interface ProductCardProps {
  product: ProductData & {
    images?: ImageType[];
  };
}

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(numPrice);
};

const calculateFinalPrice = (originalPrice: number | string, discount?: number | string): { finalPrice: number; discountPercentage: number } => {
  const numericPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const numericDiscount = typeof discount === 'string' ? parseFloat(discount) : discount || 0;
  
  const hasDiscount = numericDiscount > 0;
  let finalPrice = numericPrice;
  let discountPercentage = 0;

  if (hasDiscount) {
    discountPercentage = Math.round(numericDiscount);
    finalPrice = numericPrice * (1 - discountPercentage / 100);
  }

  // Ensure price is not negative
  finalPrice = Math.max(0, finalPrice);

  return { finalPrice, discountPercentage };
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Calculate final price and discount
  const { finalPrice, discountPercentage } = useMemo(() => 
    calculateFinalPrice(product.product_price, product.discount),
    [product.product_price, product.discount]
  );
  const hasDiscount = discountPercentage > 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const views = JSON.parse(localStorage.getItem("productViews") || "{}");
      views[product.id] = (views[product.id] || 0) + 1;
      localStorage.setItem("productViews", JSON.stringify(views));
    }

    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
      cardRef.current.style.transform = "translateY(50px)";
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition =
            "opacity 0.8s ease-out, transform 0.8s ease-out";
          cardRef.current.style.opacity = "1";
          cardRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }

    // Kiểm tra sản phẩm có trong wishlist không (nếu đã đăng nhập)
    const fetchWishlist = async () => {
      if (!user || !user.id) return;

      try {
        const wishlistRes = await wishlistService.getWishlistByUserId(user.id);
        const wishlistArr = wishlistRes.data || [];
        const exists = Array.isArray(wishlistArr) && wishlistArr.some((item: any) => item.product_id === product.id);
        setIsWishlisted(exists);
      } catch (error) {
        console.error("Lỗi khi kiểm tra wishlist:", error);
      }
    };

    fetchWishlist();
  },  [product.id, user?.id]);

  // Helper function to validate and normalize image URL
  const getValidImageUrl = (url: string | undefined | null): string | null => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return null;
    }
    // If it's already a full URL or starts with /, return as is
    if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:image')) {
      return url;
    }
    // Otherwise, assume it's a relative path
    return `/${url.replace(/^\//, '')}`; // Ensure single leading slash
  };

  // Debug product data
  console.log('Product data:', {
    id: product.id,
    name: product.product_name,
    images: product.images,
    image_url: product.image_url
  });

  // Get main image with fallback
  const mainImage = (() => {
    // Try to get image from different possible locations
    let imgSrc = '';
    
    // Check if there are images in the images array
    if (Array.isArray(product.images) && product.images.length > 0) {
      // Try to find the main image first
      const mainImg = product.images.find(img => 'name' in img && img.name === 'main');
      if (mainImg && mainImg.url) {
        imgSrc = mainImg.url;
      } else {
        // Fallback to the first image with a URL
        const firstImage = product.images[0];
        if (firstImage && firstImage.url) {
          imgSrc = firstImage.url;
        }
      }
    } 
    
    // Fallback to image_url if no images in array
    if (!imgSrc && product.image_url) {
      imgSrc = product.image_url;
    }
    
    // Normalize the URL
    const normalized = getValidImageUrl(imgSrc);
    console.log('Main image source:', { imgSrc, normalized });
    
    return normalized || 'https://placehold.co/400x400/e5e7eb/9ca3af?text=No+Image';
  })();

  // Get hover image if available and different from main image
  let hoverImage: string | null = null;
  if (Array.isArray(product.images) && product.images.length > 1) {
    // Try to find a detail or featured image for hover
    const hoverImg = product.images.find(
      img => 'name' in img && (img.name === 'detail' || img.name === 'featured') && img.url && img.url !== mainImage
    );
    
    if (hoverImg && hoverImg.url) {
      hoverImage = getValidImageUrl(hoverImg.url);
    } else {
      // Fallback to any other image that's not the main one
      const otherImage = product.images.find(
        img => img.url && img.url !== mainImage
      );
      if (otherImage && otherImage.url) {
        hoverImage = getValidImageUrl(otherImage.url);
      }
    }
    
    console.log('Hover image:', hoverImage);
  }

  // ✅ Xử lý click thêm vào giỏ hàng
  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: Number(product.id),
      product_name: product.product_name,
      product_price: Number(product.discount ? product.product_price - (product.product_price * (product.discount / 100)) : product.product_price),
      quantity: Number(1),
      image_url: mainImage,
      discount: Number(product.discount) || 0,
      slug: product.slug,
      description: product.meta_description,
    });

    toast.success(`Đã thêm "${product.product_name}" vào giỏ hàng!`, {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#4CAF50",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  const handleAddToWishlist = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user.id) {
      toast.error("Bạn cần đăng nhập để thêm vào yêu thích.");
      router.push("/signin"); // Navigate to sign in page
      return;
    }

  try {
    if (!isWishlisted) {
      await wishlistService.addToWishlist(user.id, product.id);
      toast.success(`Đã thêm "${product.product_name}" vào danh sách yêu thích`);
      setIsWishlisted(true);
    } else {
      await wishlistService.removeFromWishlist(user.id, product.id);
      toast.success(`Đã xóa "${product.product_name}" khỏi danh sách yêu thích`);
      setIsWishlisted(false);
    }
  } catch (error: any) {
    toast.error(error.message || "Lỗi xử lý yêu thích.");
  }
};



  return (
    <Link href={`/product/${product.slug}`} className="block group" passHref>
      <article
        ref={cardRef}
        className="relative product-card bg-white border border-gray-200 rounded-xl  flex flex-col justify-between min-h-[450px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {hasDiscount && (
            <div className="bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              {Math.min(99, discountPercentage)}% OFF
            </div>
          )}
          {Number(product.quantity_sold) >= 10 && (
            <div className="bg-blue-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              Best Seller
            </div>
          )}
        </div>

        {/* Ảnh sản phẩm */}
        <div className="relative w-full h-64 flex items-center justify-center rounded-xl overflow-hidden group bg-gray-50 p-4">
          <div className="relative w-full h-full">
            <Image
              src={mainImage}
              alt={product.product_name}
              fill
              className="object-contain transition-opacity rounded-t-xl duration-300 group-hover:opacity-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/400x400/e5e7eb/9ca3af?text=No+Image';
              }}
            />
            {hoverImage && (
              <Image
                src={hoverImage}
                alt={`${product.product_name} - Hover`}
                fill
                className="object-contain opacity-0 transition-opacity rounded-t-xl duration-300 group-hover:opacity-100 absolute inset-0"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="absolute bottom-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Nút trái tim */}
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full shadow hover:bg-background-50 border transition-colors duration-200
                ${isWishlisted ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'}`}
              aria-label="Yêu thích"
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200
                  ${isWishlisted ? 'text-white fill-white' : 'text-gray-500'}`}
                fill={isWishlisted ? '#ef4444' : 'none'}
              />
            </button>

            {/* Nút giỏ hàng */}
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow hover:bg-background-50"
              aria-label="Thêm vào giỏ hàng"
            >
              <Plus className="w-5 h-5 text-text-900" />
            </button>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="px-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <h2
            className="text-xl sm:text-lg font-bold text-gray-900 line-clamp-2 first-letter:uppercase"
            itemProp="name"
          >
            {product.product_name}
          </h2>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.meta_description}</p>
          <div className="mt-2">
            {hasDiscount ? (
              // Display when there's a discount
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-semibold text-base">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="text-gray-400 text-xs line-through">
                    {formatPrice(product.product_price)}
                  </span>
                </div>
                <div className="text-xs text-green-600">
                  Tiết kiệm: {formatPrice(Number(product.product_price) - finalPrice)}
                </div>
              </div>
            ) : (
              // Display when there's no discount
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-semibold text-base">
                  {formatPrice(product.product_price)}
                </span>
                <span className="text-xs text-green-600">
                  (Đã bao gồm VAT)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nút Mua ngay */}
        <button className="w-full bg-background-900 text-white py-2 rounded-b-xl hover:bg-background-800 transition">
          Mua ngay
        </button>
      </article>
    </Link>
  );
};

export default ProductCard;
