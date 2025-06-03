// components/TimelineSection.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip); // Register both plugins

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
}

interface TimelineSectionProps {
  timelineData: TimelineItem[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ timelineData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  // activeImageIndex không cần thiết để quản lý state trực tiếp, GSAP sẽ xử lý
  // const [activeImageIndex, setActiveImageIndex] = useState(0); 
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const HEADER_HEIGHT = 64; // Điều chỉnh chiều cao header của bạn

  useEffect(() => {
    if (!containerRef.current || !imageWrapperRef.current || timelineData.length === 0) return;

    // Kill tất cả ScrollTriggers cũ và timeline để tránh xung đột
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.globalTimeline.clear();

    // -- PHASE 1: PINNING CHUNG VÀ PROGRESS BAR --
    // Tạo một ScrollTrigger chính để ghim (pin) hình ảnh và điều khiển thanh tiến trình tổng thể.
    ScrollTrigger.create({
      trigger: containerRef.current,
      pin: imageWrapperRef.current,
      start: `top top+=${HEADER_HEIGHT}`,
      // Quan trọng: Kết thúc pin khi đáy của CONTAINER_REF chạm BOTTOM của viewport
      // Điều này đảm bảo rằng imageWrapperRef được ghim trong suốt chiều dài của TimelineSection
      // và sau đó sẽ cuộn đi cùng với các phần tử khác.
      end: `bottom bottom`, // <-- Đã sửa lại để pin hết section
      scrub: 0.5,
      // markers: true, // Chỉ dùng khi debug
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleY: self.progress,
            ease: 'none',
            overwrite: true
          });
        }
      },
      // Không cần onLeave/onEnterBack riêng cho imageWrapperRef nữa
      // vì chúng ta muốn nó pin hết section và tự động cuộn đi
      pinSpacing: false // Tắt khoảng cách padding khi pin
    });

    // Xử lý trạng thái ban đầu của tất cả ảnh: ẩn hết trừ ảnh đầu tiên
    gsap.set(imageRefs.current, { opacity: 0, visibility: 'hidden' });
    if (imageRefs.current[0]) {
      gsap.set(imageRefs.current[0], { opacity: 1, visibility: 'visible' });
    }

    // -- PHASE 2: ANIMATION RIÊNG CHO TỪNG CẶP TEXT/IMAGE --
    timelineData.forEach((item, i) => {
      const contentEl = contentRefs.current[i];
      const imageEl = imageRefs.current[i]; 

      if (!contentEl || !imageEl) return;

      // Đảm bảo trạng thái ban đầu của text
      gsap.set(contentEl, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: contentEl,
        start: `top center`, // Khi đỉnh của phần tử nội dung chạm giữa viewport
        end: `bottom center`, // Khi đáy của phần tử nội dung rời khỏi giữa viewport
        // markers: true, // Chỉ dùng khi debug cho từng trigger
        // Sử dụng "play reverse play reverse" để các animation chạy ngược lại khi cuộn lên/xuống
        toggleActions: "play reverse play reverse", 
        
        onEnter: () => {
          // Animate content
          gsap.to(contentEl, { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out" 
          });
          
          // Animate image for the current item
          gsap.to(imageRefs.current, { 
            opacity: 0, 
            visibility: 'hidden', 
            duration: 0.5, 
            ease: "power2.in" 
          }); // Ẩn tất cả ảnh
          gsap.to(imageEl, { 
            opacity: 1, 
            visibility: 'visible', 
            duration: 0.8, 
            ease: "power2.out" 
          }); // Hiện ảnh của item hiện tại
        },
        onLeave: () => {
          // Khi rời khỏi viewport (cuộn xuống), làm mờ/ẩn item hiện tại
          gsap.to(contentEl, { 
            opacity: 0, 
            y: -30, 
            duration: 0.6, 
            ease: "power2.in" 
          });

          // Nếu đây KHÔNG phải là item cuối cùng, thì ẩn ảnh hiện tại
          // Nếu đây là item cuối cùng, chúng ta sẽ để ảnh đó hiển thị
          // cho đến khi ScrollTrigger chính kết thúc pin.
          if (i < timelineData.length - 1) {
            gsap.to(imageEl, { 
              opacity: 0, 
              visibility: 'hidden', 
              duration: 0.8, 
              ease: "power2.in" 
            });
          }
        },
        onEnterBack: () => {
          // Khi cuộn ngược lại vào viewport, làm hiện lại item
          gsap.to(contentEl, { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out" 
          });

          // Animate image for the current item when scrolling back
          gsap.to(imageRefs.current, { 
            opacity: 0, 
            visibility: 'hidden', 
            duration: 0.5, 
            ease: "power2.in" 
          }); // Ẩn tất cả ảnh
          gsap.to(imageEl, { 
            opacity: 1, 
            visibility: 'visible', 
            duration: 0.8, 
            ease: "power2.out" 
          }); // Hiện ảnh của item hiện tại
        },
        onLeaveBack: () => {
          // Khi cuộn ngược lại ra khỏi viewport, làm mờ/ẩn item
          gsap.to(contentEl, { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            ease: "power2.in" 
          });

          // Nếu đây KHÔNG phải là item đầu tiên (khi cuộn ngược lên), ẩn ảnh hiện tại
          if (i > 0) {
            gsap.to(imageEl, { 
              opacity: 0, 
              visibility: 'hidden', 
              duration: 0.8, 
              ease: "power2.in" 
            });
            // Và nếu có ảnh trước đó, hãy hiển thị ảnh đó
            if (imageRefs.current[i - 1]) {
              gsap.to(imageRefs.current[i - 1], {
                opacity: 1,
                visibility: 'visible',
                duration: 0.8,
                ease: "power2.out"
              });
            }
          } else {
             // Nếu là item đầu tiên và cuộn ngược ra khỏi nó, ẩn ảnh đầu tiên
             gsap.to(imageEl, { 
                opacity: 0, 
                visibility: 'hidden', 
                duration: 0.8, 
                ease: "power2.in" 
              });
          }
        },
      });
    });

    // Xử lý ảnh đầu tiên khi tải trang
    // Đảm bảo ảnh đầu tiên hiển thị nếu có timelineData
    if (timelineData.length > 0 && imageRefs.current[0] && contentRefs.current[0]) {
      gsap.set(imageRefs.current[0], { opacity: 1, visibility: 'visible' });
      gsap.set(contentRefs.current[0], { opacity: 1, y: 0 });
    }

    // Clean up on unmount
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.globalTimeline.clear();
    };
  }, [timelineData, HEADER_HEIGHT]);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16 md:mb-20"
            style={{ fontFamily: 'Georgia, serif' }}>
          HÀNH TRÌNH CỦA CHÚNG TÔI
        </h2>

        <div className="relative" ref={containerRef}>
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-200 h-full">
            <div 
              ref={progressRef}
              className="absolute top-0 left-0 w-full h-full bg-blue-600 origin-top scale-y-0"
            />
          </div>

          <div className="flex flex-col md:flex-row-reverse md:items-start">
            {/* Image Column (Sticky) */}
            <div 
              className="md:w-1/2 lg:w-2/5 md:sticky flex items-center justify-center p-4"
              style={{ 
                top: `${HEADER_HEIGHT}px`, 
                height: `calc(100vh - ${HEADER_HEIGHT}px)` 
              }}
            >
              <div 
                ref={imageWrapperRef} 
                className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gray-200"
                style={{ 
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
              >
                {timelineData.map((item, index) => (
                  <Image
                    key={item.id}
                    src={item.imageUrl}
                    alt={item.altText}
                    fill
                    className="object-cover absolute inset-0 transition-opacity duration-500 ease-in-out"
                    ref={(el) => imageRefs.current[index] = el}
                    priority={index === 0} // Ưu tiên load ảnh đầu tiên
                  />
                ))}
              </div>
            </div>

            {/* Timeline Content Column */}
            <div className="md:w-1/2 lg:w-3/5 flex flex-col space-y-24">
              {timelineData.map((item, index) => (
                <div 
                  key={item.id} 
                  className="relative px-6 md:px-12"
                  ref={(el) => contentRefs.current[index] = el}
                >
                  <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
                    <h3 className="text-2xl font-semibold text-blue-600 mb-2">{item.year}</h3>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h4>
                    <p className="text-gray-600 text-base leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;