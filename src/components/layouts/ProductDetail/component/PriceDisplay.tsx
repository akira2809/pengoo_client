// components/PriceDisplay.tsx
import React from 'react';

interface PriceDisplayProps {
  originalPrice: number;
  percentageDiscount?: number; // Ví dụ: 12 cho 12%
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  originalPrice,
  percentageDiscount = 0,
  className = '',
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, // Không hiển thị số lẻ
    }).format(price);
  };

  const hasDiscount = percentageDiscount > 0;
  let finalPriceToDisplay: number;
  let displayDiscountPercentage: number = 0;

  if (hasDiscount) {
    finalPriceToDisplay = originalPrice * (1 - percentageDiscount / 100);
    displayDiscountPercentage = Math.round(percentageDiscount);
  } else {
    finalPriceToDisplay = originalPrice;
  }

  // Đảm bảo giá giảm không âm
  finalPriceToDisplay = Math.max(0, finalPriceToDisplay);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {hasDiscount ? (
        // Hiển thị khi có giảm giá: Giá đã giảm + % giảm + Giá gốc gạch ngang
        <>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-500"> {/* Giá đã giảm */}
              {formatPrice(finalPriceToDisplay)}
            </span>
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
              {displayDiscountPercentage}% GIẢM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 line-through"> {/* Giá gốc */}
              {formatPrice(originalPrice)}
            </span>
          </div>
        </>
      ) : (
        // Hiển thị khi KHÔNG có giảm giá: Chỉ Giá gốc
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#4B3C2D]"> {/* Giá gốc */}
            {formatPrice(originalPrice)}
          </span>
          <span className="text-xs text-green-600 ml-1">
            (Giá đã bao gồm VAT)
          </span>
        </div>
      )}
      
      {hasDiscount && (
        <div className="text-xs text-green-600 mt-1">
          Tiết kiệm: {formatPrice(originalPrice - finalPriceToDisplay)} ({displayDiscountPercentage}%)
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;