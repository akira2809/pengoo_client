import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap'; // Import GSAP

// Định nghĩa kiểu (interface) cho mỗi đối tượng lợi ích
interface Benefit {
  id: number;
  icon: React.ReactNode; // Kiểu của icon có thể là một React element (JSX)
  title: string;
  description: string;
}

// Dữ liệu mẫu cho các lợi ích
const benefits: Benefit[] = [
  {
    id: 1,
    icon: (
      // Biểu tượng kim cương (SVG)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-gray-700"
      >
        <path d="M2.75 8.75L12 2l9.25 6.75L12 22 2.75 8.75z" />
      </svg>
    ),
    title: "Bảo hành 12 tháng",
    description: "Áp dụng với tất cả sản phẩm của Pengoo. An tâm mua sắm tại website chính hãng.",
  },
  {
    id: 2,
    icon: (
      // Biểu tượng xe tải (SVG)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-gray-700"
      >
        <path d="M14 18l5 5 5-5" />
        <path d="M22 18V2a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h14" />
        <path d="M18 18H4" />
        <path d="M2 12h12" />
        <path d="M12 12V2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="16" cy="18" r="2" />
      </svg>
    ),
    title: "Miễn phí giao hàng",
    description: "Giao hàng toàn quốc. Miễn phí vận chuyển với đơn hàng trên 1 triệu đồng.",
  },
  {
    id: 3,
    icon: (
      // Biểu tượng mặt cười (SVG)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-gray-700"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: "Thêm ưu đãi 10%",
    description: "Nhận ngay mã giảm 10% đối với các khách hàng lần đầu tiên mua sắm tại Pengoo.vn",
  },
];

export default function BenefitsSection() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null); // Ref cho container chứa tất cả các slide

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Mobile khi nhỏ hơn md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // useEffect để animate slide khi currentSlide thay đổi
  useEffect(() => {
    if (isMobile && sliderRef.current) {
      // Tính toán giá trị translateX để hiển thị slide hiện tại
      // Mỗi slide chiếm 100% chiều rộng của container
      const translateXValue = -currentSlide * 100;
      gsap.to(sliderRef.current, {
        x: `${translateXValue}%`,
        duration: 0.5, // Thời gian chuyển động
        ease: "power3.out", // Hiệu ứng easing
      });
    }
  }, [currentSlide, isMobile]); // Chạy lại khi currentSlide hoặc isMobile thay đổi

  // Hàm render nội dung của một thẻ lợi ích
  const renderBenefitCard = (benefit: Benefit) => (
    // Đảm bảo mỗi slide có width: 100% và flex-shrink-0 để không bị co lại
    <div className="flex-none w-full flex flex-col items-center p-4">
      {/* Vòng tròn nền cho icon */}
      <div className="bg-[#F6F4F1] p-6 rounded-full inline-flex items-center justify-center mb-6 shadow-sm">
        {benefit.icon}
      </div>
      {/* Tiêu đề của lợi ích */}
      <h3 className="text-xl sm:text-2xl font-bold text-text-800 mb-2">
        {benefit.title}
      </h3>
      {/* Mô tả chi tiết của lợi ích */}
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
        {benefit.description}
      </p>
    </div>
  );

  return (
    <section className="bg-background-300 py-16 px-4 sm:px-6 lg:px-16 text-center mb-16">
      <div className="max-w-screen-xl mx-auto overflow-hidden"> {/* Thêm overflow-hidden */}
        {/* Grid layout cho tablet và desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {benefits.map((benefit: Benefit) => (
            <React.Fragment key={benefit.id}>
              {renderBenefitCard(benefit)}
            </React.Fragment>
          ))}
        </div>

        {/* Carousel/Slide layout cho mobile */}
        <div className="md:hidden"> {/* Ẩn trên md trở lên */}
          {/* Container chứa tất cả các slide, dùng ref để GSAP thao tác */}
          <div ref={sliderRef} className="flex transition-transform duration-300"> {/* Removed transition-transform to let GSAP control */}
            {benefits.map((benefit: Benefit) => (
              <React.Fragment key={benefit.id}>
                {renderBenefitCard(benefit)}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination Dots - chỉ hiện trên mobile */}
          <div className="flex justify-center mt-4">
            {benefits.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full mx-1 cursor-pointer transition-colors duration-300 ${
                  index === currentSlide ? 'bg-gray-700' : 'bg-gray-400'
                }`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}