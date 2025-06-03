// components/Cart.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const Cart: React.FC = () => {
  // Dữ liệu giả lập cho sản phẩm trong giỏ hàng
  // Tôi sẽ chỉ để 1 sản phẩm để khớp với ảnh bạn cung cấp
  const [cartItems] = useState([
    {
      id: '1',
      name: 'Bầu Cua Khai Xuân',
      price: 999000,
      quantity: 1,
      image: '/MM_BoxSet4_2-min.png',
    }
  ]);

  // Tính toán tổng tiền giả lập
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Định dạng tiền tệ VND
  const formatCurrency = (amount: number) => {
    // Sử dụng tùy chọn minimumFractionDigits: 0 để loại bỏ số thập phân nếu là số nguyên
    // và style 'decimal' để có dấu chấm phân cách hàng nghìn, sau đó thêm '₫'
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted}₫`; // Thêm ký tự '₫' vào cuối
  };

  // Giá trị cứng cho phần tổng và thành tiền để khớp ảnh
  const fixedTotal = formatCurrency(999000);
  const fixedGrandTotal = formatCurrency(999000);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:px-6 lg:px-8 xl:px-20 xl:py-16 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
        Giỏ hàng
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
        {/* Phần danh sách sản phẩm */}
        <div className="w-full lg:flex-1 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          {cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 sm:py-5 border-b border-gray-200 last:border-b-0">
              <div className="sm:col-span-5 flex items-start space-x-3 sm:space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-md border border-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">{item.name}</p>
                  <p className="text-gray-700 text-sm sm:hidden mt-1">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              
              <div className="sm:col-span-7 grid grid-cols-3 gap-2 sm:gap-4 items-center">
                <p className="hidden sm:block text-gray-700 text-right sm:text-center">
                  {formatCurrency(item.price)}
                </p>
                <div className="flex items-center justify-center">
                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    className="w-16 sm:w-20 border border-gray-300 rounded text-center py-1 text-sm sm:text-base"
                    onChange={(e) => {}}
                  />
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
                    onClick={() => alert(`Xóa sản phẩm ${item.name}`)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <p className="text-center text-gray-500 py-8">Giỏ hàng của bạn đang trống.</p>
          )}
        </div>

        {/* Phần tổng tiền và thanh toán */}
        <div className="w-full lg:w-96 xl:w-[28rem] border border-gray-200 flex-shrink-0 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-sm sm:text-base">Tổng</span>
              <span className="font-medium text-sm sm:text-base">{fixedTotal}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="font-semibold text-sm sm:text-base">Thành tiền</span>
              <span className="font-semibold text-base sm:text-lg">{fixedGrandTotal} VND</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            Thuế và phí vận chuyển sẽ được tính khi thanh toán
          </p>

          <div className="mb-4 sm:mb-6">
            <label htmlFor="order-note" className="block text-gray-700 text-sm sm:text-base mb-2">
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
            className="w-full bg-amber-900 hover:bg-amber-800 text-white font-medium py-2 sm:py-3 rounded-md text-sm sm:text-base flex items-center justify-center space-x-2 transition-colors"
            onClick={() => alert('Chức năng thanh toán')}
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