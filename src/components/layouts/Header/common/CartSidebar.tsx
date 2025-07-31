import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useCartStore } from "@/app/stores/slice/cartStore";
import { showErrorToast } from "@/components/common/UI/toastHelper";

// Format number to VND without decimal part and space
const formatVND = (amount: number | string): string => {
  const num = Math.round(Number(amount) * 1);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫';
};

export interface CartItem {
  id: number;
  product_name: string;
  product_price: number | string;
  quantity: number;
  image_url?: string;
  discount?: number;
  slug?: string;
  description?: string;
  quantity_stock?: number | string; // có thể là string từ server
}

interface CartSidebarProps {
  cartOpen: boolean;
  onClose: () => void;
}

// helper ép tồn kho về number
const toStockNumber = (v: unknown): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

function CartSidebarContent({ cartOpen, onClose }: CartSidebarProps) {
  const { items: cartItems, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();
  const cartPopupRef = useRef<HTMLDivElement>(null);
  const cartItemsRef = useRef<HTMLDivElement>(null);

  const totalAmount = cartItems.reduce(
    (sum, item) => {
      const price = typeof item.product_price === 'string'
        ? parseFloat(item.product_price)
        : item.product_price;
      const discount = item.discount || 0;
      return sum + (price * item.quantity * (1 - discount / 100));
    },
    0
  );

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  // ✅ Hàm clamp & thông báo tồn kho (trung tâm xử lý)
  const applyQuantityWithStock = (
    id: number,
    productName: string,
    desired: number,
    stock?: number
  ) => {
    let q = Math.round(Number(desired));
    if (!Number.isFinite(q) || q < 1) q = 1;

    if (typeof stock === "number") {
      if (stock <= 0) {
        showErrorToast(`"${productName}" đã hết hàng.`);
        return; // không cập nhật
      }
      if (q > stock) {
        showErrorToast(`Số lượng vượt quá tồn kho. Chỉ còn ${stock} sản phẩm.`);
        q = stock; // kẹp về tồn kho
      }
    }
    updateQuantity(id, q);
  };

  const handleQuantityChange = (
    id: number,
    newQuantity: number | string,
    productName: string,
    stock?: number
  ) => {
    applyQuantityWithStock(id, productName, Number(newQuantity), stock);
  };

  const handleMinus = (
    id: number,
    current: number,
    productName: string,
    stock?: number
  ) => {
    const next = Math.max(1, current - 1);
    applyQuantityWithStock(id, productName, next, stock);
  };

  const handlePlus = (
    id: number,
    current: number,
    productName: string,
    stock?: number
  ) => {
    // chỉ dùng 1 đường apply để đảm bảo thống nhất
    applyQuantityWithStock(id, productName, current + 1, stock);
  };

  // Animation
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
    <div
      ref={cartPopupRef}
      className="fixed top-0 right-0 w-full md:w-1/3 min-w-[320px] h-full bg-background-50 shadow-2xl z-[99999999] flex flex-col"
      style={{ display: cartOpen ? "flex" : "none" }}
    >
      <div className="flex justify-between items-center p-4 border-b bg-background-900 text-text-950">
        <h3 className="text-lg font-semibold text-text-50">Shopping Cart</h3>
        <button
          onClick={onClose}
          className="text-text-50 hover:text-teal-50 p-1"
          aria-label="Close cart"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-700 p-6">
            <ShoppingBagIcon
              className="mb-4 text-text-700"
              style={{ fontSize: "4rem" }}
            />
            <p className="text-lg">Giỏ hàng của bạn đang trống</p>
            <p className="text-sm mt-2">Thêm sản phẩm để bắt đầu mua sắm!</p>
          </div>
        ) : (
          <div ref={cartItemsRef} className="p-4 space-y-4 ">
            {cartItems.map((item) => {
              // ✅ ép tồn kho về number dù dữ liệu là "8" hay 8
              const stock = toStockNumber(item.quantity_stock);
              const reachedMax = stock !== undefined && item.quantity >= stock;

              return (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 text-text-900  bg-background-50 p-4 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  {(() => {
                    const imageUrl = item.image_url;
                    const isValidUrl = imageUrl &&
                      typeof imageUrl === 'string' &&
                      imageUrl.trim() !== '' &&
                      (imageUrl.startsWith('http') ||
                        imageUrl.startsWith('/') ||
                        imageUrl.startsWith('data:image'));

                    if (!isValidUrl) {
                      return (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ShoppingBagIcon className="text-gray-400" />
                        </div>
                      );
                    }

                    const formattedUrl =
                      imageUrl.startsWith('http') ||
                        imageUrl.startsWith('/') ||
                        imageUrl.startsWith('data:image')
                        ? imageUrl
                        : `/${imageUrl}`;

                    return (
                      <div key={`img-${item.id}`} className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={formattedUrl}
                          alt={item.product_name || 'Product image'}
                          width={64}
                          height={64}
                          className="object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <h4 className="font-medium text-text-heading mb-1">
                      {item.product_name}
                    </h4>

                    {/* ✅ Hiển thị tồn kho nếu có */}
                    {typeof stock === "number" && (
                      <p className="text-xs text-gray-500 mb-1">
                        Còn lại: <span className="font-medium">{stock}</span>
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-text-700">{formatVND(item.product_price)}</div>
                        <div className="flex items-center space-x-2 bg-white rounded px-2 py-1">
                          <button
                            className="text-text-heading hover:text-gray-600 w-6 h-6 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMinus(item.id, Number(item.quantity), item.product_name, stock);
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            className="w-10 text-center text-sm border-0 focus:ring-0 p-0"
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                e.target.value,
                                item.product_name,
                                stock
                              )
                            }
                            onBlur={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              applyQuantityWithStock(item.id, item.product_name, value, stock);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            className={`text-text-heading w-6 h-6 flex items-center justify-center ${reachedMax ? "opacity-40 cursor-not-allowed" : "hover:text-gray-600"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlus(item.id, Number(item.quantity), item.product_name, stock);
                            }}
                            disabled={reachedMax}
                            aria-disabled={reachedMax}
                            title={reachedMax ? `Chỉ còn ${stock} sản phẩm` : "Tăng số lượng"}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        {formatVND(Number(item.product_price) * Number(item.quantity) * (1 - (Number(item.discount) || 0) / 100))}
                        {item.discount && Number(item.discount) > 0 && (
                          <span className="text-xs text-red-500 ml-1">
                            (-{Math.round(Number(item.discount))}%)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {formatVND(Number(item.product_price))}
                      {item.discount && Number(item.discount) > 0 && (
                        <span className="text-green-500 ml-1">
                          (Tiết kiệm {formatVND(Number(item.product_price) * Number(item.quantity) * (Number(item.discount) / 100))})
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-500 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                  >
                    <CloseIcon style={{ fontSize: "1rem" }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="border-t bg-background-nav p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-semibold text-text-nav">
              Total:
            </span>
            <span className="text-xl font-bold text-primary">
              {formatVND(totalAmount)}
            </span>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/cart')}
              className="w-full bg-background-100 text-text-900 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={() => {
                router.push('/checkout');
                onClose();
              }}
              className="w-full bg-background-900 text-text-100 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartSidebar(props: CartSidebarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CartSidebarContent {...props} />
      {props.cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-20"
          onClick={props.onClose}
        />
      )}
    </>
  );
}
