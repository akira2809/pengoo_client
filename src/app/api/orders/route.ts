import { NextResponse } from 'next/server';
import { PayOS } from '@payos/node';

// This is your API route handler for /api/orders
export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'customer_email', 'customer_name', 'customer_phone',
      'shipping_address', 'shipping_city', 'payment_method',
      'shipping_method', 'items'
    ];
    
    const missingFields = requiredFields.filter(field => !orderData[field]);
    if (missingFields.length > 0 || !orderData.items?.length) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc' }, 
        { status: 400 }
      );
    }

    // Generate order code from timestamp
    const orderCode = Date.now().toString();
    
    // Handle payment if payment method is payos
    let paymentUrl = '';
    
    if (orderData.payment_method === 'payos') {
      const payos = new PayOS(
        process.env.PAYOS_CLIENT_ID!,
        process.env.PAYOS_API_KEY!,
        process.env.PAYOS_CHECKSUM_KEY!
      );

      // Prepare payment data
      const paymentData = {
        orderCode: parseInt(orderCode),
        amount: orderData.total_amount,
        description: `Thanh toán đơn hàng #${orderCode}`,
        items: [
          ...orderData.items.map((item: { 
            product_name: string; 
            quantity: number; 
            product_price: number; 
            discount?: number 
          }) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.product_price * (1 - (item.discount || 0) / 100)
          })),
          {
            name: 'Phí vận chuyển',
            quantity: 1,
            price: orderData.shipping_fee || 0
          }
        ],
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancel=true`,
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?order_id=${orderCode}`,
        signature: ''
      };

      // Create payment link
      const paymentLink = await payos.createPaymentLink(paymentData);
      paymentUrl = paymentLink.checkoutUrl;
    }

    // In a real app, save the order to your database here
    // const order = { ...orderData, order_code: orderCode, status: 'pending' };
    // await db.collection('orders').insertOne(order);

    return NextResponse.json({
      success: true,
      order_id: orderCode,
      order_code: orderCode,
      payment_url: paymentUrl,
      message: 'Đơn hàng đã được tạo thành công'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng' 
      }, 
      { status: 500 }
    );
  }
}
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
