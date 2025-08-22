'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { orderService } from '@/app/api/services/orderService';
import { OrderWithUser, IBank } from '@/app/type/order';
import toast from 'react-hot-toast';
import {
  OrderList,
  OrderDetailsModal,
  EditAddressModal,
  ReturnOrderModal
} from './components';

export function OrdersContent() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderWithUser | null>(null);
  const [returnOrder, setReturnOrder] = useState<OrderWithUser | null>(null);
  const [listBank, setListBank] = useState<IBank[]>([]);

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

  useEffect(() => {
    const fetchListBank = async () => {
      try {
        const res = await fetch("https://api.vietqr.io/v2/banks");
        const data = await res.json();
        setListBank(data.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách ngân hàng:", err);
        toast.error("Không tải được danh sách ngân hàng");
      }
    };
    fetchListBank();
  }, []);

  const handleUpdateAddress = async (orderId: number, newAddress: string) => {
    try {
      await orderService.updateOrderAddress(orderId, newAddress);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, shipping_address: newAddress } : o
        )
      );
      toast.success("Cập nhật địa chỉ thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật địa chỉ:", err);
      toast.error("Cập nhật thất bại, thử lại sau!");
      throw err;
    }
  };

  const handleSubmitReturn = (data: {
    orderId: number;
    reason: string;
    message: string;
    bank: IBank | null;
    accountNumber: string;
    video: string | null;
    images: string[];
  }) => {
    // Xử lý gửi yêu cầu hoàn đơn
    console.log('Yêu cầu hoàn đơn:', data);
    toast.success('Yêu cầu hoàn đơn đã được gửi!');
  };

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
        
        <OrderList
          orders={orders}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onViewDetails={setSelectedOrder}
          onEditAddress={setEditingOrder}
          onReturnOrder={setReturnOrder}
        />

        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />

        <EditAddressModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdateAddress={handleUpdateAddress}
        />

        <ReturnOrderModal
          order={returnOrder}
          onClose={() => setReturnOrder(null)}
          listBank={listBank}
          onSubmitReturn={handleSubmitReturn}
        />
      </div>
    </div>
  );
}