// components/AboutUsBanner.tsx
import React from 'react';
import Image from 'next/image'; // Sử dụng Next.js Image component để tối ưu hóa hình ảnh

interface AboutUsBannerProps {
  title: string; // Có thể truyền tiêu đề động vào banner
  backgroundImage: string; // Đường dẫn đến ảnh nền
}

const AboutUsBanner: React.FC<AboutUsBannerProps> = ({ title, backgroundImage }) => {
  return (
    <div className="relative w-full h-[64vw] md:h-[56vw] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Banner Background"
        layout="fill" // Chiếm đầy đủ kích thước của parent
        objectFit="cover" // Đảm bảo ảnh bao phủ toàn bộ vùng, có thể bị cắt
        priority // Ưu tiên tải ảnh này để tránh CLS
        className="z-0"
      />

      {/* Overlay (tùy chọn, để làm mờ ảnh nền và làm nổi bật chữ hơn) */}
      <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-white text-center px-4">
        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-wide"
         // Thêm shadow cho chữ để nổi bật
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default AboutUsBanner;