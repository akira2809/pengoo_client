// components/ProductDetailsSection.tsx
"use client"
import React, { useState } from 'react';
import PriceDisplay from './component/PriceDisplay';
import QuantitySelector from './component/QuantitySelector';
import Button from './component/Button';
import InfoItem from './component/InfoItem';
import FeatureAccordion from './component/FeatureAccordion';

interface ProductDetailsSectionProps {
  productName: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  features: string[];
  warranty: string;
  shippingInfo: string;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  productName,
  originalPrice,
  discountedPrice,
  description,
  features,
  warranty,
  shippingInfo,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    console.log(`Đã thêm ${quantity} sản phẩm "${productName}" vào giỏ hàng.`);
    alert(`Đã thêm ${quantity} sản phẩm "${productName}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    console.log(`Mua ngay ${quantity} sản phẩm "${productName}".`);
    alert(`Đang tiến hành mua ${quantity} sản phẩm "${productName}"!`);
  };

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="hover:text-[#4B3C2D]">Trang chủ</span>
        <span className="mx-2">/</span>
        <span className="hover:text-[#4B3C2D]">Sản phẩm</span>
        <span className="mx-2">/</span>
        <span className="text-[#4B3C2D] font-medium">{productName}</span>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {productName}
      </h1>
      
      {/* Price */}
      <div className="mb-6">
        <PriceDisplay 
          originalPrice={originalPrice} 
          discountedPrice={discountedPrice}
        />
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed text-sm">
          {description}
        </p>
      </div>
      
      {/* Features */}
      <div className="mb-6">
        <FeatureAccordion 
          title="Tính năng sản phẩm"
          features={features} 
        />
      </div>
      
      {/* Quantity Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Số lượng</span>
          <QuantitySelector 
            quantity={quantity} 
            onQuantityChange={setQuantity}
            className="w-36"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button 
          variant="primary" 
          className="flex-1 justify-center py-3 text-sm font-medium"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1 justify-center py-3 text-sm font-medium"
          onClick={handleBuyNow}
        >
          Mua ngay
        </Button>
      </div>
      
      {/* Warranty & Shipping */}
      <div className="space-y-3 mb-6">
        <InfoItem 
          icon={
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
          text={warranty}
          className="text-sm"
        />
        <InfoItem 
          icon={
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          } 
          text={shippingInfo}
          className="text-sm"
        />
      </div>
      
      {/* Guarantee */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-amber-800">Đảm bảo an toàn thanh toán</p>
          <p className="text-xs text-amber-700 mt-1">Bảo mật thông tin khách hàng tuyệt đối</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;