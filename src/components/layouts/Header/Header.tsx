// components/Header/Header.tsx
"use client";
import { useState } from "react";
import MarqueeBanner from "./common/MarqueeBanner";
import MainNavbar from "./common/MainNavbar"; // Import MainNavbar
import MobileMenu from "./common/MobileMenu";
import CartSidebar from "./common/CartSidebar";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  // const [collectionsOpen, setCollectionsOpen] = useState(false); // Xóa dòng này

  // Sample cart data (giữ nguyên hoặc di chuyển nếu muốn)
  const [cartItems] = useState([
    { id: 1, name: "Premium T-Shirt", price: 29.99, quantity: 2, image: "https://via.placeholder.com/60x60" },
    { id: 2, name: "Classic Jeans", price: 79.99, quantity: 1, image: "https://via.placeholder.com/60x60" },
    { id: 3, name: "Summer Dress", price: 49.99, quantity: 1, image: "https://via.placeholder.com/60x60" }
  ]);

  // Sample collections data (Xóa hoặc di chuyển vào MainNavbar)
  // const collections = [...]

  // Handlers for toggling states
  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const handleCartToggle = () => setCartOpen(!cartOpen);
  // const handleCollectionsToggle = () => setCollectionsOpen(!collectionsOpen); // Xóa dòng này

  return (
    <header className="w-full">
      <MarqueeBanner />
      <MainNavbar
        onMenuToggle={handleMenuToggle}
        onCartToggle={handleCartToggle}
        // onCollectionsToggle={handleCollectionsToggle} // Xóa dòng này
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
    </header>
  );
}