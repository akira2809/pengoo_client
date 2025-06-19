import { CartItem } from '@/app/stores/slice/cartStore';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  discount?: number;
}

export interface CreateOrderRequest {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district?: string;
  shipping_ward?: string;
  shipping_note?: string;
  payment_method: 'cod' | 'onepay';
  shipping_method: 'localHCM' | 'outsideHCM';
  items: OrderItem[];
  total_amount: number;
  shipping_fee: number;
  discount_amount?: number;
  note?: string;
}

export interface OrderResponse {
  success: boolean;
  order_id?: string;
  payment_url?: string;
  message?: string;
  error?: string;
}

export const orderService = {
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  mapCartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: typeof item.product_price === 'string' 
        ? parseFloat(item.product_price) 
        : item.product_price,
      discount: item.discount || 0,
    }));
  },
};
