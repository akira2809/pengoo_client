"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const images = [
  "/banner1.png",
  "/BannerWS.webp",
  "/BannerHMS.webp",
  "/BannerS&S2.webp",
];

// Preload images
const preloadImages: (imageUrls: string[]) => void = (imageUrls: string[]) => {
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag/swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Preload images on component mount
  useEffect(() => {
    preloadImages(images);
    // Show banner after a short delay to ensure images are loaded
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const goToSlide = useCallback((index: number, direction?: 'left' | 'right') => {
    if (index === current) return;
    
    const from = current;
    const to = index;
    
    setCurrent(to);
    
    if (!slideRefs.current[from] || !slideRefs.current[to]) return;

    // Determine animation direction
    const moveDistance = direction === 'left' ? -50 : direction === 'right' ? 50 : (to > from ? 50 : -50);
    
    // Faster animation with simpler tweening
    gsap.killTweensOf([slideRefs.current[from], slideRefs.current[to]]);
    
    gsap.to(slideRefs.current[from], {
      autoAlpha: 0,
      x: -moveDistance,
      duration: 0.5,
      ease: "power2.out"
    });
    
    gsap.fromTo(
      slideRefs.current[to],
      { autoAlpha: 0, x: moveDistance },
      { 
        autoAlpha: 1, 
        x: 0, 
        duration: 0.5, 
        ease: "power2.out",
        delay: 0.1
      }
    );
  }, [current]);

  // Clear auto slide when dragging
  const clearAutoSlide = useCallback(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Restart auto slide
  const restartAutoSlide = useCallback(() => {
    if (!isReady || isDragging) return;
    
    clearAutoSlide();
    timeoutRef.current = setInterval(() => {
      const next = (current + 1) % images.length;
      goToSlide(next);
    }, 3000);
  }, [current, goToSlide, isReady, isDragging, clearAutoSlide]);

  // Auto slide effect
  useEffect(() => {
    restartAutoSlide();
    return () => clearAutoSlide();
  }, [restartAutoSlide, clearAutoSlide]);

  // Drag/swipe handlers
  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setDragOffset(0);
    clearAutoSlide();
  }, [clearAutoSlide]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    
    setCurrentX(clientX);
    const offset = clientX - startX;
    setDragOffset(offset);
  }, [isDragging, startX]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const offset = currentX - startX;
    const threshold = 50; // Minimum drag distance to trigger slide change
    
    if (Math.abs(offset) > threshold) {
      if (offset > 0) {
        // Dragged right - go to previous slide
        const prev = current === 0 ? images.length - 1 : current - 1;
        goToSlide(prev, 'right');
      } else {
        // Dragged left - go to next slide
        const next = (current + 1) % images.length;
        goToSlide(next, 'left');
      }
    }
    
    setDragOffset(0);
    // Restart auto slide after a delay
    setTimeout(() => restartAutoSlide(), 1000);
  }, [isDragging, currentX, startX, current, goToSlide, restartAutoSlide]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Add global mouse events when dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      handleEnd();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Show loading state
  if (!isReady) {
    return (
      <div className="w-full h-[70vh] md:h-[90vh] bg-gray-100 animate-pulse"></div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[78vh] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but handle horizontal
    >
      {images.map((src, index) => (
        <div
          key={index}
          ref={(el) => { slideRefs.current[index] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: index === current ? 1 : 0,
            transition: isDragging ? 'none' : 'opacity 0.3s ease-out',
            transform: isDragging && index === current ? `translateX(${dragOffset}px)` : 'translateX(0)',
            zIndex: index === current ? 10 : 0 
          }}
        >
          <Image
            src={src}
            alt={`Slide ${index}`}
            fill
            className="object-cover pointer-events-none"
            priority={index === 0} // Preload first image
            quality={75} // Slightly reduce quality for faster loading
            sizes="100vw"
            draggable={false}
          />
        </div>
      ))}

      {/* Dot Indicators */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              clearAutoSlide();
              goToSlide(index);
              setTimeout(() => restartAutoSlide(), 1000);
            }}
            className={`h-2.5 md:h-3 transition-all duration-300 ${
              index === current
                ? "w-6 md:w-8 rounded-full bg-white shadow-md"
                : "w-2.5 md:w-3 rounded-full bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
      
      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black/20 text-white px-3 py-1 rounded-full text-sm">
          {dragOffset > 0 ? '← Kéo để xem trước' : dragOffset < 0 ? 'Kéo để xem tiếp →' : 'Kéo để chuyển slide'}
        </div>
      )}
    </div>
  );
}