// Define CartItem interface locally since it's not exported from cartStore
interface CartItem {
  id: number;
  product_name: string;
  product_price: number | string;
  quantity: number;
  discount?: number;
  image_url?: string;
}

// Define form data interface for checkout
interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  apartment: string;
  note?: string;
  paymentMethod: 'cod' | 'payos';
  shippingMethod: 'localHCM' | 'outsideHCM';
  total: number;
  couponCode?: string;
}

export interface OrderItemDetail {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  userId?: number | null;
  delivery_id: number;
  payment_type: 'cod' | 'payos';
  total_price: number;
  shipping_address: string;
  payment_status: 'pending' | 'paid' | 'failed';
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  details: OrderItemDetail[];
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: number;
  order_code: string;
  payment_url?: string;
  message?: string;
  error?: string;
}

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
  }
};
