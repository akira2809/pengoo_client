// components/CoreValuesSection.tsx
import React from 'react';
import Image from 'next/image';

interface CoreValueProps {
  iconUrl: string; // Đường dẫn đến hình ảnh/icon cho giá trị
  title: string;
  description: string;
}

const CoreValueItem: React.FC<CoreValueProps> = ({ iconUrl, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      {/* Hình ảnh/Icon */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 mb-6 rounded-lg overflow-hidden shadow-md"> {/* Kích thước hình ảnh lớn hơn */}
        <Image
          src={iconUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      {/* Tiêu đề */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      {/* Mô tả */}
      <p className="text-gray-700 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
};

interface CoreValuesSectionProps {
  values: CoreValueProps[]; // Mảng các giá trị cốt lõi
}

const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ values }) => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      {/* Tiêu đề chính */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12 md:mb-16"
          >
        GIÁ TRỊ CỐT LÕI
      </h2>

      {/* Danh sách các giá trị */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {values.map((value, index) => (
          <CoreValueItem
            key={index}
            iconUrl={value.iconUrl}
            title={value.title}
            description={value.description}
          />
        ))}
      </div>
    </section>
  );
};

export default CoreValuesSection;