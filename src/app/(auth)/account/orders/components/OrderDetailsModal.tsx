import { OrderWithUser } from '@/app/type/order';
import { OrderItemList } from './OrderItemList';
import { formatOrderDate, formatPrice } from '@/app/utils/formatters';

interface OrderDetailsModalProps {
  order: OrderWithUser | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  // Tính toán các thành phần giá
  const subtotal = order.details?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const discountAmount = order.coupon_discount || 0;
  const shippingFee = order.delivery?.fee ? Number(order.delivery.fee) : 0;
  const total = order.total_price || subtotal - discountAmount + shippingFee;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{order.id}</h2>
        <p className="text-sm text-gray-500 mb-4">Ngày đặt: {formatOrderDate(order.order_date)}</p>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Thông tin khách hàng</h3>
          <p>Họ tên: {order.user?.full_name}</p>
          <p>Email: {order.user?.email}</p>
          <p>SĐT: {order?.phone_number}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Thông tin giao hàng</h3>
          <p>Địa chỉ: {order.shipping_address}</p>
          <p>Đơn vị vận chuyển: {order.delivery?.name}</p>
          <p>Phí ship: {formatPrice(order.delivery?.fee)}</p>
          <p>Thời gian dự kiến: {order.delivery?.estimatedTime}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Thanh toán</h3>
          <p>Phương thức: {order.payment_type}</p>
          
          {/* Hiển thị mã giảm giá nếu có */}
          {order.couponCode && (
            <p className="text-green-600">
              Mã giảm giá: {order.couponCode}
              {discountAmount > 0 && ` (-${formatPrice(discountAmount)})`}
            </p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Sản phẩm</h3>
          <OrderItemList items={order.details || []} />
        </div>

        {/* Chi tiết giá */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Chi tiết thanh toán</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá ({order.couponCode}):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Tổng cộng:</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}