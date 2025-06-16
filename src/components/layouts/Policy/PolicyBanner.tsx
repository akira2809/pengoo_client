// components/AboutUsBanner.tsx
import React from 'react';

interface PolicyBannerProps {
  title: string; // Có thể truyền tiêu đề động vào banner
}

const PolicyBanner: React.FC<PolicyBannerProps> = ({ title}) => {
  return (
    <div className="relative w-full h-[20vw] md:h-[20vw] flex items-center justify-center overflow-hidden">

      {/* Overlay (tùy chọn, để làm mờ ảnh nền và làm nổi bật chữ hơn) */}
      <div className="absolute inset-0 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-black text-center px-4">
        <h1
          className="text-3xl md:text-5xl font-extrabold tracking-wide"
         // Thêm shadow cho chữ để nổi bật
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PolicyBanner;