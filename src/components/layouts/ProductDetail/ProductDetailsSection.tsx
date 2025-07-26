// components/ProductDetailsSection.tsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import PriceDisplay from './component/PriceDisplay';
import QuantitySelector from './component/QuantitySelector';
import Button from './component/Button';
import InfoItem from './component/InfoItem';
import { useCartStore } from '@/app/stores/slice/cartStore';
import toast from 'react-hot-toast';

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
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  productId,
  productName,
  originalPrice,
  discount,
  description,
  warranty,
  shippingInfo,
  image_url = '',
  slug = '',
  tags = [],
  category,
  quantity_stock = 0
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const addItem = useCartStore(state => state.addItem);
  // Process tags to ensure they're in the correct format
  // const processedTags = React.useMemo(() => {
  //   if (!Array.isArray(tags)) return [];
    
  //   return tags.map((tag: Tag | string | Record<string, unknown>, index) => {
  //     // If the tag is a string that looks like [object Object], handle it
  //     if (typeof tag === 'string') {
  //       console.warn('Found string tag:', tag);
  //       return { 
  //         id: Date.now() + index, 
  //         name: tag === '[object Object]' ? 'Invalid Tag' : tag, 
  //         type: 'unknown' 
  //       };
  //     }
      
  //     // If the name is [object Object], try to find the actual name in the tag object
  //     if (tag && typeof tag === 'object' && tag.name === '[object Object]') {
  //       console.warn('Found tag with [object Object] name:', tag);
  //       // Try to find a property that looks like a name
  //       const possibleName = Object.entries(tag).find(
  //         ([key, value]) => 
  //           key !== 'name' && 
  //         key !== 'id' && 
  //         key !== 'type' &&
  //         typeof value === 'string' && 
  //         value !== '[object Object]'
  //       );
        
  //       if (possibleName) {
  //         return {
  //           id: Number(tag.id) || Date.now() + index,
  //           name: possibleName[1] as string,
  //           type: String(tag.type || 'unknown')
  //         };
  //       }
  //     }
      
  //     // If tag is already in the correct format, return it as is
  //     if (tag && typeof tag === 'object' && 'id' in tag && 'name' in tag && 'type' in tag) {
  //       // console.log("tag" + tag)
  //       console.log("tags" + tags)
  //       return {
  //         id: Number(tag.id) || Date.now() + index,
  //         name: String(tag.name === '[object Object]' ? 'Unknown Tag' : tag.name),
  //         type: String(tag.type || 'unknown')
  //       };
  //     }
      
  //     // Fallback for any other cases
  //     console.warn('Unexpected tag format:', tag);
  //     return { 
  //       id: (tag && typeof tag === 'object' && 'id' in tag) ? Number(tag.id) : Date.now() + index,
  //       name: 'Unknown Tag',
  //       type: (tag && typeof tag === 'object' && 'type' in tag) ? String(tag.type) : 'unknown'
  //     };
  //   });
  // }, [tags]);

  // Debug logging
  React.useEffect(() => {
    // console.log('Raw tags from props:', JSON.stringify(tags, null, 2));
    // console.log('Processed tags:', processedTags);
  }, [tags]);

  const calculatedDiscountedPrice = discount && discount > 0
    ? originalPrice * (1 - discount / 100)
    : originalPrice;

  const handleAddToCart = () => {
    addItem({
      id: Number(productId),
      product_name: productName,
      product_price: calculatedDiscountedPrice,
      quantity: quantity,
      image_url: image_url,
      slug: slug,
      description: description,
      discount: 0
    });
    toast.success(`Đã thêm ${quantity} sản phẩm "${productName}" vào giỏ hàng!`, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#4CAF50',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    toast.success(`Đang tiến hành mua ${quantity} sản phẩm "${productName}"!`, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#4CAF50',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    });
  };

  // Log tags for debugging
  React.useEffect(() => {
    // console.log('Tags received:', tags);
  }, [tags]);

  // Extract genres and other tags from processed tags
  // const genres = processedTags.filter(tag => tag?.type?.toLowerCase() === 'genre');
  // const otherTags = processedTags.filter(tag => tag?.type?.toLowerCase() !== 'genre');

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-[#4B3C2D] underline">Trang chủ</Link>
        <span className="mx-1">/</span>
        <Link href="/products" className="hover:text-[#4B3C2D] underline">Sản phẩm</Link>
        {category && (
          <>
            <span className="mx-1">/</span>
            <span className="hover:text-[#4B3C2D]">{category.name}</span>
          </>
        )}
        <span className="mx-1">/</span>
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
          percentageDiscount={discount}
        />
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed text-sm">
          {description}
        </p>
      </div>

      {/* Tags and Genres */}
      {(tags.length > 0) ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs font-semibold text-gray-600">Thể loại:</span>
              {tags.map(tag => (
                <span key={tag.id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                  {tag?.name || 'N/A'}
                </span>
              ))}
            </div>
          )}
          {/* {otherTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs font-semibold text-gray-600">Tags:</span>
              {otherTags.map(tag => (
                <span key={tag.id} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                  {tag?.name || 'N/A'}
                </span>
              ))}
            </div>
          )} */}
        </div>
      ) : (
        <div className="mb-6 text-sm text-gray-500">
          Không có tags nào cho sản phẩm này.
        </div>
      )}
      
      {/* Quantity Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Số lượng</span>
          <QuantitySelector 
            quantity={quantity} 
            onQuantityChange={setQuantity}
            max={quantity_stock}
            className="w-36"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button 
          variant="primary" 
          className="flex-1 justify-center py-3 text-sm font-medium bg-background-900 hover:bg-background-800 text-white"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1 justify-center py-3 text-sm font-medium border border-background-900 text-background-900 hover:bg-background-50"
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