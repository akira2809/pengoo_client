import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

// Dữ liệu khẩu hiệu
const slogans: string[] = [
  "Play as you are",
  "Boardgames for you",
  "Premium Quality",
  "Playmakers",
  "Pengoo at Play",
  "Your Game, Your Style"
];

const DUPLICATE_COUNT = 4; // nhân đôi để loop mượt

export default function HeadlineMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      const totalWidth = marqueeRef.current.scrollWidth / DUPLICATE_COUNT;

      gsap.killTweensOf(marqueeRef.current);
      gsap.set(marqueeRef.current, { x: 0 });

      // Tạo hiệu ứng marquee
      gsap.to(marqueeRef.current, {
        x: `-=${totalWidth}px`,
        ease: "none",
        duration: 35, // tốc độ cuộn
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x: number) => parseFloat(String(x)) % -totalWidth)
        }
      });
    }
  }, []);

  useEffect(() => {
    if (marqueeRef.current) {
      const texts = marqueeRef.current.querySelectorAll(".slogan-text");
      // Hiệu ứng glow nhịp nháy lần lượt
      gsap.to(texts, {
        opacity: 0.8,
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
        ease: "power1.inOut"
      });
    }
  }, []);

  return (
    <section className="py-12 md:py-18 overflow-hidden whitespace-nowrap mb-16 bg-background-50">
      <div ref={marqueeRef} className="inline-block will-change-transform">
        {Array.from({ length: DUPLICATE_COUNT }).map((_, duplicationIndex) => (
          <React.Fragment key={duplicationIndex}>
            {slogans.map((slogan, sloganIndex) => (
              <span
                key={`${duplicationIndex}-${sloganIndex}`}
                className="inline-flex items-center px-8 md:px-16 lg:px-24"
              >
                <h2
                  className="slogan-text text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 
                  font-extrabold bg-gradient-to-r from-blue-500 via-sky-400 to-blue-400 
                  bg-clip-text text-transparent drop-shadow-md"
                >
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
