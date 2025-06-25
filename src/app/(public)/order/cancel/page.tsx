'use client';
import { XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function OrderCancelPage() {
  const searchParams = useSearchParams();
  // Get all relevant parameters from the URL
  const orderCode = searchParams.get('orderCode') || searchParams.get('code');
  const transactionId = searchParams.get('id');
  const status = searchParams.get('status');
  const isCancelled = searchParams.get('cancel') === 'true';
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');

  useEffect(() => {
    const handleOrderCancellation = async () => {
      if (!orderCode) {
        setIsLoading(false);
        setError('Mã đơn hàng không hợp lệ');
        return;
      }

      try {
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
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'order_cancelled', {
            transaction_id: orderCode,
            transaction_status: status || 'cancelled',
            transaction_cancelled: isCancelled,
            payment_gateway: 'payos', // Assuming PayOS based on the URL
            // Add other relevant e-commerce tracking data here
          });
        }

        // Optional: You can call an API to update the order status if needed
        // const response = await fetch(`/api/orders/${orderCode}/cancel`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     status: 'cancelled',
        //     reason,
        //     gatewayTransactionId: transactionId
        //   })
        // });
        // if (!response.ok) {
        //   throw new Error('Không thể cập nhật trạng thái đơn hàng');
        // }
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
            <div className="mt-6 space-y-4">
              {orderCode && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <span className="font-medium">Mã đơn hàng:</span>{' '}
                    <span className="font-semibold text-gray-900">#{orderCode}</span>
                  </p>
                  {transactionId && (
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">Mã giao dịch:</span>{' '}
                      <span className="font-mono text-sm">{transactionId}</span>
                    </p>
                  )}
                </div>
              )}
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {cancellationReason || 'Đơn hàng đã bị hủy'}. 
                      {status === 'CANCELLED' 
                        ? 'Bạn có thể thử thanh toán lại hoặc liên hệ hỗ trợ nếu cần giúp đỡ.'
                        : 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mt-4">
                Nếu bạn nghĩ đây là sự nhầm lẫn hoặc cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng của chúng tôi.
              </p>
            </div>
          )}
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/cart"
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Xem giỏ hàng
            </Link>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900">Bạn cần hỗ trợ?</h2>
            <p className="mt-2 text-gray-600">
              Nếu bạn cần hỗ trợ hoặc muốn đặt lại đơn hàng, vui lòng liên hệ với chúng tôi qua email{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
                support@example.com
              </a>
              {' '}hoặc số điện thoại{' '}
              <a href="tel:+84912345678" className="text-blue-600 hover:text-blue-500">
                0912 345 678
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
