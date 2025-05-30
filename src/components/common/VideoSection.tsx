import React from 'react';

// Dữ liệu cho Video Section
const VIDEO_SECTION_CONTENT = {
  videoSrc: "/doro.mp4", // Đảm bảo video này nằm trong thư mục `public` của bạn
};

export const VideoSection = () => {
  return (
    // Các class này đã đảm bảo section không chiếm toàn bộ chiều rộng viewport.
    // Video bên trong sẽ tự động điều chỉnh theo kích thước của section này.
    <section className="relative max-w-screen-2xl mx-auto px-4 py-12 sm:px-6 lg:px-16 bg-black flex items-center justify-center h-[70vh] md:h-screen overflow-hidden">
      {/* Video element */}
      {/* Vẫn giữ w-full h-full object-cover để nó lấp đầy container section đã bị giới hạn */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline // Quan trọng cho autoplay trên thiết bị di động
        preload="auto"
      >
        <source src={VIDEO_SECTION_CONTENT.videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay để làm tối video (tùy chọn, bạn có thể xóa nếu muốn video sáng hơn) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-0"></div>

      {/* Không có Text Overlay */}
    </section>
  );
};