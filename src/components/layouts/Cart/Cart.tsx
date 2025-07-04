// components/Cart.tsx
"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/stores/slice/cartStore";

const Cart: React.FC = () => {
  const router = useRouter();

  // Get cart data from store
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();

  // Calculate subtotal from cart items
  const subtotal = getTotalPrice();

  // Handle quantity change
  const handleQuantityChange = (id: number, newQuantity: number | string) => {
    const quantity = Math.max(1, Math.round(Number(newQuantity)));
    if (isNaN(quantity)) return;
    updateQuantity(id, quantity);
  };

  // Handle remove item
  const handleRemoveItem = (id: number) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")
    ) {
      removeItem(id);
    }
  };

  // Định dạng tiền tệ VND
  const formatCurrency = (amount: number) => {
    // Sử dụng tùy chọn minimumFractionDigits: 0 để loại bỏ số thập phân nếu là số nguyên
    // và style 'decimal' để có dấu chấm phân cách hàng nghìn, sau đó thêm '₫'
    const formatted = new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted}₫`; // Thêm ký tự '₫' vào cuối
  };

  // Calculate total and grand total
  const total = formatCurrency(subtotal);
  const grandTotal = formatCurrency(subtotal);

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push('/checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:px-6 lg:px-8 xl:px-20 xl:py-16 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
        Giỏ hàng
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
        {/* Phần danh sách sản phẩm */}
        <div className="w-full lg:flex-1 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 sm:py-5 border-b border-gray-200 last:border-b-0"
            >
              <div className="sm:col-span-5 flex items-start space-x-3 sm:space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.product_name || "Product image"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
                    {item.product_name}
                  </p>
                  <p className="text-gray-700 text-sm sm:hidden mt-1">
                    {formatCurrency(item.product_price)}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-7 grid grid-cols-3 gap-2 sm:gap-4 items-center">
                <p className="hidden sm:block text-gray-700 text-right sm:text-center">
                  {formatCurrency(item.product_price)}
                </p>
                <div className="flex items-center justify-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    className="w-16 sm:w-20 border border-gray-300 rounded text-center py-1 text-sm sm:text-base"
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      updateQuantity(item.id, value);
                    }}
                  />
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    {formatCurrency(
                      Number(item.product_price) *
                        Number(item.quantity) *
                        (1 - (Number(item.discount) || 0) / 100)
                    )}
                  </p>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Giỏ hàng của bạn đang trống.
            </p>
          )}
        </div>

        {/* Phần tổng tiền và thanh toán */}
        <div className="w-full lg:w-96 xl:w-[28rem] border border-gray-200 flex-shrink-0 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-sm sm:text-base">Tổng</span>
              <span className="font-medium text-sm sm:text-base">{total}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <p className="text-lg font-bold">Thành tiền:</p>
              <p className="text-lg font-bold text-blue-600">{grandTotal}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            Thuế và phí vận chuyển sẽ được tính khi thanh toán
          </p>

          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="order-note"
              className="block text-gray-700 text-sm sm:text-base mb-2"
            >
              Ghi chú đơn hàng
            </label>
            <textarea
              id="order-note"
              className="block w-full px-3 py-2 text-sm sm:text-base text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
              rows={3}
              placeholder="Ghi chú đơn hàng"
            ></textarea>
          </div>

          <button
            type="button"
            className={`w-full bg-amber-900 hover:bg-amber-800 text-white font-medium py-2 sm:py-3 rounded-md text-sm sm:text-base flex items-center justify-center space-x-2 transition-colors ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Thanh toán</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
