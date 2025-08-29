import { OrderWithUser } from '@/app/type/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderItemList } from './OrderItemList';
import { formatOrderDate, formatPrice } from '@/app/utils/formatters';


interface OrderCardProps {
  order: OrderWithUser;
  onViewDetails: (order: OrderWithUser) => void;
  onEditAddress: (order: OrderWithUser) => void;
  onReturnOrder: (order: OrderWithUser) => void;
  onCancelOrder: (id: number) => void;
}

export function OrderCard({ order, onViewDetails, onEditAddress, onReturnOrder, onCancelOrder }: OrderCardProps) {
  // Ensure refundRequests is always an array
  const refundRequests = Array.isArray(order.refundRequests) ? order.refundRequests : [];

  // Explicitly type r as { status?: string }
  const hasPendingRefund = refundRequests.some((r: { status?: string }) => r.status === 'PENDING');
  const hasRefunded = refundRequests.some((r: { status?: string }) => r.status === 'REFUNDED');
  const maxRefundRequestsReached = refundRequests.length >= 3;

  const canRequestRefund =
    order.productStatus === 'delivered' &&
    !hasPendingRefund &&
    !hasRefunded &&
    !maxRefundRequestsReached;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
      <div className="p-4 sm:p-5 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900">Mã đơn hàng: #{order.id}</h3>
          {order.order_code && (
            <p className="text-sm text-gray-600">Order Code: {order.order_code}</p>
          )}
          <p className="text-sm text-gray-500">Ngày đặt: {formatOrderDate(order.order_date)}</p>
        </div>
        <OrderStatusBadge status={order.productStatus} />
      </div>

      <div className="p-4 sm:p-5">
        <OrderItemList items={order.details || []} />
      </div>

      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 gap-3 sm:gap-0">
        <div className="font-semibold text-lg text-gray-900">
          <span>Tổng tiền: </span>
          <span>{formatPrice(order.total_price)}</span>
        </div>
        <div className="flex gap-3">
          {order.productStatus === 'pending' && (
            <div>
              <button
                onClick={() => onCancelOrder(order.id)}
                className="px-4 mr-3 py-2 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                Hủy đơn
              </button>
              <button
                onClick={() => onEditAddress(order)}
                className="px-4 py-2 text-sm font-medium text-text-800 bg-white border border-background-800 rounded-md hover:bg-background-800 hover:text-white transition-colors duration-200"
              >
                Cập nhật thông tin giao hàng
              </button>
            </div>
          )}

          {canRequestRefund && (
            <button
              onClick={() => onReturnOrder(order)}
              className="px-4 py-2 text-sm font-medium text-yellow-600 bg-white border border-yellow-300 rounded-md hover:bg-yellow-500 hover:text-white transition-colors duration-200"
            >
              Hoàn đơn
            </button>
          )}
          {!canRequestRefund && order.productStatus === 'delivered' && (
            <button
              disabled
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed"
              title={
                hasPendingRefund
                  ? 'Đã có yêu cầu hoàn đơn đang chờ xử lý'
                  : hasRefunded
                  ? 'Đơn hàng đã được hoàn tiền'
                  : maxRefundRequestsReached
                  ? 'Bạn đã đạt giới hạn số lần yêu cầu hoàn đơn'
                  : ''
              }
            >
              Hoàn đơn không khả dụng
            </button>
          )}
          <button
            onClick={() => onViewDetails(order)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-900 transition-colors duration-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}