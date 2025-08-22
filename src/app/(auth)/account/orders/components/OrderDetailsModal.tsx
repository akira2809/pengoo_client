import { OrderWithUser } from '@/app/type/order';
import { OrderItemList } from './OrderItemList';
import { formatOrderDate, formatPrice } from '@/app/utils/formatters';

interface OrderDetailsModalProps {
  order: OrderWithUser | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

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
          <p>SĐT: {order.user?.phone_number}</p>
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
          <p>Tổng tiền: {formatPrice(order.total_price)}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Sản phẩm</h3>
          <OrderItemList items={order.details || []} />
        </div>

        <div className="flex justify-end">
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