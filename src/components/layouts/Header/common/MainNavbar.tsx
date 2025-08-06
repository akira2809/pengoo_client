"use client";

import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import UserIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuIcon from "@mui/icons-material/Menu";
import NavLinks from './NavLinks';
import Logo from './Logo';
import CollectionsDropdown from './CollectionsDropdown';
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import Image from "next/image";

interface MainNavbarProps {
  onMenuToggle: () => void;
  onCartToggle: () => void;
  onSearchToggle: () => void;
  cartItemCount: number;
  menuOpen: boolean;
}

export default function MainNavbar({
  onMenuToggle,
  onCartToggle,
  onSearchToggle,
  cartItemCount,
  menuOpen,
}: MainNavbarProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sample collections data
  const collections = [
    {
      id: 1,
      name: "Summer Collection",
      description: "Light & breezy styles",
      image: "https://www.drinkcollider.com/cdn/shop/files/collider-fc-home-shirt-2024-219393.jpg?crop=center&height=200&v=1743936608&width=200",
      itemCount: 24
    },
    {
      id: 2,
      name: "Winter Essentials",
      description: "Cozy & warm pieces",
      image: "https://www.drinkcollider.com/cdn/shop/files/collider-fc-home-shirt-2024-219393.jpg?crop=center&height=200&v=1743936608&width=200",
      itemCount: 18
    },
    {
      id: 3,
      name: "Business Casual",
      description: "Professional attire",
      image: "https://www.drinkcollider.com/cdn/shop/files/collider-fc-home-shirt-2024-219393.jpg?crop=center&height=200&v=1743936608&width=200",
      itemCount: 32
    },
    {
      id: 4,
      name: "Weekend Wear",
      description: "Comfortable & stylish",
      image: "https://www.drinkcollider.com/cdn/shop/files/collider-fc-home-shirt-2024-219393.jpg?crop=center&height=200&v=1743936608&width=200",
      itemCount: 28
    },
    {
      id: 5,
      name: "Evening Glam",
      description: "Special occasion pieces",
      image: "https://www.drinkcollider.com/cdn/shop/files/collider-fc-home-shirt-2024-219393.jpg?crop=center&height=200&v=1743936608&width=200",
      itemCount: 15
    },
    {
      id: 6,
      name: "Active Lifestyle",
      description: "Sportswear & activewear",
      image: "https://www.drinkcollider.com/cdn/shop/files/collider-fc-home-shirt-2024-219393.jpg?crop=center&height=200&v=1743936608&width=200",
      itemCount: 21
    }
  ];

  // Handle scroll event with Next.js optimization
  useEffect(() => {
    // Early return if running on server
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (scrollY > 50) { // Navbar becomes sticky after scrolling 50px
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

    // Set initial scroll position
    updateScrollDirection();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCollectionsToggle = () => setCollectionsOpen(!collectionsOpen);
  const closeCollections = () => setCollectionsOpen(false);

  return (
    <>
      {/* Spacer div - creates space when navbar becomes fixed */}
      {isScrolled && <div className="h-[60px] md:h-[65px] lg:h-[73px]" />}

      <div
        className={`
          bg-background-900 text-text-50 
          px-4 py-3 md:py-4 lg:py-5 
          flex justify-between items-center 
          md:px-6 lg:px-12
          transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm bg-background-300/95'
            : 'relative'
          }
        `}
      >
        {/* Mobile Menu Icon (Left) / Desktop Left Menu Wrapper */}
        <div className="flex items-center">
          {/* Menu Icon: visible on small screens, hidden on md (tablets) and larger */}
          <button
            className={`lg:hidden z-20 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200 mr-4`}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <MenuIcon className="text-text-50" />
          </button>

          {/* Desktop/Tablet Left Menu: hidden on small screens, flex on md (tablets) and larger */}
          {/* Note: Adjust space-x-6 as needed for tablet spacing */}
          <nav className="hidden lg:flex space-x-6 text-sm font-semibold ml-4">
            <NavLinks
              onCollectionsToggle={handleCollectionsToggle}
              isDesktop={true} // This prop should indicate if it's a desktop-like view
            />
          </nav>
        </div>

        {/* Logo (Always Centered) */}
        <Logo />

        {/* Right Icons (Always visible) */}
        <div className="ml-auto flex items-center space-x-1 md:space-x-2 text-sm z-10">
          {/* Language và USD chỉ hiển thị trên desktop/tablet lớn hơn */}
          <IconButton
            className="text-gray-700 hover:text-gray-900"
            aria-label="Search"
            onClick={onSearchToggle}
          >
            <SearchIcon className="text-text-50" />
          </IconButton>
          <IconButton
            className="text-gray-700 hover:text-gray-900"
            aria-label={isAuthenticated ? 'Tài khoản' : 'Đăng nhập'}
            onClick={() => router.push(isAuthenticated ? '/account' : '/signin')}
          >
            {
              isAuthenticated ?
                (user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="Ảnh đại diện"
                    width={32}
                    height={32}
                    className="w-[28px] h-[28px] object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-[32px] h-[32px] bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center rounded-full">
                    <span className="text-1xl font-bold text-white">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                ))
                : (<UserIcon className="text-text-50" />)

            }
            {/* <Image src="https://res.cloudinary.com/do6lj4onq/image/upload/v1753768911/products/file_w9dtns.webp" alt="" /> */}
          </IconButton>
          <IconButton
            className="!text-text-nav relative"
            aria-label="Shopping bag"
            onClick={onCartToggle}
          >
            <ShoppingBagIcon className="text-text-50" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </IconButton>
        </div>

        {/* Collections Dropdown Menu */}
        <CollectionsDropdown
          collections={collections}
          collectionsOpen={collectionsOpen}
          onClose={closeCollections}
        />
      </div>
    </>
  );
}