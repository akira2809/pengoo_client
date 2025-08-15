'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { orderService } from '@/app/api/services/orderService';
import { ProductPagination } from '@/app/(public)/products/component/layouts/product/ProductPagination';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';

import { CreateOrderResponse, OrderItemDetail } from '@/app/type/order';

// --- Type Definitions ---
export interface OrderWithUser extends Omit<CreateOrderResponse, 'details'> {
  user?: {
    id: number | string;
  };
  details?: OrderItemDetail[];
  order_date?: string;
  order_code: string; // Fix: remove optional, must be string
  total_price: number;
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  [key: string]: unknown;
}

// --- Status Configuration ---
// Gộp text và style vào một chỗ để dễ quản lý
const STATUS_CONFIG = {
  pending: { text: 'Chờ xác nhận', style: 'bg-yellow-100 text-yellow-800' },
  processing: { text: 'Đang xử lý', style: 'bg-blue-100 text-blue-800' },
  shipped: { text: 'Đang giao hàng', style: 'bg-purple-100 text-purple-800' },
  delivered: { text: 'Đã giao', style: 'bg-green-100 text-green-800' },
  cancelled: { text: 'Đã hủy', style: 'bg-red-100 text-red-800' },
  default: { text: 'Không rõ', style: 'bg-gray-100 text-gray-800' },
};

export function OrdersContent() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const response = await orderService.getAllOrders();
        if (response?.data) {
          const allOrders = response.data as unknown as OrderWithUser[];
          const userOrders = allOrders
            .filter(order => order.user?.id === user.id)
            .sort((a, b) => new Date(b.order_date as string).getTime() - new Date(a.order_date as string).getTime()); // Sắp xếp đơn hàng mới nhất lên đầu
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user?.id]);

  // --- Helper Functions ---
  const formatPrice = (price: unknown) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericPrice);
  };

  const formatOrderDate = (dateString: unknown) => {
    if (typeof dateString !== 'string') return 'Ngày không hợp lệ';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi }); // Thêm giờ phút cho chi tiết
    } catch {
      return dateString;
    }
  };

  const handleCancelOrder = async (orderId: number | string) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) return;
    try {
      const numericOrderId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
      if (isNaN(numericOrderId)) throw new Error('ID đơn hàng không hợp lệ');
      
      await orderService.cancelOrder(numericOrderId);
      // Cập nhật lại trạng thái đơn hàng ngay trên UI để phản hồi nhanh hơn
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, productStatus: 'cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Lỗi khi huỷ đơn hàng:', error);
      alert('Có lỗi xảy ra khi huỷ đơn hàng. Vui lòng thử lại sau.');
    }
  };
  
  // --- Render Functions ---
  const renderOrderItems = (order: OrderWithUser) => {
    if (!order.details || order.details.length === 0) {
      return <p className="py-4 text-center text-gray-500">Không có thông tin sản phẩm.</p>;
    }
    return order.details.map((item, index) => {
      // Fix: item.productId is a number, not a product object
      // You need to get product info from item (if available) or fallback to placeholder
      // If your backend includes product info in item.product, use that; otherwise, fallback

      type ProductInfo = {
        product_name?: string;
        images?: { url: string; name?: string }[];
      };

      const product: ProductInfo = (item as { product?: ProductInfo }).product || {};
      const productName = product.product_name || `Mã sản phẩm: ${item.productId}`;
      const productImages = product.images || [];
      // Find main image if available
      let imageUrl = "https://via.placeholder.com/150";
      if (Array.isArray(productImages) && productImages.length > 0) {
        const mainImgObj = productImages.find(
          (img) => img.name && img.name.trim().toLowerCase() === "main"
        );
        imageUrl = mainImgObj?.url || productImages[0].url || imageUrl;
      }
      return (
        <div key={`${item.productId}-${index}`} className="flex items-center space-x-4 py-3">
          <Image
            src={imageUrl}
            alt={productName}
            width={80}
            height={80}
            className="h-20 w-20 rounded-md object-cover bg-gray-100"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">
              {productName}
            </h4>
            <p className="text-sm text-gray-500">Số lượng: {item.quantity ?? 0}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-800">{formatPrice(item.price)}</p>
          </div>
        </div>
      );
    });
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        {/* Cải tiến: Trạng thái loading với spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-gray-600">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        {/* Cải tiến: Trạng thái trống với icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Bạn chưa có đơn hàng nào</h3>
        <p className="mt-1 text-sm text-gray-500">Hãy bắt đầu mua sắm ngay thôi!</p>
      </div>
    );
  }
  
  return (
    // Cải tiến: Nền xám nhẹ để làm nổi bật các card
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">Đơn hàng của tôi</h1>
        <div className="space-y-6">
          {paginatedOrders.map((order) => {
            const status = STATUS_CONFIG[order.productStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default;
            return (
              // Cải tiến: Sử dụng card với shadow và divide-y
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
                {/* --- Order Header --- */}
                <div className="p-4 sm:p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Mã đơn hàng: #{order.id}</h3>
                    {order.order_code && (
                      <p className="text-sm text-gray-600">Order Code: {order.order_code}</p>
                    )}
                    <p className="text-sm text-gray-500">Ngày đặt: {formatOrderDate(order.order_date)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.style}`}>
                    {status.text}
                  </span>
                </div>

                {/* --- Order Body (Items) --- */}
                <div className="p-4 sm:p-5 divide-y divide-gray-100">
                  {renderOrderItems(order)}
                </div>

                {/* --- Order Footer --- */}
                <div className="p-4 sm:p-5 flex justify-between items-center bg-gray-50">
                  <div className="font-semibold text-lg text-gray-900">
                    <span>Tổng tiền: </span>
                    <span>{formatPrice(order.total_price)}</span>
                  </div>
                  <div className="flex gap-3">
                    {order.productStatus === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        // Cải tiến: Nút hủy với hiệu ứng đẹp hơn
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Hủy đơn
                      </button>
                    )}
                     <button
                        // Cải tiến: Nút xem chi tiết
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                      >
                        Xem chi tiết
                      </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length > ITEMS_PER_PAGE && (
          // Cải tiến: Thêm khoảng cách cho phân trang
          <div className="mt-8">
            <ProductPagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={orders.length}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}