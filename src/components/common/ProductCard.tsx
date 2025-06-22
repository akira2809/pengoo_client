// components/ProductCard.tsx
"use client";

import React, { useEffect, useRef, useState, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductData } from "@/app/type/product";
import { useCartStore } from "@/app/stores/slice/cartStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: ProductData;
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice
    .toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    })
    .replace("VND", "đ")
    .trim();
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem); // ✅ lấy action addItem
  const [isHot, setIsHot] = useState(false);
  const HOT_VIEW_THRESHOLD = 5;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const views = JSON.parse(localStorage.getItem("productViews") || "{}");
      views[product.id] = (views[product.id] || 0) + 1;
      localStorage.setItem("productViews", JSON.stringify(views));
      setIsHot(views[product.id] >= HOT_VIEW_THRESHOLD);
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
  }, [product.id]);

  const mainImage = product.images?.[0] || "/placeholder.jpg";
  let hoverImage: string | undefined;
  if (Array.isArray(product.images)) {
    const otherImage = product.images.find(
      (img) => img?.url && img.url.trim() !== "" && img.url !== mainImage
    );
    hoverImage = otherImage?.url;
  }

  // ✅ Xử lý click thêm vào giỏ hàng
  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: Number(product.id),
      product_name: product.product_name,
      product_price: Number(product.discount || product.product_price),
      quantity: 1,
      image_url: mainImage,
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

  return (
    <Link href={`/product/${product.slug}`} className="block group" passHref>
      <article
        ref={cardRef}
        className="relative product-card bg-white border border-gray-200 rounded-lg  flex flex-col justify-between min-h-[450px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {Number(product.discount) > 0 && (
            <div className="bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              {Math.min(
                99,
                Math.round(
                  (1 - Number(product.discount) / Number(product.product_price)) * 100
                )
              )}
              % OFF
            </div>
          )}
          {Number(product.quantity_sold) >= 10 && (
            <div className="bg-blue-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
              Best Seller
            </div>
          )}
        </div>

        {/* Ảnh sản phẩm */}
        <div className="relative w-full h-64 flex items-center justify-center overflow-hidden group">
          <Image
            src={mainImage}
            alt={product.product_name}
            fill
            objectFit="cover"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={product.product_name}
              fill
              objectFit="cover"
              className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Nút Thêm vào giỏ */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background-50"
            aria-label="Thêm vào giỏ hàng"
          >
            <Plus className="w-5 h-5 text-text-900" />
          </button>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="px-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <h2
            className="text-2xl sm:text-xl font-bold text-gray-900 line-clamp-2 h-10"
            itemProp="name"
          >
            {product.product_name}
          </h2>
          <p className="text-xs text-gray-400 line-clamp-2 mb-2">{product.meta_description}</p>
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
                <span className="text-gray-800 font-semibold text-sm sm:text-base">
                  {formatPrice(product.product_price)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nút Mua ngay */}
        <button className="w-full bg-background-900 text-white py-2 rounded-b-lg hover:bg-background-800 transition">
          Buy Now
        </button>
      </article>
    </Link>
  );
};

export default ProductCard;
