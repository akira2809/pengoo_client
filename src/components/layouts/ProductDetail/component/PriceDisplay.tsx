// components/PriceDisplay.tsx
import React from 'react';

// Định nghĩa kiểu cho props của component
interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  originalPrice,
  discountedPrice: propDiscountedPrice,
  discount: propDiscount,
  className = '',
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discounted price based on discount amount if provided
  const discount = propDiscount || 0;
  const calculatedDiscountedPrice = discount > 0 ? Number(originalPrice) - Number(discount) : undefined;
  const discountedPrice = propDiscountedPrice !== undefined ? propDiscountedPrice : calculatedDiscountedPrice;
  
  const hasDiscount = (discountedPrice !== undefined && discountedPrice < originalPrice) || discount > 0;
  const discountPercentage = discount > 0 
    ? Math.round((discount / originalPrice) * 100) 
    : (discountedPrice ? Math.round((1 - discountedPrice / originalPrice) * 100) : 0);

  const finalDiscountedPrice = hasDiscount ? (discountedPrice || (originalPrice - discount)) : originalPrice;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#4B3C2D]">
            {formatPrice(finalDiscountedPrice)}
          </span>
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
            {discountPercentage}% GIẢM
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