// src/components/common/ProductDetail/component/TwoColumnContentBlock.tsx
import React from 'react';

interface Props {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  textBgColor?: string;
  isImageRight?: boolean;
}

const TwoColumnContentBlock: React.FC<Props> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  textBgColor = '#fff',
  isImageRight = false,
}) => (
  <div
    className={`flex flex-col md:flex-row items-stretch my-10 rounded-2xl shadow-lg transition border bg-white`}
    style={{ background: textBgColor }}
  >
    <div className={`md:w-1/2 px-8 py-10 flex flex-col justify-center ${isImageRight ? 'md:order-2' : ''}`}>
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">{title}</h3>
      <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
    </div>
    <div className={`md:w-1/2 px-8 py-10 flex items-center justify-center ${isImageRight ? 'md:order-1' : ''}`}>
      <div className="w-full flex justify-center">
        <img
          src={imageSrc}
          alt={imageAlt || title}
          className="rounded-xl shadow-xl max-w-xs w-full object-cover border border-gray-200 bg-gray-50"
          style={{ minHeight: "180px", maxHeight: "320px" }}
        />
      </div>
    </div>
  </div>
);

export default TwoColumnContentBlock;