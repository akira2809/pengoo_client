"use client";

// components/ProductImageGallery.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductData } from '@/app/type/product';

interface ProductImageGalleryProps {
  product: ProductData;
}

interface ImageItem {
  url: string;
  alt?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
  const [mainImage, setMainImage] = useState<string>(product.image_url || '');
  const [thumbnails, setThumbnails] = useState<ImageItem[]>([]);

  useEffect(() => {
    // Set main image from product.image_url
    if (product.image_url) {
      setMainImage(product.image_url);
    }

    // Process additional images from product.images
    if (Array.isArray(product.images) && product.images.length > 0) {
      const processedImages = product.images
        .filter(img => img?.url && img.url !== product.image_url)
        .map(img => ({
          url: img.url,
          alt: product.product_name || 'Product image'
        }));
      
      setThumbnails(processedImages);
    }
  }, [product]);

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  // Combine main image with additional thumbnails for display
  const allImages = [
    { url: product.image_url, alt: product.product_name },
    ...thumbnails
  ].filter(img => img.url);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:pr-3">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative rounded overflow-hidden transition-all ${
                mainImage === image.url 
                  ? 'ring-2 ring-[#4B3C2D] ring-offset-1' 
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
              onClick={() => handleThumbnailClick(image.url)}
            >
              <Image 
                src={image.url} 
                alt={image.alt || `Product image ${index + 1}`} 
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
        {mainImage && (
          <Image 
            src={mainImage} 
            alt={product.product_name || 'Product main image'} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
            priority
          />
        )}
        <button 
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Xem ảnh lớn"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductImageGallery;