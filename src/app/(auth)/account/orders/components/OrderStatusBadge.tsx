import { OrderWithUser } from '@/app/type/order';

const STATUS_CONFIG = {
  pending: { text: 'Chờ xác nhận', style: 'bg-yellow-100 text-yellow-800' },
  processing: { text: 'Đang xử lý', style: 'bg-blue-100 text-blue-800' },
  shipped: { text: 'Đang giao hàng', style: 'bg-purple-100 text-purple-800' },
  delivered: { text: 'Đã giao', style: 'bg-green-100 text-green-800' },
  cancelled: { text: 'Đã hủy', style: 'bg-red-100 text-red-800' },
  default: { text: 'Không rõ', style: 'bg-gray-100 text-gray-800' },
};

interface OrderStatusBadgeProps {
  status: OrderWithUser['productStatus'];
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.style}`}>
      {config.text}
    </span>
  );
}