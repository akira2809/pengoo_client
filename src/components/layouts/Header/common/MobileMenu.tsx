// components/Header/MobileMenu.tsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import NavLinks from './NavLinks';

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
      className="fixed inset-0 bg-primary z-10 flex-col p-4"
      style={{ display: menuOpen ? "flex" : "none" }} // Initial render will hide it if menuOpen is false
    >
      <div className="flex justify-start items-center py-3 mb-4">
        <button
          onClick={onClose}
          className="z-30 p-2"
          aria-label="Close menu"
        >
          <CloseIcon className="text-white" />
        </button>
      </div>

      <div ref={menuItemsRef}>
        <nav className="flex flex-col space-y-4 text-lg font-semibold mb-8">
          <NavLinks onLinkClick={onClose} /> {/* Pass onClose to close menu on link click */}
        </nav>

        <div className="flex items-center space-x-2 text-base font-semibold mb-4">
          <LanguageIcon />
          <span>English (USD)</span>
        </div>

        <div className="text-sm text-gray-300">
          Follow us on social media!
        </div>
      </div>
    </div>
  );
}