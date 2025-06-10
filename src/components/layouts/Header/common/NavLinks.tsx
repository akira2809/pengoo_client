// components/Header/common/NavLinks.tsx
import Link from 'next/link';
interface NavLinksProps {
  onLinkClick?: () => void;
  onCollectionsToggle?: () => void; // Dành cho Desktop
  isDesktop?: boolean; // để phân biệt render desktop/mobile
}

export default function NavLinks({ onLinkClick, onCollectionsToggle, isDesktop = false }: NavLinksProps) {
  return (
    <>
      <Link href="/product" className="hover:underline" onClick={onLinkClick}>Products</Link>
      <div className="relative">
        <button
          className="hover:underline focus:outline-none"
          onClick={onCollectionsToggle}

        >
          Collections
        </button>
      </div>
      <Link href="/about" className="hover:underline" onClick={onLinkClick}>Giới thiệu</Link>
      <Link href="/blogs" className="hover:underline" onClick={onLinkClick}>Blogs</Link>
      {isDesktop && (
        <Link href="#" className="hover:underline" onClick={onLinkClick}>Liên hệ</Link>
      )}
    </>
  );
}