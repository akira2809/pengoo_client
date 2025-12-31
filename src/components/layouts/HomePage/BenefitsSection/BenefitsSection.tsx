import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

interface Benefit {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    id: 1,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10"
      >
        <path d="M2.75 8.75L12 2l9.25 6.75L12 22 2.75 8.75z" />
      </svg>
    ),
    title: "Bảo hành 12 tháng",
    description:
      "Áp dụng với tất cả sản phẩm của Pengoo. An tâm mua sắm tại website chính hãng.",
  },
  {
    id: 2,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10"
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
    description:
      "Giao hàng toàn quốc. Miễn phí vận chuyển với đơn hàng trên 1 triệu đồng.",
  },
  {
    id: 3,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: "Thêm ưu đãi 10%",
    description:
      "Nhận ngay mã giảm 10% đối với các khách hàng lần đầu tiên mua sắm tại Pengoo.store",
  },
];

export default function BenefitsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && sliderRef.current) {
      const translateXValue = -currentSlide * 100;
      gsap.to(sliderRef.current, {
        x: `${translateXValue}%`,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => {
          // Hiệu ứng bounce cho icon khi đổi slide
          const currentCard = sliderRef.current?.children[
            currentSlide
          ] as HTMLElement;
          if (currentCard) {
            const icon = currentCard.querySelector(".benefit-icon");
            if (icon) {
              gsap.fromTo(
                icon,
                { scale: 0.9 },
                { scale: 1, duration: 0.4, ease: "bounce.out" }
              );
            }
          }
        },
      });
    }
  }, [currentSlide, isMobile]);

  useEffect(() => {
    // Hiệu ứng lấp loáng ánh sáng chạy qua icon
    const icons = document.querySelectorAll(".benefit-icon");
    icons.forEach((icon) => {
      const shine = document.createElement("div");
      shine.className =
        "shine absolute top-0 left-[-50%] w-1/2 h-full bg-white opacity-30 skew-x-12";
      icon.appendChild(shine);

      gsap.to(shine, {
        x: "200%",
        duration: 2,
        ease: "linear",
        repeat: -1,
        delay: Math.random() * 2, // tạo ngẫu nhiên cho tự nhiên hơn
      });
    });
  }, []);

  const renderBenefitCard = (benefit: Benefit) => (
    <div className="flex-none w-full flex flex-col items-center p-6 relative">
      <div className="benefit-icon relative overflow-hidden bg-gradient-to-r from-blue-300 to-blue-500 p-6 rounded-full inline-flex items-center justify-center mb-6 shadow-lg text-white transform transition-transform duration-500 hover:scale-110 hover:rotate-6">
        {benefit.icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        {benefit.title}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
        {benefit.description}
      </p>
    </div>
  );

  return (
    <section className="bg-background-100 py-16 px-4 sm:px-6 lg:px-16 text-center mb-16">
      <div className="max-w-screen-xl mx-auto overflow-hidden">
        {/* Grid cho desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {benefits.map((benefit) => (
            <React.Fragment key={benefit.id}>
              {renderBenefitCard(benefit)}
            </React.Fragment>
          ))}
        </div>

        {/* Carousel cho mobile */}
        <div className="md:hidden">
          <div ref={sliderRef} className="flex">
            {benefits.map((benefit) => (
              <React.Fragment key={benefit.id}>
                {renderBenefitCard(benefit)}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-4">
            {benefits.map((_, index) => (
              <span
                key={index}
                className={`h-3 w-3 rounded-full mx-1 cursor-pointer transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 scale-110"
                    : "bg-gray-300"
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
