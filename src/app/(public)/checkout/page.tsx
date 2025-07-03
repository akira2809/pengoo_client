'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/stores/slice/cartStore';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { orderService } from '@/app/api/services/orderService';
import InputField from '../../(public)/checkout/component/InputField';
import RadioButton from '../../(public)/checkout/component/RadioButton';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useStore } from '@/app/stores/store';

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
  shippingMethod: 'localHCM' | 'outsideHCM';
  paymentMethod: 'payos' | 'cod';
  billingAddress: 'sameAsShipping' | 'different';
  note?: string;
  couponCode?: string;
}

const CheckoutPage: React.FC = () => {
  const myVouchers = useStore((state) => state.myVouchers);
  const fetchMyVouchers = useStore((state) => state.fetchMyVouchers);
  const [showCouponList, setShowCouponList] = useState(false); // Dropdown toggle
  const router = useRouter();
  const { items: cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || '',
    country: 'Vietnam',
    firstName: user?.full_name?.split(' ').slice(0, -1).join(' ') || '',
    lastName: user?.full_name?.split(' ').slice(-1)[0] || '',
    address: user?.address || '',
    apartment: '',
    city: 'Hồ Chí Minh',
    postalCode: '',
    phone: user?.phone_number || '',
    saveInfo: true,
    shippingMethod: 'outsideHCM',
    paymentMethod: 'payos',
    billingAddress: 'sameAsShipping',
    note: '',
    couponCode: '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (!user?.id) return;

    setFormData((prev) => ({
      ...prev,
      email: user.email || prev.email,
      firstName: user.full_name?.split(' ').slice(0, -1).join(' ').trim() || prev.firstName,
      lastName: user.full_name?.split(' ').slice(-1)[0] || prev.lastName,
      address: user.address || prev.address,
      phone: user.phone_number || prev.phone,
    }));
  }, [user?.id]);
  // Gọi API lấy mã giảm giá
  useEffect(() => {
    if (user?.id) {
      fetchMyVouchers();
    }
  }, [user?.id]);


  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + '₫';
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) =>
    sum + (item.product_price * item.quantity * (1 - (item.discount || 0) / 100)),
    0
  );

  // Calculate shipping cost
  const shippingCost = formData.shippingMethod === 'localHCM' ? 25000 : 40000;

  // Calculate total
  const total = subtotal - shippingCost - discountAmount;

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống. Đang chuyển hướng về trang chủ.');
      router.push('/');
    }
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để thanh toán.');
      router.push('/signin?redirect=/checkout');
    }
  }, [cartItems, router, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: undefined })); // Clear error on change
  };

  const handleApplyCoupon = () => {
  const code = formData.couponCode?.trim().toUpperCase();

  if (!code) {
    toast.error('Vui lòng nhập mã giảm giá.');
    return;
  }

  // Giả sử có mã giảm giá cố định là SAVE10 giảm 10%
  if (code === 'SAVE10') {
    const discount = subtotal * 0.1;
    setDiscountAmount(discount);
    setIsCouponApplied(true);
    toast.success('Áp dụng mã giảm giá thành công!');
  } else {
    setDiscountAmount(0);
    setIsCouponApplied(false);
    toast.error('Mã giảm giá không hợp lệ.');
  }
};

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.email) newErrors.email = 'Email là bắt buộc.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ.';
    if (!formData.firstName) newErrors.firstName = 'Tên là bắt buộc.';
    if (!formData.lastName) newErrors.lastName = 'Họ là bắt buộc.';
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc.';
    if (!formData.city) newErrors.city = 'Thành phố là bắt buộc.';
    if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc.';
    else if (!/^\d{10,11}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate cart has items
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống');
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
          couponCode: formData.couponCode || '', // ✅ Gửi mã
        },
        cartItems,
        user?.id ? parseInt(user.id.toString(), 10) : undefined
      );

      console.log('Submitting order:', orderData);

      // Create order
      const response = await orderService.createOrder(orderData);
      console.log('Order created:', response);

      // Handle payment URL redirection if exists
      if (response.payment_url) {
        console.log('Redirecting to payment URL:', response.payment_url);
        // Redirect to PayOS payment page
        window.location.href = response.payment_url;
        return;
      }

      // If no payment URL (e.g., COD), clear cart and redirect to success page
      clearCart();
      router.push(`/order/success?order_id=${response.order_id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Đang chuyển hướng về giỏ hàng...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
          {/* Checkout Form - Left Side */}
          <div className="lg:order-1 order-2">
            <h1 className="sr-only">Thanh toán</h1>
            {/* Start of the form */}
            <form onSubmit={handleSubmit} className="max-w-lg lg:max-w-none mx-auto">
              {/* Contact Information */}
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Liên hệ</h2>
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
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Giao hàng</h2>
              <div className="mb-4">
                <label htmlFor="country" className="sr-only">Quốc gia/Vùng</label>
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
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
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
                      ${errors.city ? 'border-red-500' : ''}
                    `}
                  >
                    <option value="">Chọn thành phố</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
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
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Phương thức vận chuyển</h2>
              <div className="space-y-3 mb-6">
                <RadioButton
                  id="localHCM"
                  name="shippingMethod"
                  value="localHCM"
                  checked={formData.shippingMethod === 'localHCM'}
                  onChange={handleInputChange}
                  label="Nội thành TP Hồ Chí Minh"
                  price={25000}
                  formatPrice={formatCurrency}
                  // icon={<TruckIcon />}
                />
                <RadioButton
                  id="outsideHCM"
                  name="shippingMethod"
                  value="outsideHCM"
                  checked={formData.shippingMethod === 'outsideHCM'}
                  onChange={handleInputChange}
                  label="Ngoại thành TP Hồ Chí Minh"
                  price={40000}
                  formatPrice={formatCurrency}
                  // icon={<CashIcon />}
                />
              </div>

              {/* Payment Method */}
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Thanh toán</h2>
              <p className="text-sm text-gray-600 mb-4">Toàn bộ các giao dịch được bảo mật và mã hóa.</p>
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
                    checked={formData.paymentMethod === 'payos'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                  />
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">Thanh toán trực tuyến (PayOS)</span>
                    <div className="mt-2 flex items-center space-x-2">
                      <Image src="/images/visa.png" alt="Visa" width={30} height={20} className="object-contain"/>
                      <Image src="/images/mastercard.png" alt="MasterCard" width={30} height={20} className="object-contain"/>
                      <Image src="/images/jcb.png" alt="JCB" width={30} height={20} className="object-contain"/>
                    </div>
                  </span>
                </label>

                {formData.paymentMethod === 'payos' && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 mt-2">
                    <p>Sau khi nhấp vào &quot;Thanh toán ngay&quot;, bạn sẽ được chuyển hướng đến PayOS để hoàn tất thanh toán một cách an toàn.</p>
                  </div>
                )}

                <RadioButton
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  label="Thanh toán khi nhận hàng (COD)"
                  // icon={<CashIcon />}
                />
              </div>

              {/* Billing Address */}
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Địa chỉ thanh toán</h2>
              <div className="space-y-3 mb-6">
                <RadioButton
                  id="sameAsShipping"
                  name="billingAddress"
                  value="sameAsShipping"
                  checked={formData.billingAddress === 'sameAsShipping'}
                  onChange={handleInputChange}
                  label="Giống địa chỉ vận chuyển"
                  // isCustomClass={true}
                />
                <RadioButton
                  id="different"
                  name="billingAddress"
                  value="different"
                  checked={formData.billingAddress === 'different'}
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
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang xử lý...' : `Thanh toán ngay`}
              </button>
            </form> {/* End of the form */}
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
                    <div key={item.id} className="flex items-center justify-between text-sm text-gray-700 mb-2 last:mb-0"> {/* Added mb-2 and last:mb-0 for spacing */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden rounded-md border border-gray-200">
                                <Image
                                    src={item.image_url || '/images/placeholder-product.png'}
                                    alt={item.product_name}
                                    fill
                                    sizes="40px"
                                    style={{ objectFit: 'cover' }}
                                />
                                <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs px-1 rounded-full">{item.quantity}</span>
                            </div>
                            <span className="ml-3 font-medium text-gray-800">{item.product_name}</span>
                        </div>
                        <span className="text-gray-900">{formatCurrency(item.product_price * item.quantity * (1 - (item.discount || 0) / 100))}</span>
                    </div>
                ))}
              </div>

              {/* Mã giảm giá */}
              <div className="px-4 py-4 border-t border-gray-200 relative">
                <input
                  type="text"
                  placeholder="Mã giảm giá"
                  value={formData.couponCode}
                  onFocus={() => setShowCouponList(true)}
                  onBlur={() => setTimeout(() => setShowCouponList(false), 150)} // delay để chọn được
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      couponCode: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 text-sm py-2 px-3"
                />
                {showCouponList && myVouchers.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 shadow-sm max-h-48 overflow-auto">
                    {myVouchers.map((uc) => (
                      <li
                        key={uc.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            couponCode: uc.coupon.code,
                          }));
                          setShowCouponList(false);
                        }}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {uc.coupon.code} - {uc.coupon.description || 'Không có mô tả'}
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
                  <span>- {shippingCost === 0 ? 'Miễn phí' : formatCurrency(shippingCost)}</span>
                </div>
              </div>

              <div className="px-4 py-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-base text-gray-900">Tổng</span>
                <span className="text-xl font-bold text-brown-700">VND {formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;