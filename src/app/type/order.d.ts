interface CartItem {
  discount: number;
  image_url: string;
  product_name: string;
  id: number;
  productId: mumber;
  quantity: number;
  price: number;
  product_price: number;
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
  phone_number: string;
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
  phoneNumber: string;
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
  total_price: number;
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  coupon_discount?: number;
  phone_number?: string;
}

export interface IBank {
  name: string;
  bin: string;
  logo: string;
  id: number;
}

export interface OrderWithUser extends Omit<CreateOrderResponse, 'details'> {
  user?: {
    id: number | string;
    username?: string;
    full_name?: string;
    email?: string;
    phone_number?: number;
    avatar_url?: string;
  };
  delivery?: {
    name?: string;
    description?: string;
    fee?: string | number;
    estimatedTime?: string;
  };
  details?: OrderItemDetail[];
  order_date?: string;
  order_code: string;
  total_price: number;
  shipping_address?: string;
  payment_type?: string;
  payment_status?: string;
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  coupon_discount?: number; // Thêm dòng này
  phone_number?: string; // Thêm dòng này nếu chưa có
  [key: string]: unknown;
}
