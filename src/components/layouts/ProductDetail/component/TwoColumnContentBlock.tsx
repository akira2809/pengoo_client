// src/components/common/ProductDetail/component/TwoColumnContentBlock.tsx
import React from 'react';
import { ProductFeature } from '@/app/type/product';

export const TwoColumnContentBlock: React.FC<Omit<ProductFeature, 'isFirstBlock'>> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  textBgColor,
  isImageRight,
}) => (
  <div className={`flex flex-col ${isImageRight ? 'md:flex-row' : 'md:flex-row-reverse'} max-w-[85%] mx-auto`}>
    <div 
      className="w-full md:w-1/2 min-h-[300px] md:min-h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${imageSrc})` }}
      aria-label={imageAlt}
    />
    <div 
      className="w-full md:w-1/2 p-8 md:p-12 mx-auto"
      style={{ backgroundColor: textBgColor }}
    >
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  </div>
);