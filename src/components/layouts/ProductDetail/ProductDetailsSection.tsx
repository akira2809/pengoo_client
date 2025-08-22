"use client";

import React, { useState } from "react";
import Link from "next/link";
import PriceDisplay from "./component/PriceDisplay";
import QuantitySelector from "./component/QuantitySelector";
import Button from "./component/Button";
import InfoItem from "./component/InfoItem";
import { useCartStore } from "@/app/stores/slice/cartStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import toast from "react-hot-toast";

interface Tag {
  id: number;
  name: string;
  type: string;
}

interface ProductDetailsSectionProps {
  productId: string | number;
  productName: string;
  originalPrice: number;
  discount?: number;
  description: string;
  features: string[];
  warranty: string;
  shippingInfo: string;
  isLoading?: boolean;
  image_url?: string;
  slug?: string;
  tags?: Tag[];
  category?: { id: number; name: string };
  quantity_stock: number;
  productPrice: number;
  status?: string;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  productId,
  productName,
  originalPrice,
  discount = 0,
  description,
  warranty,
  shippingInfo,
  image_url = "",
  slug = "",
  tags = [],
  category,
  quantity_stock = 0,
  status,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();
  const { user } = useAuthStore();

  // Helper function to check if product is purchasable
  const isPurchasable = () => {
    const stock = Number(quantity_stock) || 0;
    const productStatus = status?.toLowerCase();

    // Check status first - only block if explicitly set to non-available status
    if (productStatus && productStatus !== "available") {
      return false;
    }

    // Then check stock
    return stock > 0;
  };

  // Helper function to get button text and status
  const getButtonStatus = () => {
    const stock = Number(quantity_stock) || 0;
    const productStatus = status?.toLowerCase();

    // Only check specific non-available statuses
    switch (productStatus) {
      case "unavailable":
        return {
          disabled: true,
          addToCartText: "Không khả dụng",
          buyNowText: "Không khả dụng",
        };
      case "coming soon":
        return {
          disabled: true,
          addToCartText: "Sắp ra mắt",
          buyNowText: "Sắp ra mắt",
        };
      case "discontinued":
        return {
          disabled: true,
          addToCartText: "Ngừng sản xuất",
          buyNowText: "Ngừng sản xuất",
        };
      default:
        // For "available" or undefined status, check stock
        if (stock <= 0) {
          return {
            disabled: true,
            addToCartText: "Hết hàng",
            buyNowText: "Hết hàng",
          };
        }
        return {
          disabled: false,
          addToCartText: "Thêm vào giỏ hàng",
          buyNowText: "Mua ngay",
        };
    }
  };

  const handleAddToCart = () => {
    if (!isPurchasable()) {
      const productStatus = status?.toLowerCase();
      switch (productStatus) {
        case "unavailable":
          toast.error("Sản phẩm hiện không khả dụng.");
          break;
        case "coming soon":
          toast.error("Sản phẩm sắp ra mắt, vui lòng chờ đợi.");
          break;
        case "discontinued":
          toast.error("Sản phẩm đã ngừng sản xuất.");
          break;
        default:
          toast.error("Sản phẩm đã hết hàng.");
      }
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.id === Number(productId)
    );
    const currentQty = existingItem?.quantity || 0;
    const totalAfterAdd = currentQty + quantity;

    if (totalAfterAdd > quantity_stock) {
      toast.error(`Chỉ còn ${quantity_stock} sản phẩm trong kho`, {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    addItem({
      id: Number(productId),
      product_name: productName,
      product_price: originalPrice,
      quantity: quantity,
      image_url,
      slug,
      description,
      discount,
      quantity_stock,
    });

    toast.success(
      `Đã thêm ${quantity} sản phẩm "${productName}" vào giỏ hàng!`,
      {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!isPurchasable()) {
      const productStatus = status?.toLowerCase();
      switch (productStatus) {
        case "unavailable":
          toast.error("Sản phẩm hiện không khả dụng.");
          break;
        case "coming soon":
          toast.error("Sản phẩm sắp ra mắt, vui lòng chờ đợi.");
          break;
        case "discontinued":
          toast.error("Sản phẩm đã ngừng sản xuất.");
          break;
        default:
          toast.error("Sản phẩm đã hết hàng.");
      }
      return;
    }

    // Kiểm tra số lượng trong kho
    if (quantity > quantity_stock) {
      toast.error(`Chỉ còn ${quantity_stock} sản phẩm trong kho`, {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    // Tạo item để lưu vào localStorage cho checkout
    const buyNowItem = {
      id: Number(productId),
      product_name: productName,
      product_price: originalPrice,
      quantity: quantity, // Sử dụng số lượng đã chọn
      image_url,
      discount,
      slug,
      description,
      quantity_stock,
      timestamp: Date.now(), // Thêm timestamp để kiểm tra expire
    };

    // Lưu vào localStorage với key riêng cho buy-now (expire sau 30 phút)
    if (typeof window !== "undefined") {
      localStorage.setItem("buy-now-item", JSON.stringify(buyNowItem));
    }

    // Kiểm tra đăng nhập
    if (!user || !user.id) {
      toast.error("Bạn cần đăng nhập để mua hàng.");
      router.push(
        `/signin?redirect=${encodeURIComponent("/checkout?mode=buy-now")}`
      );
      return;
    }

    // Chuyển đến trang checkout
    router.push("/checkout?mode=buy-now");
  };

  // Filter tags
  const genres = tags.filter((tag) => tag.type === "genre");
  const ageTags = tags.filter((tag) => tag.type === "age");
  const otherTags = tags.filter(
    (tag) => tag.type !== "genre" && tag.type !== "age"
  );

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-[#4B3C2D] underline">
          Trang chủ
        </Link>
        <span className="mx-1">/</span>
        <Link href="/products" className="hover:text-[#4B3C2D] underline">
          Sản phẩm
        </Link>
        {category && (
          <>
            <span className="mx-1">/</span>
            <span className="hover:text-[#4B3C2D]">{category.name}</span>
          </>
        )}
        <span className="mx-1">/</span>
        <span className="text-[#4B3C2D] font-medium">{productName}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {productName}
      </h1>

      {/* Price */}
      <div className="mb-6">
        <PriceDisplay
          originalPrice={originalPrice}
          percentageDiscount={discount}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed text-sm">{description}</p>
      </div>

      {/* Tags */}
      {genres.length > 0 || ageTags.length > 0 || otherTags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs font-semibold text-gray-600">
                Thể loại:
              </span>
              {genres.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs whitespace-nowrap"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          {ageTags.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-600">
                Độ tuổi:
              </span>
              {ageTags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          {otherTags.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-600">Tags:</span>
              {otherTags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs whitespace-nowrap"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 text-sm text-gray-500">
          Không có tags nào cho sản phẩm này.
        </div>
      )}

      {/* Quantity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Số lượng</span>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            max={quantity_stock}
            className={`w-36 ${
              !isPurchasable() ? "opacity-50 pointer-events-none" : ""
            }`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          variant="primary"
          className={`flex-1 justify-center py-3 text-sm font-medium ${
            getButtonStatus().disabled
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-background-900 hover:bg-background-800 text-white"
          }`}
          onClick={handleAddToCart}
          disabled={getButtonStatus().disabled}
        >
          {getButtonStatus().addToCartText}
        </Button>
        <Button
          variant="secondary"
          className={`flex-1 justify-center py-3 text-sm font-medium ${
            getButtonStatus().disabled
              ? "border-gray-400 text-gray-600 cursor-not-allowed"
              : "border border-background-900 text-background-900 hover:bg-background-50"
          }`}
          onClick={handleBuyNow}
          disabled={getButtonStatus().disabled}
        >
          {getButtonStatus().buyNowText}
        </Button>
      </div>

      {/* Warranty & Shipping */}
      <div className="space-y-3 mb-6">
        <InfoItem
          icon={
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          text={warranty}
          className="text-sm"
        />
        <InfoItem
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
          }
          text={shippingInfo}
          className="text-sm"
        />
      </div>

      {/* Payment guarantee */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start">
        <svg
          className="w-5 h-5 text-amber-500 mt-0.5 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-amber-800">
            Đảm bảo an toàn thanh toán
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Bảo mật thông tin khách hàng tuyệt đối
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;
