// components/Header/CartSidebar.tsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  cartItems: CartItem[];
  cartOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({
  cartItems,
  cartOpen,
  onClose,
}: CartSidebarProps) {
  const cartPopupRef = useRef<HTMLDivElement>(null);
  const cartItemsRef = useRef<HTMLDivElement>(null);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Animation logic (di chuyển từ Header.tsx)
  useEffect(() => {
    if (cartOpen) {
      gsap.set(cartPopupRef.current, {
        x: "100%",
        display: "flex",
      });
      gsap.set(cartItemsRef.current?.children || [], {
        opacity: 0,
        x: 30,
      });

      gsap.to(cartPopupRef.current, {
        x: "0%",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(cartItemsRef.current?.children || [], {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
        delay: 0.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(cartItemsRef.current?.children || [], {
        opacity: 0,
        x: 30,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.in",
      });
      gsap.to(cartPopupRef.current, {
        x: "100%",
        duration: 0.3,
        delay: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(cartPopupRef.current, { display: "none" });
        },
      });
    }
  }, [cartOpen]);

  return (
    <>
      <div
        ref={cartPopupRef}
        className="fixed top-0 right-0 w-full md:w-1/3 min-w-[320px] h-full bg-white shadow-2xl z-30 flex flex-col"
        style={{ display: cartOpen ? "flex" : "none" }}
      >
        <div className="flex justify-between items-center p-4 border-b bg-primary text-white">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
              <ShoppingBagIcon
                className="mb-4 text-gray-300"
                style={{ fontSize: "4rem" }}
              />
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm mt-2">Add some products to get started!</p>
            </div>
          ) : (
            <div ref={cartItemsRef} className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {item.name}
                    </h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Qty:</span>
                        <div className="flex items-center space-x-2 bg-white rounded px-2 py-1">
                          <button className="text-gray-400 hover:text-gray-600">
                            -
                          </button>
                          <span className="text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            +
                          </button>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 p-1">
                    <CloseIcon style={{ fontSize: "1rem" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">
                Total:
              </span>
              <span className="text-xl font-bold text-primary">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                View Cart
              </button>
              <button className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Cart Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-20"
          onClick={onClose}
        />
      )}
    </>
  );
}
