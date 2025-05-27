// components/Header/MarqueeBanner.tsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function MarqueeBanner() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      const content = marqueeRef.current.innerHTML;
      marqueeRef.current.innerHTML = content + content + content + content; // Duplicate for smooth loop
      const totalWidth = marqueeRef.current.scrollWidth / 4; // Width of one set of content

      gsap.to(marqueeRef.current, {
        x: `-=${totalWidth}px`,
        ease: "none",
        duration: 20, // Adjust duration for speed
        repeat: -1,
        onRepeat: () => {
          gsap.set(marqueeRef.current, { x: 0 });
        },
      });
    }
  }, []);

  return (
    <div className="bg-accent text-white text-xs text-center py-3 overflow-hidden whitespace-nowrap relative">
      <div ref={marqueeRef} className="inline-block will-change-transform">
        <span className="inline-flex items-center mx-8">10% OFF for your first order <span className="ml-10 mr-10">•</span></span>
        <span className="inline-flex items-center mx-10">Free shipping on orders over $100 <span className="ml-10 mr-10">•</span></span>
        <span className="inline-flex items-center mx-10">New arrivals every week! <span className="ml-10 mr-10">•</span></span>
        <span className="inline-flex items-center mx-10">Limited time offer! <span className="ml-10 mr-10">•</span></span>
      </div>
    </div>
  );
}