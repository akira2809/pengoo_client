// app/checkout/page.tsx
'use client'; // This directive makes this a Client Component

import React, { useState } from 'react';
import InputField from '../../(public)/checkout/component/InputField'; // Adjust path based on your structure
import RadioButton from '../../(public)/checkout/component/RadioButton'; // Adjust path based on your structure

// Define the type for your form data
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
  paymentMethod: 'onepay' | 'cod';
  billingAddress: 'sameAsShipping' | 'different';
  // If 'different' billing address is implemented, add its fields here
  // billingAddressLine1?: string;
  // billingCity?: string;
  // ...
}

const CheckoutPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    country: 'Vietnam',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: '',
    saveInfo: false,
    shippingMethod: 'localHCM', // 'localHCM' or 'outsideHCM'
    paymentMethod: 'onepay', // 'onepay' or 'cod'
    billingAddress: 'sameAsShipping', // 'sameAsShipping' or 'different'
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // Type assertion for checkbox 'checked'

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Add your checkout logic here (e.g., API call to process order)
  };

  // Dummy product data
  const product = {
    name: 'Bầu Cua Khai Xuân',
    quantity: 1,
    price: 999000,
    image: '/images/bau-cua.jpg', // Thay bằng đường dẫn ảnh thật của bạn
  };

  const subtotal = product.price * product.quantity;
  const shippingCost = formData.shippingMethod === 'localHCM' ? 25000 : 40000;
  const total = subtotal + shippingCost;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh toán</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section: Checkout Form */}
          <div className="flex-1 bg-white p-6 lg:p-10 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Thanh Toán</h2>

            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Liên hệ</h3>
              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              {/* Shipping Information */}
              <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Giao hàng</h3>
              <div className="mb-4">
                <label htmlFor="country" className="block text-gray-700 text-sm font-medium mb-2">
                  Quốc gia/Vùng
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                >
                  <option value="Vietnam">Việt Nam</option>
                  {/* Add more countries if needed */}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Tên"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  label="Họ"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <InputField
                label="Địa chỉ"
                id="address"
                name="address"
                placeholder="Địa chỉ giao hàng"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Căn hộ, phòng, v.v. (không bắt buộc)"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Thành phố"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Mã bưu chính (không bắt buộc)"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Điện thoại"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <label htmlFor="saveInfo" className="ml-2 text-gray-700 text-sm">
                  Lưu lại thông tin này cho lần sau
                </label>
                {/* Replace with your actual info icon */}
                <span className="ml-2 text-blue-500 cursor-pointer text-sm">[Icon thông tin]</span>
              </div>

              {/* Shipping Method */}
              <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Phương thức vận chuyển</h3>
              <div className="border border-gray-300 rounded-md p-4">
                <RadioButton
                  label="Nội thành TP Hồ Chí Minh"
                  id="shippingLocalHCM"
                  name="shippingMethod"
                  value="localHCM"
                  checked={formData.shippingMethod === 'localHCM'}
                  onChange={handleInputChange}
                >
                  <span className="ml-auto text-gray-600">{formatCurrency(25000)}</span>
                </RadioButton>
                <div className="border-t border-gray-200 my-2"></div> {/* Divider */}
                <RadioButton
                  label="Ngoại thành TP Hồ Chí Minh"
                  id="shippingOutsideHCM"
                  name="shippingMethod"
                  value="outsideHCM"
                  checked={formData.shippingMethod === 'outsideHCM'}
                  onChange={handleInputChange}
                >
                  <span className="ml-auto text-gray-600">{formatCurrency(40000)}</span>
                </RadioButton>
              </div>

              {/* Payment Method */}
              <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Thanh toán</h3>
              <p className="text-sm text-gray-500 mb-4">Tất cả các giao dịch được bảo mật và mã hóa.</p>
              <div className="border border-gray-300 rounded-md p-4">
                <RadioButton
                  label="OnePay - Credit/ATM card/QR"
                  id="paymentOnePay"
                  name="paymentMethod"
                  value="onepay"
                  checked={formData.paymentMethod === 'onepay'}
                  onChange={handleInputChange}
                >
                  <div className="ml-auto flex items-center space-x-2">
                    <img src="/images/visa.png" alt="Visa" className="h-5 w-auto" /> {/* Replace with your icons */}
                    <img src="/images/mastercard.png" alt="Mastercard" className="h-5 w-auto" />
                    <img src="/images/jcb.png" alt="JCB" className="h-5 w-auto" />
                    <span className="text-gray-500 text-xs">+1</span>
                  </div>
                </RadioButton>
                {formData.paymentMethod === 'onepay' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md text-gray-600 text-sm">
                    <p>
                      Bạn sẽ được chuyển hướng đến cổng thanh toán OnePay để hoàn tất giao dịch.
                    </p>
                    {/* Add an image for OnePay instruction if desired */}
                    {/* <img src="/images/onepay-instruction.png" alt="OnePay Instruction" className="mt-2 max-w-full h-auto" /> */}
                  </div>
                )}
                <div className="border-t border-gray-200 my-4"></div> {/* Divider */}
                <RadioButton
                  label="Thanh toán khi nhận hàng (COD)"
                  id="paymentCOD"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
              </div>

              {/* Billing Address */}
              <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Địa chỉ thanh toán</h3>
              <div className="border border-gray-300 rounded-md p-4">
                <RadioButton
                  label="Giống địa chỉ giao hàng"
                  id="billingSame"
                  name="billingAddress"
                  value="sameAsShipping"
                  checked={formData.billingAddress === 'sameAsShipping'}
                  onChange={handleInputChange}
                />
                <div className="border-t border-gray-200 my-2"></div> {/* Divider */}
                <RadioButton
                  label="Sử dụng địa chỉ thanh toán khác"
                  id="billingDifferent"
                  name="billingAddress"
                  value="different"
                  checked={formData.billingAddress === 'different'}
                  onChange={handleInputChange}
                />
                {/* You would add more input fields here if billingAddress is 'different' */}
                {formData.billingAddress === 'different' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    {/* Add billing address fields here, similar to shipping fields */}
                    <InputField label="Địa chỉ thanh toán" id="billingAddr" name="billingAddr" placeholder="Địa chỉ khác" />
                    {/* ... other billing address fields */}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline text-lg"
                >
                  Thanh toán ngay
                </button>
              </div>
            </form>
          </div>

          {/* Right Section: Order Summary (Sticky) */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-700 mb-6">Tóm tắt đơn hàng</h3>
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">Số lượng: {product.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-800">{formatCurrency(product.price)}</span>
                  </div>

                  <div className="border-t border-gray-200 my-6 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <InputField
                        id="discountCode"
                        name="discountCode"
                        placeholder="Mã giảm giá"
                        className="flex-grow mr-2"
                      />
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-gray-700 text-sm mb-2">
                    <span>Tổng phụ:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm mb-4">
                    <span>Vận chuyển:</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4 sticky bottom-0 bg-gray-50 pb-2">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                      <span>Tổng:</span>
                      <span className="text-orange-600">{formatCurrency(total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Đã bao gồm thuế (nếu có)</p>
                  </div>
                </div>
                {/* REMOVE THE FOLLOWING DUPLICATE BLOCK */}
                {/*
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Tổng:</span>
                    <span className="text-orange-600">{formatCurrency(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Đã bao gồm thuế (nếu có)</p>
                </div>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;