// components/Header/MobileMenu.tsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import CloseIcon from "@mui/icons-material/Close";
import NavLinks from './NavLinks';
import Image from "next/image";

interface MobileMenuProps {
  menuOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ menuOpen, onClose }: MobileMenuProps) {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  // Animation logic (di chuyển từ Header.tsx)
  useEffect(() => {
    if (menuOpen) {
      gsap.set(mobileMenuRef.current, {
        x: "-100%",
        display: "flex"
      });
      gsap.set(menuItemsRef.current?.children || [], {
        opacity: 0,
        x: -30
      });

      gsap.to(mobileMenuRef.current, {
        x: "0%",
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(menuItemsRef.current?.children || [], {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out"
      });
    } else {
      gsap.to(menuItemsRef.current?.children || [], {
        opacity: 0,
        x: -30,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.in"
      });
      gsap.to(mobileMenuRef.current, {
        x: "-100%",
        duration: 0.3,
        delay: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(mobileMenuRef.current, { display: "none" });
        }
      });
    }
  }, [menuOpen]);

  return (
  <div
    ref={mobileMenuRef}
    className="fixed inset-0 bg-background-900 z-[99999] flex flex-col text-text-50 h-screen md:w-[80%] lg:w-[400px]"
    style={{ display: menuOpen ? "flex" : "none" }}
  >
    {/* Header với nút close */}
    <div className="flex justify-start items-center py-3 mb-4 flex-shrink-0 px-4 md:px-6">
      <button
        onClick={onClose}
        className="z-30 p-2"
        aria-label="Close menu"
      >
        <CloseIcon className="text-text-nav" />
      </button>
    </div>

    {/* Menu items */}
    <div ref={menuItemsRef} className="flex-shrink-0 px-4 md:px-6">
      <nav className="flex flex-col space-y-4 text-xl md:text-2xl font-semibold mb-8">
        <NavLinks onLinkClick={onClose} />
      </nav>
      <div className="text-sm text-text-50 font-normal mb-4">
        Follow us on social media!
      </div>
    </div>

    {/* Logo container - chiếm toàn bộ phần còn lại */}
    <div className="flex-1 relative">
      <Image
        src="/logoMenuMobile.png"
        alt="Pengoo"
        fill
        priority
        className="object-contain"
      />
    </div>
  </div>
  );
}