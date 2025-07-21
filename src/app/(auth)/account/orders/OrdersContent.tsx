'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { orderService } from '@/app/api/services/orderService';
import { ProductPagination } from '@/app/(public)/products/component/layouts/product/ProductPagination';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';


import { CreateOrderResponse, OrderItemDetail } from '@/app/type/order';

// Define a type for order details
export interface OrderDetail {
  product?: {
    product_name?: string;
    images?: Array<{ url: string }>;
  };
  quantity: number;
  price: number;
}

// Extended order type with user information
export interface OrderWithUser extends Omit<CreateOrderResponse, 'details'> {
  user?: {
    id: number | string;
  };
  details?: OrderItemDetail[];
  order_date?: string;
  total_price: number;
  productStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  // Additional properties that might come from the API
  [key: string]: unknown;
}

export function OrdersContent() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      const response = await orderService.getAllOrders();
      if (response?.data) {
        // The API returns CreateOrderRequest[] but we need to cast it to our extended type
        const orders = response.data as unknown as OrderWithUser[];
        // Filter orders for the current user
        const userOrders = orders.filter(order => order.user?.id === user.id);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format order date
  const formatOrderDate = (dateString: unknown) => {
    if (typeof dateString !== 'string') return 'Ngày không hợp lệ';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString as string;
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString as string;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy đơn';
      default: return 'Không rõ';
    }
  };

  // Get status style
  const getStatusStyle = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: number | string) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) return;
    
    try {
      const numericOrderId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
      if (isNaN(numericOrderId)) {
        throw new Error('ID đơn hàng không hợp lệ');
      }
      await orderService.cancelOrder(numericOrderId);
      // Refresh orders after cancellation
      fetchOrders();
    } catch (error) {
      console.error('Lỗi khi huỷ đơn hàng:', error);
      alert('Có lỗi xảy ra khi huỷ đơn hàng. Vui lòng thử lại sau.');
    }
  };

  // Format total price to VND
  const formatPrice = (price: unknown) => {
    const numericPrice = typeof price === 'number' ? price : Number(price);
    if (isNaN(numericPrice)) return '0 ₫';
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numericPrice);
  };

  // Render order items
  const renderOrderItems = (order: OrderWithUser) => {
    if (!order.details || order.details.length === 0) {
      return <p className="text-muted-foreground">Không có sản phẩm nào</p>;
    }

    return order.details.map((item, index) => {
      const productId = item.productId?.toString() || `item-${index}`;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      const price = typeof item.price === 'number' ? item.price : 0;
      
      return (
        <div key={`${productId}-${index}`} className="flex items-center space-x-4 py-2">
          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-500">Ảnh</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Mã sản phẩm: {productId}</h4>
            <p className="text-sm text-muted-foreground">Số lượng: {quantity}</p>
            <p className="text-sm font-medium">{formatPrice(price)}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {isLoading ? (
        <p className="text-center text-gray-500 py-8">Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <div key={order.order_code} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">Mã đơn hàng: {order.order_code}</h3>
                    <p className="text-sm text-gray-500">
                      Ngày đặt: {formatOrderDate(order.order_date)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(order.productStatus)}`}>
                    {getStatusText(order.productStatus)}
                  </span>
                </div>

                {order.details && order.details.length > 0 && (
                  <div className="space-y-4">
                    {renderOrderItems(order)}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="font-medium">
                    Tổng tiền: {formatPrice(order.total_price)}
                  </div>

                  <div className="flex gap-2">
                    {order.productStatus === 'pending' && (
                      <button
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ProductPagination
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={orders.length}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
