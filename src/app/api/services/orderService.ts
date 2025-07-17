// Define CartItem interface locally since it's not exported from cartStore
import { CreateOrderRequest, CreateOrderResponse, CheckoutFormData, CartItem, OrderItemDetail } from '@/app/type/order';
import { apiClient } from '../apiClient';
import { API_CONFIG } from '../apiConfig';


const API_BASE_URL = 'http://localhost:3000';

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
        message: 'Đơn hàng đã được tạo thành công'
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  mapCartItemsToOrderItems(cartItems: CartItem[]): OrderItemDetail[] {
    return cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: typeof item.product_price === 'string'
        ? parseFloat(item.product_price)
        : item.product_price
    }));
  },

  // Helper to prepare order data for the API
  prepareOrderData(
    formData: CheckoutFormData,
    cartItems: CartItem[],
    userId?: number
  ): CreateOrderRequest {
    const isPayOS = formData.paymentMethod === 'payos';

    return {
      userId: userId || null,
      delivery_id: formData.delivery_id,
      payment_type: isPayOS ? 'payos' : 'cod',
      total_price: formData.total,
      shipping_address: `${formData.address}, ${formData.city}`,
      payment_status: isPayOS ? 'pending' : 'pending',
      productStatus: 'pending',
      couponCode: formData.couponCode,
      details: this.mapCartItemsToOrderItems(cartItems)
    };
  },

  // Xóa đơn hàng
  async deleteOrder(id: string) {
    return apiClient.delete<CartItem[]>(API_CONFIG.ENDPOINTS.ORDERS.BY_ID(id));
  },
  // Lấy tất cả đơn hàng
  async getAllOrders() {
    return apiClient.get<CreateOrderRequest[]>(API_CONFIG.ENDPOINTS.ORDERS.BASE);
  },

  //Lấy đơn hàng theo ID
  async getOrderById(id: string) {
    return apiClient.get<CreateOrderRequest[]>(API_CONFIG.ENDPOINTS.ORDERS.BY_ID(id));
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

  async getDeliveryMethod() {
    return apiClient.get<CreateOrderRequest[]>(API_CONFIG.ENDPOINTS.ORDERS.DELIVERY);

  },
};
