"use client";

// components/ProductImageGallery.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<ProductImage | undefined>(images[0]);

  const handleThumbnailClick = (image: ProductImage) => {
    setMainImage(image);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:pr-3">
        {images.map((image, index) => (
          <button
            key={index}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative rounded overflow-hidden transition-all ${
              mainImage?.src === image.src 
                ? 'ring-2 ring-[#4B3C2D] ring-offset-1' 
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => handleThumbnailClick(image)}
          >
            <Image 
              src={image.src} 
              alt={image.alt} 
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
        {mainImage && (
          <Image 
            src={mainImage.src} 
            alt={mainImage.alt} 
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