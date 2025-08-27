// Define CartItem interface locally since it's not exported from cartStore
import { CreateOrderRequest, CreateOrderResponse, CheckoutFormData, CartItem, OrderItemDetail } from '@/app/type/order';
import { apiClient } from '../apiClient';
import { API_CONFIG } from '../apiConfig';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const orderService = {
  createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }

      // Return the response with checkout_url for payment
      return {
        success: true,
        order_id: data.id,
        order_code: data.order_code || String(data.id),
        payment_url: data.checkout_url, // This is the PayOS payment URL
        message: 'Đơn hàng đã được tạo thành công',
        id: data.id,
        details: data.details || [],
        total_price: data.total_price || orderData.total_price,
        productStatus: data.productStatus || 'pending'
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  mapCartItemsToOrderItems(cartItems: CartItem[], orderId: number = 0): OrderItemDetail[] {
    return cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price:  Number(item.product_price) * (1 - (Number(item.discount) || 0) / 100),
      orderId: orderId
    }));
  },

  // Helper to prepare order data for the API
  prepareOrderData(
    formData: CheckoutFormData,
    cartItems: CartItem[],
    userId?: number
  ): CreateOrderRequest {
    let payment_type: "cod" | "payos" | "paypal" = 'cod';
    if (formData.paymentMethod === 'payos') payment_type = 'payos';
    else if (formData.paymentMethod === 'paypal') payment_type = 'paypal';

    const orderData: CreateOrderRequest = {
      id: 0,
      name: formData.name || '',
      fee: formData.fee || 0,
      description: formData.description || '',
      userId: userId || null,
      delivery_id: formData.delivery_id,
      payment_type, // <-- now supports 'paypal'
      total_price: formData.total,
      phoneNumber: formData.phone_number,
      shipping_address: `${formData.address}, ${formData.city}`,
      payment_status: payment_type === 'payos' || payment_type === 'paypal' ? 'pending' : 'pending',
      productStatus: 'pending',
      couponCode: formData.couponCode,
      details: this.mapCartItemsToOrderItems(cartItems)
    };

    return orderData;
  },

  // Xóa đơn hàng
  async deleteOrder(id: number) {
    return apiClient.delete<CartItem[]>(API_CONFIG.ENDPOINTS.ORDERS.BY_ID(id));
  },
  // Lấy tất cả đơn hàng
  async getAllOrders() {
    return apiClient.get<CreateOrderRequest[]>(API_CONFIG.ENDPOINTS.ORDERS.BASE);
  },

  //Lấy đơn hàng theo ID
  async getOrderById(id: number) {
    return apiClient.get<CreateOrderRequest[]>(API_CONFIG.ENDPOINTS.ORDERS.BY_ID(id));
  },
  async getOrderByOrderCode(orderCode: number) {
    return apiClient.get<CreateOrderRequest[]>(API_CONFIG.ENDPOINTS.ORDERS.BY_ORDER_CODE(orderCode));
  },

  // Huỷ đơn hàng
  async cancelOrder(orderId: number): Promise<void> {
    try {
      await apiClient.patch(API_CONFIG.ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), {
        productStatus: 'cancelled'
      });
    } catch (error) {
      console.error('Cancel order failed:', error);
      throw error;
    }
  },
  async resendInvoice(orderId: number | string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`/api/orders/${orderId}/resend-invoice`, {
        method: "POST",
      });
      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Có lỗi xảy ra khi gửi lại hóa đơn" };
    }
  },
  // Tải hóa đơn (download)
  async downloadInvoice(orderId: number | string): Promise<Blob | null> {
    try {
      const res = await fetch(`/api/orders/${orderId}/resend-invoice`, {
        method: "GET",
      });
      if (res.status === 403) {
        throw new Error("Hóa đơn chỉ có thể tải sau khi thanh toán COD được xác nhận.");
      }
      if (!res.ok) {
        throw new Error("Không tìm thấy hóa đơn.");
      }
      return await res.blob();
    } catch (error) {
      throw error;
    }
  },
  async getDeliveryMethod() {
    return apiClient.get<CreateOrderRequest[]>(API_CONFIG.ENDPOINTS.ORDERS.DELIVERY);
  },

  // Lấy đơn hàng của người dùng
  async getUserOrders() {
    return apiClient.get<unknown[]>(API_CONFIG.ENDPOINTS.ORDERS.USER_ORDERS);
  },

  //hủy thanh toán
  async cancelPayment(orderCoder: number) {
    return apiClient.post<unknown[]>(API_CONFIG.ENDPOINTS.ORDERS.CANCEL_PAYMENT(orderCoder));
  },
  async successPayment(orderCoder: number) {
    return apiClient.post<unknown[]>(API_CONFIG.ENDPOINTS.ORDERS.SUCCESS_PAYMENT(orderCoder));
  },

  // Cập nhật địa chỉ đơn hàng
  async updateOrderAddress(orderId: number, newAddress: string, newPhoneNumber: string) {
    console.log('update address successfully', { newAddress, newPhoneNumber });
    return apiClient.patch<unknown[]>(
      API_CONFIG.ENDPOINTS.ORDERS.UPDATE_ADDRESS(orderId),
      { shipping_address: newAddress, 
        phone_number: newPhoneNumber 
      }
    );
  },

  async submitRefundRequest({
    orderId,
    userId,
    reason,
    images,
    video,
    paymentMethod,
    toAccountNumber,
    toBin,
    bank,
  }: {
    orderId: number;
    userId: number;
    reason: string;
    images: string[];
    video: string | null;
    paymentMethod: string;
    toAccountNumber: string;
    toBin: string;
    bank: string;
  }) {
    const evidence: { type: string; url: string }[] = [
      ...images.map(url => ({ type: 'image', url })),
      ...(video ? [{ type: 'video', url: video }] : []),
    ];

    const payload = {
      order_id: orderId,
      user_id: userId,
      reason,
      uploadFiles: evidence,
      paymentMethod,
      toAccountNumber,
      toBin,
      bank,
    };

    return apiClient.post('/orders/refund-request', payload);
  },
};
