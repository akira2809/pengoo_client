"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/stores/slice/cartStore";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import { orderService } from "@/app/api/services/orderService";
import InputField from "../../(public)/checkout/component/InputField";
import RadioButton from "../../(public)/checkout/component/RadioButton";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useStore } from "@/app/stores/store";
import Link from "next/link";

//

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
  paymentMethod: "payos" | "cod";
  billingAddress: "sameAsShipping" | "different";
  note?: string;
  couponCode?: string;
}

const CheckoutPage: React.FC = () => {
  const myVouchers = useStore((state) => state.myVouchers);
  const fetchMyVouchers = useStore((state) => state.fetchMyVouchers);
  const applyVoucher = useStore((state) => state.applyVoucher);
  const [showCouponList, setShowCouponList] = useState(false); // Dropdown toggle
  const router = useRouter();
  const { items: cartItems, clearCart, getTotalItems } = useCartStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isCartReady, setIsCartReady] = useState(false);
  const [listVouchers, setListVouchers] = useState([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [delivery, setDelivery] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
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

  // Define delivery method type
  interface DeliveryMethod {
    id: number;
    name: string;
    fee: number;
    description?: string;
  }

  // Gọi API lấy mã giảm giá và phương thức vận chuyển
  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          await fetchMyVouchers(); // gọi API lấy voucher

          const deliveryMethod = await orderService.getDeliveryMethod();
          if (deliveryMethod?.data && Array.isArray(deliveryMethod.data)) {
            setDelivery(deliveryMethod.data as DeliveryMethod[]);
          } else {
            console.error(
              "Invalid delivery method data format:",
              deliveryMethod
            );
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
    return (
      new Intl.NumberFormat("vi-VN", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + "₫"
    );
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      item.product_price * item.quantity * (1 - (item.discount || 0) / 100),
    0
  );

  // Calculate shipping cost
  const shippingCost = formData.delivery_id === 1 ? 25000 : 40000;

  // Calculate total
  const total = subtotal - shippingCost - discountAmount;

  // Handle cart initialization
  useEffect(() => {
    // Mark cart as ready after initial render
    // This ensures we've had a chance to load from localStorage
    const timer = setTimeout(() => {
      setIsCartReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle authentication and cart validation
  useEffect(() => {
    // Only run when cart is ready and auth is not already checked
    if (!isCartReady || authChecked) return;

    const checkAuthAndCart = async () => {
      // Check if cart is empty using getTotalItems to ensure we have the latest count
      if (getTotalItems() === 0) {
        toast.error(
          "Giỏ hàng của bạn đang trống. Đang chuyển hướng về trang chủ."
        );
        router.push("/");
        return;
      }

      // If auth is still loading, wait for it to complete
      if (isAuthLoading) {
        return;
      }

      // If not authenticated after loading is complete
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để thanh toán.");
        router.push(`/signin?redirect=${encodeURIComponent("/checkout")}`);
        return;
      }

      setAuthChecked(true);
    };

    checkAuthAndCart();
  }, [
    isCartReady,
    cartItems,
    router,
    isAuthenticated,
    isAuthLoading,
    authChecked,
    getTotalItems,
  ]);

  // Show loading state while checking auth or cart
  if (isAuthLoading || !authChecked || !isCartReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty cart message if no items after loading
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Giỏ hàng của bạn đang trống. Đang chuyển hướng về trang chủ...
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
    console.log(formData);
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(formData);
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error on change
  };
  const handleShowCouponList = async () => {
    interface Voucher {
      coupon: {
        code: string;
      };
      active?: boolean;
    }

    const result = await Promise.all(
      myVouchers.map(async (voucher: Voucher) => {
        const data = await applyVoucher(voucher.coupon.code, subtotal);
        return data
          ? { ...voucher, active: true }
          : { ...voucher, active: false };
      })
    );
    result.sort((a, b) => {
      if (a.active && !b.active) return -1; // a is active, b is not
      if (!a.active && b.active) return 1; // b is active, a is not
      return 0; // both are either active or inactive
    });
    setListVouchers(result);
    console.log("Fetching vouchers...", result);
    setShowCouponList(true);
  };

  const handleApplyCoupon = async () => {
    const code = formData.couponCode?.trim().toUpperCase();

    if (!code) {
      toast.error("Vui lòng nhập mã giảm giá.");
      return;
    }
    const data = await applyVoucher(code, subtotal);
    console.log("Coupon data:", data);
    if (!data) {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      setDiscountAmount(0);
      setIsCouponApplied(false);
      toast.error("Mã giảm giá không hợp lệ.");
      return;
    } else {
      setDiscountAmount(data.discount);
      setIsCouponApplied(true);
      toast.success("Áp dụng mã giảm giá thành công!");
    }
    // Giả sử có mã giảm giá cố định là SAVE10 giảm 10%
    // if (code === 'SAVE10') {
    //   const discount = subtotal * 0.1;
    //   setDiscountAmount(discount);
    //   setIsCouponApplied(true);
    //   toast.success('Áp dụng mã giảm giá thành công!');
    // } else {
    //   setDiscountAmount(0);
    //   setIsCouponApplied(false);
    //   toast.error('Mã giảm giá không hợp lệ.');
    // }
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

    // Validate cart has items
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data using the service helper
      const orderData = orderService.prepareOrderData(
        {
          ...formData,
          total,
          couponCode: formData.couponCode || "", // ✅ Gửi mã
        },
        cartItems,
        user?.id ? parseInt(user.id.toString(), 10) : undefined
      );

      console.log("Submitting order:", orderData);

      // Create order
      const response = await orderService.createOrder(orderData);
      console.log("Order created:", response);

      // Handle payment URL redirection if exists
      if (response.payment_url) {
        console.log("Redirecting to payment URL:", response.payment_url);
        // Redirect to PayOS payment page
        window.location.href = response.payment_url;
        return;
      }

      // If no payment URL (e.g., COD), clear cart and redirect to success page
      clearCart();
      router.push(`/order/success?order_id=${response.order_id}`);
    } catch (error) {
      console.error("Error creating order:", error);
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
                <span className="hidden sm:inline">Bước 2/2: </span>
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
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
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
                  delivery.map((item: unknown) => (
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
                  // Fallback options if no delivery methods are available
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
                        alt="Visa"
                        width={130}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                  </span>
                </label>

                {formData.paymentMethod === "payos" && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 mt-2">
                    <p>
                      Sau khi nhấp vào &quot;Thanh toán ngay&quot;, bạn sẽ được
                      chuyển hướng đến PayOS để hoàn tất thanh toán một cách an
                      toàn.
                    </p>
                  </div>
                )}

                <RadioButton
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleInputChange}
                  label="Thanh toán khi nhận hàng (COD)"
                  // icon={<CashIcon />}
                />
              </div>

              {/* Billing Address */}
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
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
              </div>

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
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-sm font-bold mr-2">
                    {cartItems.length}
                  </span>
                </h3>
              </div>
              <div className="p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm text-gray-700 mb-2 last:mb-0"
                  >
                    {" "}
                    {/* Added mb-2 and last:mb-0 for spacing */}
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
                        item.product_price *
                          item.quantity *
                          (1 - (item.discount || 0) / 100)
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mã giảm giá */}
              <div className="px-4 py-4 border-t border-gray-200 relative">
                <input
                  type="text"
                  placeholder="Mã giảm giá"
                  value={formData.couponCode}
                  onFocus={() => handleShowCouponList()}
                  onBlur={() => setTimeout(() => setShowCouponList(false), 150)} // delay để chọn được
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      couponCode: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 text-sm py-2 px-3"
                />
                {showCouponList && listVouchers.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 shadow-lg max-h-60 overflow-auto divide-y divide-gray-100">
                    {listVouchers.map((uc) => (
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

              {/* Tổng kết */}
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
                    -{" "}
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
