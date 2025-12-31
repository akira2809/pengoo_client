import { OrderWithUser } from '@/app/type/order';
import { OrderCard } from './OrderCard';
import { ProductPagination } from '@/app/(public)/products/component/layouts/product/ProductPagination';

interface OrderListProps {
  orders: OrderWithUser[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewDetails: (order: OrderWithUser) => void;
  onEditAddress: (order: OrderWithUser) => void;
  onReturnOrder: (order: OrderWithUser) => void;
  onCancelOrder: (id: number) => void;
}

export function OrderList({
  orders,
  currentPage,
  itemsPerPage,
  onPageChange,
  onViewDetails,
  onEditAddress,
  onReturnOrder,
  onCancelOrder,
}: OrderListProps) {
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {paginatedOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewDetails={onViewDetails}
          onEditAddress={onEditAddress}
          onReturnOrder={onReturnOrder}
          onCancelOrder={onCancelOrder}
        />
      ))}

      {orders.length > itemsPerPage && (
        <div className="mt-8">
          <ProductPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={orders.length}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}