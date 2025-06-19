'use client';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Track successful order conversion
    if (orderId && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        // Add other relevant e-commerce tracking data here
      });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Đặt hàng thành công!</h1>
          <p className="mt-2 text-gray-600">
            Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là: 
            <span className="font-medium text-gray-900">#{orderId || 'N/A'}</span>
          </p>
          <p className="mt-2 text-gray-600">
            Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/account/orders"
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Xem đơn hàng
            </Link>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900">Bạn cần hỗ trợ?</h2>
            <p className="mt-2 text-gray-600">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email{' '}
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
