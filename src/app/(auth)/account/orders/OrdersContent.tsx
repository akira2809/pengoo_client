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
    username?: string;
    full_name?: string;
    email?: string;
    phone_number?: number;
    avatar_url?: string;
  };
  delivery?: {
    name?: string;
    description?: string;
    fee?: string | number;
    estimatedTime?: string;
  };
  details?: OrderItemDetail[];
  order_date?: string;
  order_code: string; 
  total_price: number;
  shipping_address?: string;
  payment_type?: string;
  productStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  [key: string]: unknown;
}

// --- Status Configuration ---
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
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);

  const [returnOrder, setReturnOrder] = useState<OrderWithUser | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnMessage, setReturnMessage] = useState('');
  const [returnVideo, setReturnVideo] = useState<File | null>(null);
  const [returnImages, setReturnImages] = useState<File[]>([]);

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
            .sort((a, b) => new Date(b.order_date as string).getTime() - new Date(a.order_date as string).getTime());
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
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
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

  // --- Hoàn đơn hàng ---
  const handleSubmitReturn = () => {
    if (!returnOrder) return;
    if (!returnReason) {
      alert('Vui lòng chọn lý do hoàn đơn');
      return;
    }

    // Demo gửi formdata
    const formData = new FormData();
    formData.append('orderId', String(returnOrder.id));
    formData.append('reason', returnReason);
    formData.append('message', returnMessage);
    if (returnVideo) {
      formData.append('video', returnVideo);
    }
    returnImages.forEach((file, idx) => {
      formData.append(`images[${idx}]`, file);
    });

    // TODO: Gọi API hoàn đơn ở đây
    console.log('FormData gửi đi:', { reason: returnReason, message: returnMessage, video: returnVideo, images: returnImages });

    alert('Yêu cầu hoàn đơn đã được gửi!');
    setReturnOrder(null);
    setReturnReason('');
    setReturnMessage('');
    setReturnVideo(null);
    setReturnImages([]);
  };

  // --- Render Functions ---
  const renderOrderItems = (order: OrderWithUser) => {
    if (!order.details || order.details.length === 0) {
      return <p className="py-4 text-center text-gray-500">Không có thông tin sản phẩm.</p>;
    }
    return order.details.map((item, index) => {
      type ProductInfo = {
        product_name?: string;
        images?: { url: string; name?: string }[];
      };

      const product: ProductInfo = (item as { product?: ProductInfo }).product || {};
      const productName = product.product_name || `Mã sản phẩm: ${item.productId}`;
      const productImages = product.images || [];
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-gray-600">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Bạn chưa có đơn hàng nào</h3>
        <p className="mt-1 text-sm text-gray-500">Hãy bắt đầu mua sắm ngay thôi!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">Đơn hàng của tôi</h1>
        <div className="space-y-6">
          {paginatedOrders.map((order) => {
            const status = STATUS_CONFIG[order.productStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default;
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
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

                <div className="p-4 sm:p-5 divide-y divide-gray-100">
                  {renderOrderItems(order)}
                </div>

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 gap-3 sm:gap-0">
                  <div className="font-semibold text-lg text-gray-900">
                    <span>Tổng tiền: </span>
                    <span>{formatPrice(order.total_price)}</span>
                  </div>
                  <div className="flex gap-3">
                    {order.productStatus === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
                      >
                        Hủy đơn
                      </button>
                    )}
                    {order.productStatus === 'delivered' && (
                      <button
                        onClick={() => setReturnOrder(order)}
                        className="px-4 py-2 text-sm font-medium text-yellow-600 bg-white border border-yellow-300 rounded-md hover:bg-yellow-500 hover:text-white transition-colors duration-200"
                      >
                        Hoàn đơn
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-900 transition-colors duration-200"
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

      {/* Modal Chi tiết đơn hàng */}
      {selectedOrder && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
            <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{selectedOrder.id}</h2>
            <p className="text-sm text-gray-500 mb-4">Ngày đặt: {formatOrderDate(selectedOrder.order_date)}</p>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Thông tin khách hàng</h3>
              <p>Họ tên: {selectedOrder.user?.full_name}</p>
              <p>Email: {selectedOrder.user?.email}</p>
              <p>SĐT: {selectedOrder.user?.phone_number}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Thông tin giao hàng</h3>
              <p>Địa chỉ: {selectedOrder.shipping_address}</p>
              <p>Đơn vị vận chuyển: {selectedOrder.delivery?.name}</p>
              <p>Phí ship: {formatPrice(selectedOrder.delivery?.fee)}</p>
              <p>Thời gian dự kiến: {selectedOrder.delivery?.estimatedTime}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Thanh toán</h3>
              <p>Phương thức: {selectedOrder.payment_type}</p>
              <p>Tổng tiền: {formatPrice(selectedOrder.total_price)}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Sản phẩm</h3>
              {renderOrderItems(selectedOrder)}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hoàn đơn hàng */}
{returnOrder && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setReturnOrder(null)}
  >
    <div
      className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold mb-4">Hoàn đơn #{returnOrder.id}</h2>

      {/* Lý do */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Lý do hoàn hàng</label>
        <select className="w-full border rounded px-3 py-2">
          <option value="">-- Chọn lý do --</option>
          <option value="defective">Sản phẩm bị lỗi</option>
          <option value="missing">Thiếu sản phẩm</option>
          <option value="wrong">Giao sai sản phẩm</option>
        </select>
      </div>

      {/* Upload video */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Upload Video</label>
        <input type="file" accept="video/*" className="w-full" />
      </div>

      {/* Upload hình ảnh */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Upload Hình ảnh (tối đa 5)</label>
        <input type="file" accept="image/*" multiple className="w-full" />
        <p className="text-sm text-gray-500 mt-1">Bạn có thể chọn tối đa 5 hình</p>
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Ghi chú</label>
        <textarea
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Nhập ghi chú của bạn..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setReturnOrder(null)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Đóng
        </button>
        <button
          onClick={() => {
            // TODO: gọi API gửi yêu cầu hoàn đơn ở đây
            alert('Yêu cầu hoàn đơn đã được gửi!');
            setReturnOrder(null);
          }}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Gửi yêu cầu
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}