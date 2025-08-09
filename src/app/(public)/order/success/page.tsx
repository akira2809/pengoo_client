'use client';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { orderService } from '@/app/api/services/orderService';

function OrderSuccessContentInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderCode');
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Track successful order conversion
    if (orderId && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        // Add other relevant e-commerce tracking data here
      });
    }
    if (orderId) {
      setInvoiceUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/${orderId}`);
    }
  }, [orderId]);

  const handleResendInvoice = async () => {
    if (!orderId) return;
    setResending(true);
    setResendStatus(null);
    const result = await orderService.resendInvoice(orderId);
    if (result.success) {
      setResendStatus("Hóa đơn đã được gửi lại email của bạn.");
    } else {
      setResendStatus(result.error || "Không thể gửi lại hóa đơn.");
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Đặt hàng thành công!</h1>
          <p className="mt-2 text-gray-600">
            Cảm ơn bạn đã đặt hàng
          </p>
          <p className="mt-2 text-gray-600">
            Chúng tôi đã gửi email xác nhận đơn hàng và hóa đơn đến địa chỉ email của bạn.
          </p>
          {invoiceUrl && (
            <div className="mt-4">
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Tải hóa đơn PDF
              </a>
              <div className="mt-2 text-gray-500 text-sm">
                Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc tải hóa đơn trực tiếp tại đây.
              </div>
              <button
                onClick={handleResendInvoice}
                disabled={resending}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                {resending ? "Đang gửi lại..." : "Gửi lại hóa đơn qua email"}
              </button>
              {resendStatus && (
                <div className="mt-1 text-sm text-green-600">{resendStatus}</div>
              )}
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

function OrderSuccessContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Đang tải thông tin đơn hàng...</div>
      </div>
    }>
      <OrderSuccessContentInner />
    </Suspense>
  );
}

export default function OrderSuccessPage() {
  return <OrderSuccessContent />;
}