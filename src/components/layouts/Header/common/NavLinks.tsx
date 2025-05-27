// components/Header/common/NavLinks.tsx
interface NavLinksProps {
  onLinkClick?: () => void;
  onCollectionsToggle?: () => void; // Dành cho Desktop
  isDesktop?: boolean; // để phân biệt render desktop/mobile
}

export default function NavLinks({ onLinkClick, onCollectionsToggle, isDesktop = false }: NavLinksProps) {
  return (
    <>
      <a href="#" className="hover:underline" onClick={onLinkClick}>Products</a>
      <div className="relative">
        <button
          className="hover:underline focus:outline-none"
          onClick={onCollectionsToggle}

        >
          Collections
        </button>
      </div>
      <a href="#" className="hover:underline" onClick={onLinkClick}>Giới thiệu</a>
      {isDesktop && (
        <a href="#" className="hover:underline" onClick={onLinkClick}>Liên hệ</a>
      )}
    </>
  );
}