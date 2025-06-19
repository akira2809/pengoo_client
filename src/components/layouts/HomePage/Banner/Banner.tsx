"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const images = [
  "/banner1.png",
  "/Spacefest-Poker_HeroBanner_PC-min.png",
  "/board-game-card-design_699907-1.webp",
  "/board-game-card-design_699907-1.webp",
];

// Preload images
const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
};

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Preload images on component mount
  useEffect(() => {
    preloadImages(images);
    // Show banner after a short delay to ensure images are loaded
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index === current) return;
    
    const from = current;
    const to = index;
    
    setCurrent(to);
    
    if (!slideRefs.current[from] || !slideRefs.current[to]) return;

    // Faster animation with simpler tweening
    gsap.killTweensOf([slideRefs.current[from], slideRefs.current[to]]);
    
    gsap.to(slideRefs.current[from], {
      autoAlpha: 0,
      x: -50,
      duration: 0.5,
      ease: "power2.out"
    });
    
    gsap.fromTo(
      slideRefs.current[to],
      { autoAlpha: 0, x: 50 },
      { 
        autoAlpha: 1, 
        x: 0, 
        duration: 0.5, 
        ease: "power2.out",
        delay: 0.1
      }
    );
  }, [current]);

  // Auto slide effect
  useEffect(() => {
    if (!isReady) return;
    
    timeoutRef.current = setInterval(() => {
      const next = (current + 1) % images.length;
      goToSlide(next);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [current, goToSlide, isReady]);

  // Show loading state
  if (!isReady) {
    return (
      <div className="w-full h-[70vh] md:h-[90vh] bg-gray-100 animate-pulse"></div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden">
      {images.map((src, index) => (
        <div
          key={index}
          ref={(el) => (slideRefs.current[index] = el)}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: index === current ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            zIndex: index === current ? 10 : 0 
          }}
        >
          <Image
            src={src}
            alt={`Slide ${index}`}
            fill
            className="object-cover"
            priority={index === 0} // Preload first image
            quality={75} // Slightly reduce quality for faster loading
            sizes="100vw"
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