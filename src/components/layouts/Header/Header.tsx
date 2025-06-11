// components/Header/Header.tsx
"use client";
import { useState, useEffect } from "react";
import MarqueeBanner from "./common/MarqueeBanner";
import MainNavbar from "./common/MainNavbar"; 
import MobileMenu from "./common/MobileMenu";
import CartSidebar from "./common/CartSidebar";
import SearchSidebar from "./common/SearchSidebar";
import { useCartStore } from "@/app/stores/slice/cartStore";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handlers for toggling states
  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const handleCartToggle = () => setCartOpen(!cartOpen);
  const handleSearchToggle = () => setSearchOpen(!searchOpen);

  return (
    <header className="w-full">
      <MarqueeBanner />
      <MainNavbar
        onMenuToggle={handleMenuToggle}
        onCartToggle={handleCartToggle}
        onSearchToggle={handleSearchToggle}
        cartItemCount={isMounted ? totalItems : 0}
        menuOpen={menuOpen}
      />
      <MobileMenu
        menuOpen={menuOpen}
        onClose={handleMenuToggle}
      />
      <CartSidebar
        cartOpen={cartOpen}
        onClose={handleCartToggle}
      />
      <SearchSidebar
        isOpen={searchOpen}
        onClose={handleSearchToggle}
      />
    </header>
  );
}