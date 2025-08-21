interface CartItem {
  discount: number;
  image_url: string;
  product_name: string;
  id: number;
  productId: mumber;
  quantity: number;
  price:number;
  product_price:number;
}

// Define form data interface for checkout
interface CheckoutFormData {
  name: string;
  fee: number;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  apartment: string;
  note?: string;
  paymentMethod: 'cod' | 'payos' | 'paypal';
  shippingMethod: 'localHCM' | 'outsideHCM';
  total: number;
  couponCode?: string;
  delivery_id: number;
}

export interface OrderItemDetail {
  productId: number;
  quantity: number;
  price: number;
  orderId: number;
}

export interface CreateOrderRequest {
  id: number;
  name: string;
  fee: number;
  description: string;
  userId?: number | null;
  delivery_id: number;
  payment_type: 'cod' | 'payos' | 'paypal';
  total_price: number;
  shipping_address: string;
  payment_status: 'pending' | 'paid' | 'failed';
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  details: OrderItemDetail[];
//   order_date?: string;
//   order_id: number;
//   order_code: string;
}

export interface CreateOrderResponse {
  id: number;
  success: boolean;
  order_id: number;
  order_code: string;
  payment_url?: string;
  message?: string;
  error?: string;
  details: OrderItemDetail[];
  order_date?: string;
  order_id: number;
  order_code: string;
  total_price: number;
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}