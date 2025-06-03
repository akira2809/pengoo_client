// components/Header/Header.tsx
"use client";
import { useState } from "react";
import MarqueeBanner from "./common/MarqueeBanner";
import MainNavbar from "./common/MainNavbar"; 
import MobileMenu from "./common/MobileMenu";
import CartSidebar from "./common/CartSidebar";
import SearchSidebar from "./common/SearchSidebar";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sample cart data (giữ nguyên hoặc di chuyển nếu muốn)
  const [cartItems] = useState([
    { id: 1, name: "Premium T-Shirt", price: 29.99, quantity: 2, image: "https://www.maztermind.vn/cdn/shop/files/MM_BoxSet4_2-min.jpg?v=1722314360&width=600" },
    { id: 2, name: "Classic Jeans", price: 79.99, quantity: 1, image: "https://www.maztermind.vn/cdn/shop/files/MM_BoxSet4_2-min.jpg?v=1722314360&width=600" },
    { id: 3, name: "Summer Dress", price: 49.99, quantity: 1, image: "https://www.maztermind.vn/cdn/shop/files/MM_BoxSet4_2-min.jpg?v=1722314360&width=600" },
    { id: 4, name: "Summer Dress", price: 49.99, quantity: 1, image: "https://www.maztermind.vn/cdn/shop/files/MM_BoxSet4_2-min.jpg?v=1722314360&width=600" },
    { id: 5, name: "Summer Dress", price: 49.99, quantity: 1, image: "https://www.maztermind.vn/cdn/shop/files/MM_BoxSet4_2-min.jpg?v=1722314360&width=600" }
  ]);

  // Sample collections data (Xóa hoặc di chuyển vào MainNavbar)
  // const collections = [...]

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
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        menuOpen={menuOpen}
      />
      <MobileMenu
        menuOpen={menuOpen}
        onClose={handleMenuToggle}
      />
      {/* CollectionsDropdown không còn ở đây nữa */}
      <CartSidebar
        cartItems={cartItems}
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