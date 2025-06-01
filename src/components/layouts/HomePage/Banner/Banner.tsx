"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const images = [
  "/board-game-card-design_699907-1.webp",
  "/board-game-card-design_699907-1.webp",
  "/board-game-card-design_699907-1.webp",
  "/board-game-card-design_699907-1.webp",
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = (index: number) => {
    if (index === current) return;
    animateSlide(current, index);
    setCurrent(index);
  };

  const animateSlide = (from: number, to: number) => {
    if (!slideRefs.current[from] || !slideRefs.current[to]) return;

    gsap.fromTo(
      slideRefs.current[to],
      { autoAlpha: 0, x: 100 },
      { autoAlpha: 1, x: 0, duration: 1, ease: "power3.out" }
    );
    gsap.to(slideRefs.current[from], {
      autoAlpha: 0,
      x: -100,
      duration: 1,
      ease: "power3.inOut",
    });
  };

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      const next = (current + 1) % images.length;
      animateSlide(current, next);
      setCurrent(next);
    }, 3000);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [current]);

  return (
    <div className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden">
      {images.map((src, index) => (
        <div
          key={index}
          ref={(el) => (slideRefs.current[index] = el)}
          className="absolute inset-0 w-full h-full opacity-0"
          style={{ zIndex: index === current ? 10 : 0 }}
        >
          <Image
            src={src}
            alt={`Slide ${index}`}
            fill
            className="object-cover"
          />
        </div>
      ))}

      {/* Dot Indicators */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 md:h-3 transition-all duration-300 ${
              index === current
                ? "w-6 md:w-8 rounded-full bg-white shadow-md"
                : "w-2.5 md:w-3 rounded-full bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
