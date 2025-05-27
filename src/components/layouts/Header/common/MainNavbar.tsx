// components/Header/MainNavbar.tsx
import { useState,  } from "react"; // Thêm useRef, useEffect
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import NavLinks from './NavLinks';
import Logo from './Logo';
import CollectionsDropdown from './CollectionsDropdown'; // Import CollectionsDropdown

interface MainNavbarProps {
  onMenuToggle: () => void;
  onCartToggle: () => void;
  cartItemCount: number;
  menuOpen: boolean;
}

export default function MainNavbar({
  onMenuToggle,
  onCartToggle,
  cartItemCount,
  menuOpen,
}: MainNavbarProps) {
  const [collectionsOpen, setCollectionsOpen] = useState(false); // Di chuyển state vào đây

  // Sample collections data (cũng di chuyển vào đây hoặc truyền từ Header nếu cần)
  const collections = [
    {
      id: 1,
      name: "Summer Collection",
      description: "Light & breezy styles",
      image: "https://via.placeholder.com/80x60",
      itemCount: 24
    },
    {
      id: 2,
      name: "Winter Essentials",
      description: "Cozy & warm pieces",
      image: "https://via.placeholder.com/80x60",
      itemCount: 18
    },
    {
      id: 3,
      name: "Business Casual",
      description: "Professional attire",
      image: "https://via.placeholder.com/80x60",
      itemCount: 32
    },
    {
      id: 4,
      name: "Weekend Wear",
      description: "Comfortable & stylish",
      image: "https://via.placeholder.com/80x60",
      itemCount: 28
    },
    {
      id: 5,
      name: "Evening Glam",
      description: "Special occasion pieces",
      image: "https://via.placeholder.com/80x60",
      itemCount: 15
    },
    {
      id: 6,
      name: "Active Lifestyle",
      description: "Sportswear & activewear",
      image: "https://via.placeholder.com/80x60",
      itemCount: 21
    }
  ];

  const handleCollectionsToggle = () => setCollectionsOpen(!collectionsOpen);
  const closeCollections = () => setCollectionsOpen(false); // Hàm đóng collections

  return (
    <div className="bg-primary text-white px-4 py-3 flex justify-between items-center md:px-8 relative">
      {/* Mobile Menu Icon (Left) / Desktop Left Menu Wrapper */}
      <div className="flex items-center">
        <button
          className={`md:hidden z-20 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>

        {/* Desktop Left Menu */}
        <nav className="hidden md:flex space-x-6 text-sm font-semibold ml-4">
          <NavLinks
            onCollectionsToggle={handleCollectionsToggle}
            isDesktop={true}
            // onMouseEnter={handleCollectionsToggle} // Thêm onMouseEnter nếu bạn muốn hover để mở
          />
        </nav>
      </div>

      {/* Logo (Always Centered) */}
      <Logo />

      {/* Right Icons (Always visible) */}
      <div className="flex items-center space-x-2 md:space-x-4 text-sm z-10">
        {/* Language và USD chỉ hiển thị trên desktop */}
        <div className="hidden md:flex items-center space-x-1">
          <LanguageIcon />
          <span>USD</span>
        </div>

        <IconButton className="!text-white" aria-label="Search">
          <SearchIcon />
        </IconButton>
        <IconButton
          className="!text-white relative"
          aria-label="Shopping bag"
          onClick={onCartToggle}
        >
          <ShoppingBagIcon />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </IconButton>
      </div>

      {/* Collections Dropdown Menu - Đặt nó ở đây */}
      <CollectionsDropdown
        collections={collections}
        collectionsOpen={collectionsOpen}
        onClose={closeCollections}
      />
    </div>
  );
}