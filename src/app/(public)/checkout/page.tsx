"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/stores/slice/cartStore";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import { orderService } from "@/app/api/services/orderService";
import InputField from "../../(public)/checkout/component/InputField";
import RadioButton from "./component/RadioButton"; // Adjust import path as needed
import Image from "next/image";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/common/UI/toastHelper";
import { useStore } from "@/app/stores/store";
import { toast } from "react-hot-toast";
import Link from "next/link";
import type { CheckoutFormData as ImportedCheckoutFormData } from "@/app/type/order";
import type { CartItem as ImportedCartItem } from "@/app/type/order";

interface DeliveryMethod {
  id: number;
  name: string;
  fee: number;
  description?: string;
}

interface Voucher {
  id?: number;
  coupon: {
    code: string;
    description?: string;
  };
  active?: boolean;
  discount?: number;
}
interface FormData {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  phone: string;
  saveInfo: boolean;
  delivery_id: number;
// ...in your FormData and related types...
paymentMethod: "payos" | "cod" | "paypal";
  billingAddress: "sameAsShipping" | "different";
  note?: string;
  couponCode?: string;
}

// Helper to map delivery_id to shippingMethod string
const getShippingMethodString = (id: number): "localHCM" | "outsideHCM" => {
  if (id === 1) return "localHCM";
  return "outsideHCM";
};

// Helper to check and clean expired buy-now items
const getBuyNowItem = (): ImportedCartItem | null => {
  try {
    const buyNowData = localStorage.getItem("buy-now-item");
    if (!buyNowData) return null;

    const item = JSON.parse(buyNowData) as ImportedCartItem & {
      timestamp?: number;
    };

    // Kiểm tra expire (30 phút)
    const EXPIRE_TIME = 30 * 60 * 1000;
    const now = Date.now();

    if (item.timestamp && now - item.timestamp > EXPIRE_TIME) {
      localStorage.removeItem("buy-now-item");
      return null;
    }

    return item;
  } catch (error) {
    console.error("Error parsing buy-now item:", error);
    localStorage.removeItem("buy-now-item");
    return null;
  }
};

const CheckoutPage: React.FC = () => {
  const myVouchers = useStore((state) => state.myVouchers);
  const fetchMyVouchers = useStore((state) => state.fetchMyVouchers);
  const applyVoucher = useStore((state) => state.applyVoucher);
  const [showCouponList, setShowCouponList] = useState(false);
  const router = useRouter();
  const { items: cartItems, clearCart, getTotalItems } = useCartStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isCartReady, setIsCartReady] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryMethod[]>([]);
  const [listVouchers, setListVouchers] = useState<Voucher[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<ImportedCartItem | null>(null);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || "",
    country: "Vietnam",
    firstName: user?.full_name?.split(" ").slice(0, -1).join(" ") || "",
    lastName: user?.full_name?.split(" ").slice(-1)[0] || "",
    address: user?.address || "",
    apartment: "",
    city: "Hồ Chí Minh",
    postalCode: "",
    phone: user?.phone_number || "",
    saveInfo: true,
    delivery_id: 1,
    paymentMethod: "payos",
    billingAddress: "sameAsShipping",
    note: "",
    couponCode: "",
  });

  // Update form data when user data changes
  useEffect(() => {
    if (!user?.id) return;

    setFormData((prev) => ({
      ...prev,
      email: user.email || prev.email,
      firstName:
        user.full_name?.split(" ").slice(0, -1).join(" ").trim() ||
        prev.firstName,
      lastName: user.full_name?.split(" ").slice(-1)[0] || prev.lastName,
      address: user.address || prev.address,
      phone: user.phone_number || prev.phone,
    }));
  }, [
    user?.id,
    user?.email,
    user?.full_name,
    user?.address,
    user?.phone_number,
  ]);

  // Gọi API lấy mã giảm giá và phương thức vận chuyển
  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          await fetchMyVouchers(); // don't check for truthiness

          const deliveryMethod = await orderService.getDeliveryMethod();
          if (deliveryMethod?.data && Array.isArray(deliveryMethod.data)) {
            // Map to DeliveryMethod[]
            const mappedDelivery = deliveryMethod.data.map(
              (item, idx: number) => ({
                id: item.id ?? idx + 1,
                name: item.name ?? `Phương thức vận chuyển ${idx + 1}`,
                fee: item.fee ?? 25000,
                description: item.description ?? "",
              })
            );
            setDelivery(mappedDelivery);
            const initialShippingCost = Number(mappedDelivery[0].fee) || 25000;
            // console.log(
            //   `Setting initial shipping cost: ${initialShippingCost} (type: ${typeof initialShippingCost})`
            // );
            setShippingCost(initialShippingCost);
          } else {
            // console.error(
            //   "Invalid delivery method data format:",
            //   deliveryMethod
            // );
            // Set default delivery methods if API fails
            setDelivery([
              { id: 1, name: "Nội thành TP Hồ Chí Minh", fee: 25000 },
              { id: 2, name: "Ngoại thành TP Hồ Chí Minh", fee: 40000 },
            ]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // Set default delivery methods if API fails
          setDelivery([
            { id: 1, name: "Nội thành TP Hồ Chí Minh", fee: 25000 },
            { id: 2, name: "Ngoại thành TP Hồ Chí Minh", fee: 40000 },
          ]);
        }
      };
      fetchData();
    }
  }, [user?.id, fetchMyVouchers]);

  // Format currency
  const formatCurrency = (amount: number) => {
    // Ensure amount is a valid number
    const validAmount =
      isNaN(amount) || !isFinite(amount) ? 0 : Math.round(amount);
    // console.log(`Formatting currency: ${amount} -> ${validAmount}`);

    return (
      new Intl.NumberFormat("vi-VN", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(validAmount) + "₫"
    );
  };

  // Get items based on mode (buy-now or cart)
  const typedCartItems: ImportedCartItem[] =
    isBuyNowMode && buyNowItem
      ? [buyNowItem]
      : (cartItems as ImportedCartItem[]);

  // Calculate subtotal
  const subtotal = typedCartItems.reduce((sum, item) => {
    const price = item.price ?? item.product_price;
    const discountMultiplier = 1 - (item.discount || 0) / 100;
    const itemTotal = price * item.quantity * discountMultiplier;
    // console.log(
    //   `Item: ${item.product_name}, Price: ${price}, Quantity: ${item.quantity}, Discount: ${item.discount}%, Total: ${itemTotal}`
    // );
    return sum + itemTotal;
  }, 0);

  // Calculate total
  const numericSubtotal = Number(subtotal) || 0;
  const numericDiscountAmount = Number(discountAmount) || 0;
  const numericShippingCost = Number(shippingCost) || 0;

  // console.log(
  //   `Debug types - Subtotal: ${typeof subtotal} (${subtotal}), Discount: ${typeof discountAmount} (${discountAmount}), Shipping: ${typeof shippingCost} (${shippingCost})`
  // );

  const total = Math.max(
    0,
    numericSubtotal - numericDiscountAmount + numericShippingCost
  );
  // console.log(
  //   `Subtotal: ${numericSubtotal}, Discount: ${numericDiscountAmount}, Shipping: ${numericShippingCost}, Total: ${total}`
  // );

  // Handle cart initialization and buy-now mode
  useEffect(() => {
    // Check if this is buy-now mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");

    if (mode === "buy-now") {
      setIsBuyNowMode(true);
      // Load buy-now item using helper function
      const item = getBuyNowItem();
      if (item) {
        setBuyNowItem(item);
      }
    }

    // Mark cart as ready after initial render
    // This ensures we've had a chance to load from localStorage
    const timer = setTimeout(() => {
      setIsCartReady(true);
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Theo dõi khi user đăng nhập thành công trong buy-now mode
  useEffect(() => {
    if (isBuyNowMode && isAuthenticated && isInitialized && !buyNowItem) {
      // User vừa đăng nhập thành công, thử load lại buy-now item
      const item = getBuyNowItem();
      if (item) {
        setBuyNowItem(item);
      }
    }
  }, [isBuyNowMode, isAuthenticated, isInitialized, buyNowItem]);

  // Handle authentication and cart validation
  useEffect(() => {
    // Only run when cart is ready and auth is not already checked
    if (!isCartReady || authChecked) return;

    const checkAuthAndCart = async () => {
      // Check if items are empty (either cart or buy-now item)
      const hasItems = isBuyNowMode ? buyNowItem !== null : getTotalItems() > 0;

      if (!hasItems) {
        // Nếu là buy-now mode và không có item, có thể do expire hoặc chưa có
        if (isBuyNowMode) {
          showErrorToast(
            "Phiên mua hàng đã hết hạn hoặc không tìm thấy sản phẩm. Vui lòng thử lại."
          );
          // Redirect về trang trước hoặc trang chủ
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        } else {
          showErrorToast(
            "Giỏ hàng của bạn đang trống. Đang chuyển hướng về trang chủ."
          );
          router.push("/");
        }
        return;
      }

      // If auth is still loading, wait for it to complete
      if (isAuthLoading) {
        return;
      }

      // If not authenticated after loading is complete
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để thanh toán.");
        const redirectUrl = isBuyNowMode
          ? `/signin?redirect=${encodeURIComponent("/checkout?mode=buy-now")}`
          : `/signin?redirect=${encodeURIComponent("/checkout")}`;
        router.push(redirectUrl);
        return;
      }

      setAuthChecked(true);
    };

    checkAuthAndCart();
  }, [
    isCartReady,
    cartItems,
    buyNowItem,
    isBuyNowMode,
    router,
    isAuthenticated,
    isAuthLoading,
    authChecked,
    getTotalItems,
  ]);
  const changeShipFee = (id: number) => {
    const data = delivery.find((item) => id === item.id);
    const fee = data ? Number(data.fee) : 25000;
    // console.log(
    //   `Changing shipping fee for delivery ID ${id}: ${fee} (type: ${typeof fee})`
    // );
    return fee;
  };
  // Show loading state while checking auth or cart
  if (isAuthLoading || !authChecked || !isCartReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty cart message if no items after loading
  if (typedCartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            {isBuyNowMode
              ? "Không tìm thấy sản phẩm để mua. Đang chuyển hướng..."
              : "Giỏ hàng của bạn đang trống. Đang chuyển hướng về trang chủ..."}
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "delivery_id") {
      const newShippingCost = changeShipFee(Number(value));
      // console.log(
      //   `Setting new shipping cost: ${newShippingCost} (type: ${typeof newShippingCost})`
      // );
      setShippingCost(Number(newShippingCost));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleShowCouponList = async () => {
    const result = await Promise.all(
      myVouchers.map(async (voucher: Voucher) => {
        const data = await applyVoucher(voucher.coupon.code, subtotal);
        return data !== undefined && data !== null
          ? { ...voucher, active: true }
          : { ...voucher, active: false };
      })
    );
    result.sort((a: Voucher, b: Voucher) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;
      return 0;
    });
    setListVouchers(result);
    setShowCouponList(true);
  };

  const handleApplyCoupon = async () => {
    const code = formData.couponCode?.trim();
    if (!code) {
      showErrorToast("Vui lòng nhập mã giảm giá.");
      return;
    }
    const data = (await applyVoucher(code, subtotal)) as
      | { discount: number; coupon: { code: string } }
      | null
      | undefined;
    if (data === undefined || data === null) {
      showErrorToast(`Mã khuyến mãi không hợp lệ hoặc đã hết hạn.`);
      setDiscountAmount(0);
      setIsCouponApplied(false);
      return;
    } else {
      const discount = Number(data.discount) || 0;
      // console.log(
      //   `Setting discount amount: ${discount} (type: ${typeof discount})`
      // );
      setDiscountAmount(discount);
      setIsCouponApplied(true);
      showSuccessToast(`Áp dụng mã khuyến mãi ${data.coupon.code} thành công!`);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.email) newErrors.email = "Email là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ.";
    if (!formData.firstName) newErrors.firstName = "Tên là bắt buộc.";
    if (!formData.lastName) newErrors.lastName = "Họ là bắt buộc.";
    if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc.";
    if (!formData.city) newErrors.city = "Thành phố là bắt buộc.";
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc.";
    else if (!/^\d{10,11}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typedCartItems.length === 0) {
      showErrorToast(
        isBuyNowMode
          ? "Không tìm thấy sản phẩm để mua."
          : "Giỏ hàng của bạn đang trống."
      );
      return;
    }
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Prepare order data and create order
      const orderData: ImportedCheckoutFormData = {
        ...formData,
        total,
        shippingMethod: getShippingMethodString(Number(formData.delivery_id)),
        name: "",
        fee: 0,
        description: "",
        phone_number: formData.phone,
      };
      const preparedOrder = orderService.prepareOrderData(
        orderData,
        typedCartItems,
        user?.id ? parseInt(user.id.toString(), 10) : undefined
      );
      const response = await orderService.createOrder(preparedOrder);

      // PayPal flow
      if (formData.paymentMethod === "paypal") {
        // Call backend to create PayPal order
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/paypal/create-order/${response.order_id}`,
          { method: "POST" }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.approvalUrl) {
            window.location.href = data.approvalUrl;
            return;
          } else {
            toast.error("Không lấy được link thanh toán PayPal.");
          }
        } else {
          toast.error("Không thể tạo đơn PayPal.");
        }
        setIsSubmitting(false);
        return;
      }

      // PayOS: redirect to payment gateway
      if (formData.paymentMethod === "payos" && response.payment_url) {
        window.location.href = response.payment_url;
        return;
      }

      // COD: clear cart/buy-now, then redirect to success page
      if (!isBuyNowMode) {
        clearCart();
      } else {
        localStorage.removeItem("buy-now-item");
      }
      router.push(`/order/success?order_id=${response.order_id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt hàng"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-amber-800">
                  Pengoo
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="hidden sm:inline">
                  {isBuyNowMode ? "Mua ngay: " : "Bước 2/2: "}
                </span>
                <span className="font-medium">Thanh toán</span>
              </div>
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {typedCartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {typedCartItems.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
          {/* Checkout Form - Left Side */}
          <div className="lg:order-1 order-2">
            <h1 className="sr-only">Thanh toán</h1>
            {/* Start of the form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-lg lg:max-w-none mx-auto"
            >
              {/* Contact Information */}
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Liên hệ
              </h2>
              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />

              {/* Shipping Information */}
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Giao hàng
              </h2>
              <div className="mb-4">
                <label htmlFor="country" className="sr-only">
                  Quốc gia/Vùng
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 text-sm py-2 px-3"
                >
                  <option value="Vietnam">Việt Nam</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <InputField
                  label="Tên"
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                />
                <InputField
                  label="Họ"
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                />
              </div>

              <InputField
                label="Địa chỉ"
                id="address"
                name="address"
                autoComplete="street-address"
                required
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
              />

              <InputField
                label="Căn hộ, p.v.v. (không bắt buộc)"
                id="apartment"
                name="apartment"
                autoComplete="address-line2"
                value={formData.apartment}
                onChange={handleInputChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Thành phố
                  </label>
                  <select
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 text-sm py-2 px-3
                      ${errors.city ? "border-red-500" : ""}
                    `}
                  >
                    <option value="">Chọn thành phố</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                  )}
                </div>
                <InputField
                  label="Mã bưu chính (không bắt buộc)"
                  id="postalCode"
                  name="postalCode"
                  autoComplete="postal-code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  error={errors.postalCode}
                />
              </div>

              <InputField
                label="Điện thoại"
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />

              <div className="flex items-center mt-2 mb-6 text-sm">
                <input
                  id="saveInfo"
                  name="saveInfo"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                />
                <label htmlFor="saveInfo" className="ml-2 text-gray-700">
                  Lưu lại thông tin này cho lần sau
                </label>
              </div>

              {/* Shipping Method */}
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Phương thức vận chuyển
              </h2>
              <div className="space-y-3 mb-6">
                {/* <RadioButton
                  id="localHCM"
                  name="delivery_id"
                  value="1"
                  checked={Number(formData.delivery_id) === 1}
                  onChange={handleInputChange}
                  label="Nội thành TP Hồ Chí Minh"
                  price={25000}
                  formatPrice={formatCurrency}
                // icon={<TruckIcon />}
                />
                <RadioButton
                  id="outsideHCM"
                  name="delivery_id"
                  value="2"
                  checked={Number(formData.delivery_id) === 2}
                  onChange={handleInputChange}
                  label="Ngoại thành TP Hồ Chí Minh"
                  price={40000}
                  formatPrice={formatCurrency}
                // icon={<CashIcon />}
                /> */}
                {Array.isArray(delivery) && delivery.length > 0 ? (
                  delivery.map((item: DeliveryMethod) => (
                    <RadioButton
                      key={item.id}
                      id={`delivery-${item.id}`}
                      name="delivery_id"
                      value={String(item.id)}
                      checked={Number(formData.delivery_id) === Number(item.id)}
                      onChange={handleInputChange}
                      label={item.name || `Phương thức vận chuyển ${item.id}`}
                      price={Number(item.fee) || 0}
                      formatPrice={formatCurrency}
                    />
                  ))
                ) : (
                  // fallback...
                  <>
                    <RadioButton
                      id="localHCM"
                      name="delivery_id"
                      value="1"
                      checked={Number(formData.delivery_id) === 1}
                      onChange={handleInputChange}
                      label="Nội thành TP Hồ Chí Minh"
                      price={25000}
                      formatPrice={formatCurrency}
                    />
                    <RadioButton
                      id="outsideHCM"
                      name="delivery_id"
                      value="2"
                      checked={Number(formData.delivery_id) === 2}
                      onChange={handleInputChange}
                      label="Ngoại thành TP Hồ Chí Minh"
                      price={40000}
                      formatPrice={formatCurrency}
                    />
                  </>
                )}
              </div>

              {/* Payment Method */}
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Thanh toán
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Toàn bộ các giao dịch được bảo mật và mã hóa.
              </p>
              <div className="space-y-3 mb-6">
                {/* PayOS */}
                <label
                  htmlFor="payos"
                  className="relative flex items-center cursor-pointer rounded-lg border border-gray-300 bg-white p-4 focus:outline-none hover:border-gray-500 transition-all duration-200"
                >
                  <input
                    type="radio"
                    id="payos"
                    name="paymentMethod"
                    value="payos"
                    checked={formData.paymentMethod === "payos"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                  />
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      Thanh toán trực tuyến (PayOS)
                    </span>
                    <div className="mt-2 flex items-center space-x-2">
                      <Image
                        src="/Casso-payOSLogo-1.svg"
                        alt="PayOS"
                        width={130}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                  </span>
                </label>

                {/* PayPal */}
                <label
                  htmlFor="paypal"
                  className="relative flex items-center cursor-pointer rounded-lg border border-gray-300 bg-white p-4 focus:outline-none hover:border-gray-500 transition-all duration-200"
                >
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                  />
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      Thanh toán qua PayPal
                    </span>
                    <div className="mt-2 flex items-center space-x-2">
                      <Image
                        src="/pngegg.png"
                        alt="PayPal"
                        width={100}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                  </span>
                </label>

                {/* COD */}
                <label
                  htmlFor="cod"
                  className="relative flex items-center cursor-pointer rounded-lg border border-gray-300 bg-white p-4 focus:outline-none hover:border-gray-500 transition-all duration-200"
                >
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                  />
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <div className="mt-2 flex items-center space-x-2">
                      <Image
                        src="/cod.png"
                        alt="COD"
                        width={80}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                  </span>
                </label>
              </div>

              {/* Billing Address */}
              {/* <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Địa chỉ thanh toán
              </h2>
              <div className="space-y-3 mb-6">
                <RadioButton
                  id="sameAsShipping"
                  name="billingAddress"
                  value="sameAsShipping"
                  checked={formData.billingAddress === "sameAsShipping"}
                  onChange={handleInputChange}
                  label="Giống địa chỉ vận chuyển"
                  // isCustomClass={true}
                />
                <RadioButton
                  id="different"
                  name="billingAddress"
                  value="different"
                  checked={formData.billingAddress === "different"}
                  onChange={handleInputChange}
                  label="Sử dụng địa chỉ thanh toán khác"
                  // isCustomClass={true}
                />
              </div> */}

              {/* Submit Button - Now correctly inside the form */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-background-900 hover:bg-background-800 text-white py-3 px-4 rounded-md text-base font-medium hover:bg-brown-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Đang xử lý..." : `Thanh toán ngay`}
              </button>
            </form>{" "}
            {/* End of the form */}
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:order-2 order-1 lg:sticky lg:top-8 h-fit bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="bg-white rounded-md overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {isBuyNowMode && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                      Mua ngay
                    </span>
                  )}
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-sm font-bold mr-2">
                    {typedCartItems.length}
                  </span>
                </h3>
              </div>
              <div className="p-4">
                {typedCartItems.map((item: ImportedCartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm text-gray-700 mb-2 last:mb-0"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={
                            item.image_url || "/images/placeholder-product.png"
                          }
                          alt={item.product_name}
                          fill
                          sizes="40px"
                          style={{ objectFit: "cover" }}
                        />
                        <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs px-1 rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <span className="ml-3 font-medium text-gray-800">
                        {item.product_name}
                      </span>
                    </div>
                    <span className="text-gray-900">
                      {formatCurrency(
                        (item.price ?? item.product_price) *
                          item.quantity *
                          (1 - (item.discount || 0) / 100)
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-4 border-t border-gray-200 relative">
                <input
                  type="text"
                  placeholder="Mã giảm giá"
                  value={formData.couponCode}
                  onFocus={() => handleShowCouponList()}
                  onBlur={() => setTimeout(() => setShowCouponList(false), 150)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      couponCode: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 text-sm py-2 px-3"
                />
                {showCouponList && listVouchers.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 shadow-lg max-h-40 overflow-auto divide-y divide-gray-100">
                    {listVouchers.map((uc: Voucher) => (
                      <li
                        key={uc.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            couponCode: uc.coupon.code,
                          }));
                          setShowCouponList(false);
                        }}
                        className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-200 
                          ${
                            uc.active
                              ? "bg-green-50 hover:bg-green-100 text-green-800"
                              : "bg-red-50 hover:bg-red-100 text-red-700"
                          }
                        `}
                      >
                        <div className="font-semibold">{uc.coupon.code}</div>
                        <div className="text-xs italic">
                          {uc.coupon.description || "Không có mô tả"}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="mt-2 w-full bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm hover:bg-gray-300 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
              <div className="px-4 py-4 border-t border-gray-200 text-sm">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Tổng phụ</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex justify-between text-green-600 mb-2">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Vận chuyển</span>
                  <span>
                    {shippingCost === 0
                      ? "Miễn phí"
                      : formatCurrency(shippingCost)}
                  </span>
                </div>
              </div>
              <div className="px-4 py-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-base text-gray-900">Tổng</span>
                <span className="text-xl font-bold text-brown-700">
                  VND {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
