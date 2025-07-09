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
  name?: string;
  ord?: number | null;
  isMain?: boolean;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
  const [mainImage, setMainImage] = useState<string>(product.image_url || '');
  const [thumbnails, setThumbnails] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (!Array.isArray(product.images) || product.images.length === 0) {
      setMainImage(product.image_url || '');
      setThumbnails([]);
      return;
    }

    // Find the main image (with name 'main' or use the first image as fallback)
    const mainImg = product.images.find(img => img.name === 'main') || product.images[0];
    const initialMainImage = mainImg?.url || product.image_url || '';
    setMainImage(initialMainImage);

    // Process all images including the main one for thumbnails
    const uniqueImages = new Map();
    const processedImages = [];
    
    // Include all unique images in thumbnails
    for (const img of product.images) {
      if (!img?.url) continue; // Skip if no URL
      
      // Create a unique key based on the image name and first part of filename
      const urlParts = img.url.split('/');
      const fileName = urlParts[urlParts.length - 1].split('.')[0];
      const imageKey = img.name || fileName.split('_')[0]; // Use image name or first part of filename
      
      // Only add if we haven't seen an image with this key before
      if (!uniqueImages.has(imageKey)) {
        uniqueImages.set(imageKey, true);
        processedImages.push({
          url: img.url,
          alt: `${product.product_name || 'Product image'} ${img.name || ''}`.trim(),
          name: img.name,
          ord: img.ord || 0,
          isMain: img.url === initialMainImage
        });
      }
    }
    
    // Sort images by their order (ord) if specified
    processedImages.sort((a, b) => (a.ord || 0) - (b.ord || 0));
    
    setThumbnails(processedImages);
  }, [product]);

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  // Use the already sorted thumbnails and ensure main image is first
  const sortedThumbnails = [...thumbnails].sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnails */}
      {(sortedThumbnails.length > 0) && (
        <div className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:pr-3">
          {sortedThumbnails.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative rounded overflow-hidden transition-all ${
                mainImage === image.url 
                  ? 'ring-2 ring-[#4B3C2D] ring-offset-1' 
                  : 'hover:ring-1 hover:ring-gray-300'
              } ${image.isMain ? 'border-2 border-[#4B3C2D]' : ''}`}
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