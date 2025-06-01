// components/PriceDisplay.tsx
import React from 'react';

// Định nghĩa kiểu cho props của component
interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice?: number;
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  originalPrice,
  discountedPrice,
  className = '',
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasDiscount = discountedPrice !== undefined && discountedPrice < originalPrice;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#4B3C2D]">
            {formatPrice(discountedPrice)}
          </span>
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
            {Math.round((1 - discountedPrice / originalPrice) * 100)}% GIẢM
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {hasDiscount ? (
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
        ) : (
          <span className="text-2xl font-bold text-[#4B3C2D]">
            {formatPrice(originalPrice)}
          </span>
        )}
        
        {!hasDiscount && (
          <span className="text-xs text-green-600 ml-1">
            (Giá đã bao gồm VAT)
          </span>
        )}
      </div>
      
      {hasDiscount && (
        <div className="text-xs text-green-600 mt-1">
          Tiết kiệm: {formatPrice(originalPrice - (discountedPrice || 0))} ({Math.round((1 - (discountedPrice || 0) / originalPrice) * 100)}%)
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;