import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

// Dữ liệu mẫu cho các tiêu đề/khẩu hiệu
const slogans: string[] = [
  "Play in style",
  "House of Artisan Board Games",
  "Premium Quality", // Đoán từ "P..." trong hình ảnh
  "Unique Designs",
  "Masterminds at Play",
  "Crafted for Joy"
];

// Số lần nhân đôi nội dung để đảm bảo loop mượt mà.
// Với nội dung dài, 2 hoặc 3 lần có thể đủ. Với nội dung ngắn, 4 lần như ví dụ của bạn sẽ tốt.
const DUPLICATE_COUNT = 4; 

export default function HeadlineMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null); // Ref cho div chứa nội dung cuộn

  useEffect(() => {
    if (marqueeRef.current) {
      // Vì chúng ta đã nhân đôi nội dung bằng cách render mảng `slogans` DUPLICATE_COUNT lần
      // trong JSX, nên `marqueeRef.current.scrollWidth` đã bao gồm tất cả nội dung.
      // `totalWidth` sẽ là chiều rộng của MỘT BỘ nội dung gốc.
      const totalWidth = marqueeRef.current.scrollWidth / DUPLICATE_COUNT; 
      
      // Đảm bảo không có animation nào chạy trước đó và đặt lại vị trí ban đầu
      gsap.killTweensOf(marqueeRef.current);
      gsap.set(marqueeRef.current, { x: 0 });

      // Tạo animation cuộn marquee
      gsap.to(marqueeRef.current, {
        x: `-=${totalWidth}px`, // Cuộn sang trái bằng đúng chiều rộng của một bộ nội dung
        ease: "none",          // Chuyển động đều
        duration: 40,          // Thời gian cho một vòng lặp (điều chỉnh tốc độ ở đây)
        repeat: -1,            // Lặp lại vô hạn
        onRepeat: () => {
          // Khi animation lặp lại, reset vị trí về 0 để đảm bảo vòng lặp liền mạch
          gsap.set(marqueeRef.current, { x: 0 });
        },
      });
    }
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <section className="py-12 md:py-24 overflow-hidden whitespace-nowrap mb-16">
      {/* Container cuộn */}
      <div ref={marqueeRef} className="inline-block will-change-transform">
        {/* Render nội dung DUPLICATE_COUNT lần để tạo vòng lặp liền mạch */}
        {Array.from({ length: DUPLICATE_COUNT }).map((_, duplicationIndex) => (
          <React.Fragment key={duplicationIndex}>
            {slogans.map((slogan, sloganIndex) => (
              <span
                key={`${duplicationIndex}-${sloganIndex}`} // Key duy nhất cho mỗi span
                className="inline-flex items-center px-8 md:px-16 lg:px-24" // padding ngang cho mỗi slogan
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-text-800 inline">
                  {slogan}
                </h2>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}