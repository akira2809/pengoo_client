// components/Header/NavbarSpacer.tsx
"use client";

import { useEffect, useState } from 'react';

interface NavbarSpacerProps {
  children: React.ReactNode;
}

export default function NavbarSpacer({ children }: NavbarSpacerProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Early return if running on server
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Add passive listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Spacer div - creates space when navbar becomes fixed */}
      {isScrolled && <div className="h-[73px]" />} {/* Adjust height to match your navbar */}
      {children}
    </>
  );
}