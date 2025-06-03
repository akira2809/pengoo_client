// components/AboutSection.tsx
import React from 'react';
import Image from 'next/image';

interface AboutSectionProps {
  imageUrl: string;
  altText: string;
  title: string;
  description: string;
  imageOnRight?: boolean; // Tùy chọn để đảo ngược vị trí ảnh và văn bản
}

const AboutSection: React.FC<AboutSectionProps> = ({
  imageUrl,
  altText,
  title,
  description,
  imageOnRight = false, // Mặc định ảnh ở bên trái
}) => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div
        className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
          imageOnRight ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Cột hình ảnh */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <div className="relative w-full h-80 md:h-[700px] rounded-lg overflow-hidden shadow-lg"> {/* Đã chỉnh: h-full thành h-80 */}
            <Image
              src={imageUrl}
              alt={altText}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Cột nội dung văn bản */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }} // Giữ lại font-family để khớp thiết kế bạn đã cung cấp trước đó
            >
            {title}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;