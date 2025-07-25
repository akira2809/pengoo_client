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
  const initialMainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : '';

  const [mainImage, setMainImage] = useState<string>(initialMainImage);
  const [thumbnails, setThumbnails] = useState<ImageItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!Array.isArray(product.images) || product.images.length === 0) {
      setMainImage('');
      setThumbnails([]);
      return;
    }

    const mainImg = product.images.find(img => img.name === 'main') || product.images[0];
    const initialMainImage = mainImg?.url || '';
    setMainImage(initialMainImage);

    const uniqueImages = new Map();
    const processedImages = [];
    for (const img of product.images) {
      if (!img?.url) continue;
      const urlParts = img.url.split('/');
      const fileName = urlParts[urlParts.length - 1].split('.')[0];
      const imageKey = img.name || fileName.split('_')[0];
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
    processedImages.sort((a, b) => (a.ord || 0) - (b.ord || 0));
    setThumbnails(processedImages);
  }, [product]);

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const sortedThumbnails = [...thumbnails].sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return 0;
  });

  return (
    <>
      <div className="flex flex-col-reverse xl:flex-row gap-6 w-full">
        {/* Thumbnails */}
        {(sortedThumbnails.length > 0) && (
          <div className="flex xl:flex-col gap-2 xl:gap-3 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 xl:pr-3">
            {sortedThumbnails.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-16 h-16 xl:w-20 xl:h-20 relative rounded-lg overflow-hidden transition-all
                  ${mainImage === image.url 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : 'hover:ring-2 hover:ring-blue-300'}
                  ${image.isMain ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                onClick={() => handleThumbnailClick(image.url)}
                aria-label={`Chọn ảnh ${index + 1}`}
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
        <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shadow">
          {mainImage ? (
            <Image 
              src={mainImage} 
              alt={product.product_name || 'Product main image'} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
              priority
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">Không có ảnh</div>
          )}
          {/* Modal open button */}
          <button 
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors border border-gray-200"
            aria-label="Xem ảnh lớn"
            onClick={() => setShowModal(true)}
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

      {/* Modal for big image */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowModal(false)} // Close modal when clicking backdrop
        >
          <div
            className="relative max-w-3xl w-full flex flex-col items-center"
            onClick={e => e.stopPropagation()} // Prevent modal close when clicking inside modal
          >
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-blue-50 border border-gray-200"
              aria-label="Đóng ảnh lớn"
              onClick={() => setShowModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={mainImage}
              alt={product.product_name || 'Product main image'}
              width={800}
              height={800}
              className="object-contain rounded-lg max-h-[80vh] bg-white"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;