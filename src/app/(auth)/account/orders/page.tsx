'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { orderService } from '@/app/api/services/orderService';
import { CreateOrderResponse } from '@/app/type/order';
import { ProductPagination } from "@/app/(public)/products/component/layouts/product/ProductPagination";

// Define a type for order details
interface OrderDetail {
  product?: {
    product_name?: string;
    images?: Array<{ url: string }>;
  };
  quantity: number;
  price: number;
}

// Extended order type with user information
interface OrderWithUser extends CreateOrderResponse {
  user?: {
    id: number | string;
  };
  details?: OrderDetail[];
  id: number;
}

export default function OrdersPage() {
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
        const userOrders = response.data
          .filter((order) => order.user?.id === user.id)
          .map(order => order as unknown as OrderWithUser);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Using useEffect with fetchOrders dependency requires useCallback
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-200 text-gray-500';
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const confirmCancel = confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
    if (!confirmCancel) return;

    try {
      await orderService.cancelOrder(orderId);
      alert('Đã hủy đơn hàng thành công');
      fetchOrders();
    } catch {
      alert('Không thể hủy đơn hàng');
    }
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
                      Ngày đặt: {order.order_date ? new Date(order.order_date).toLocaleDateString('vi-VN') : 'Không rõ'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(order.productStatus)}`}>
                    {getStatusText(order.productStatus)}
                  </span>
                </div>

                {order.details?.length > 0 && (
                  <div className="space-y-4">
                    {order.details.map((item: OrderDetail, index: number) => {
                      const product = item.product || {};
                      const imageUrl = product.images?.[0]?.url || '/placeholder-product.jpg';

                      return (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={imageUrl}
                              alt={product.product_name || 'Sản phẩm'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{product.product_name}</h4>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                            <p className="text-sm">
                              {item.price.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="font-medium">
                    Tổng tiền:{' '}
                    {order.total_price.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </div>

                  <div className="flex gap-2">
                    {/* <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                      Xem chi tiết
                    </button> */}
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
