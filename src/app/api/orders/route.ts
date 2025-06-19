import { NextResponse } from 'next/server';
import { orderService } from '@/app/api/services/orderService';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.customer_email || !orderData.customer_name || !orderData.customer_phone || 
        !orderData.shipping_address || !orderData.shipping_city || !orderData.payment_method || 
        !orderData.shipping_method || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Create order in your database
    // 2. Process payment if needed
    // 3. Send confirmation email
    // 4. Update inventory
    
    // For now, we'll simulate a successful order creation
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    // If payment method is online payment, generate a payment URL
    let paymentUrl = '';
    if (orderData.payment_method === 'onepay') {
      // In a real app, you would integrate with a payment gateway here
      paymentUrl = `https://payment-gateway.example.com/pay?order_id=${orderId}&amount=${orderData.total_amount}`;
    }

    // Return success response
    return NextResponse.json({
      success: true,
      order_id: orderId,
      payment_url: paymentUrl || undefined,
      message: 'Đơn hàng đã được tạo thành công',
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tạo đơn hàng' },
      { status: 500 }
    );
  }
}

// Add TypeScript types for the request body
type CreateOrderRequest = {
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
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
    discount?: number;
  }>;
  total_amount: number;
  shipping_fee: number;
  discount_amount?: number;
  note?: string;
};
