'use client';
import { orderService } from '@/app/api/services/orderService';
import { XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    gtag?: (event: string, eventName: string, params: Record<string, unknown>) => void;
  }
}
export default function OrderCancelContent() {
  const searchParams = useSearchParams();
  // Get all relevant parameters from the URL
  const orderCode = searchParams.get('orderCode');
  const code = searchParams.get('code');
  const transactionId = searchParams.get('id');
  const status = searchParams.get('status');
  const isCancelled = searchParams.get('cancel') === 'true';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');

  useEffect(() => {
    const handleOrderCancellation = async () => {
      // if (!orderCode) {
      //   setIsLoading(false);
      //   setError('Mã đơn hàng không hợp lệ');
      //   return;
      // }

      try {
        const res = await orderService.cancelPayment(Number(orderCode));
        // if (!res.success) {
        //   throw new Error('Không thể cập nhật trạng thái đơn hàng');
        // }

        // Determine cancellation reason based on status
        let reason = 'Đơn hàng đã bị hủy';
        if (status === 'CANCELLED') {
          reason = 'Đơn hàng đã bị hủy';
        } else if (isCancelled) {
          reason = 'Bạn đã hủy thanh toán';
        } else {
          reason = 'Thanh toán không thành công';
        }
        setCancellationReason(reason);

        // Track order cancellation in analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'order_cancelled', {
            transaction_id: code,
            transaction_status: status || 'cancelled',
            transaction_cancelled: isCancelled,
            payment_gateway: 'payos',
          });
        }
      } catch (err) {
        console.error('Error handling order cancellation:', err);
        toast.error('Có lỗi xảy ra khi xử lý đơn hàng');
        setError('Có lỗi xảy ra khi xử lý đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    handleOrderCancellation();
  }, [orderCode, status, isCancelled, transactionId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {isLoading ? 'Đang xử lý...' : cancellationReason || 'Đơn hàng đã bị hủy'}
          </h1>

          {isLoading ? (
            <div className="mt-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
            </div>
          ) : error ? (
            <div className="mt-4 text-red-600">{error}</div>
          ) : (
            <div className="mt-4">
              <p className="text-gray-600">
                Mã đơn hàng: <span className="font-medium">{orderCode}</span>
              </p>
              {transactionId && (
                <p className="text-gray-600 mt-2">
                  Mã giao dịch: <span className="font-medium">{transactionId}</span>
                </p>
              )}
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Quay lại trang chủ
            </Link>
            {orderCode && (
              <Link
                href={`/account/orders/${orderCode}`}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Xem chi tiết đơn hàng
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
