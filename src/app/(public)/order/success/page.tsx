'use client';
import { orderService } from '@/app/api/services/orderService';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
type Order = {
  id: number;
  payment_type: string;
  payment_status: string;
  [key: string]: unknown;
};
import { useEffect, Suspense, useState } from 'react';
function OrderSuccessContentInner() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [orderId, setOrderId] = useState(0);

  const orderCode = searchParams?.get('orderCode');
  const order_id = searchParams?.get('order_id');

  useEffect(() => {
    // Prefer orderCode (PayOS), fallback to order_id (COD)
    if (orderCode) {
      orderService.successPayment(Number(orderCode)).then((res) => {
        const data = res?.data as Partial<Order> | undefined;
        if (data && !Array.isArray(data) && typeof data.id === 'number') {
          setOrder(data as Order);
          setOrderId(data.id as number);
          setInvoiceUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/${data.id}`);
        } else {
          setOrder(null);
        }
      });
    } else if (order_id) {
      orderService.getOrderById(Number(order_id)).then((res) => {
        const data = res?.data as Partial<Order> | undefined;
        if (data && !Array.isArray(data) && typeof data.id === 'number') {
          setOrder(data as Order);
          setOrderId(data.id as number);
          setInvoiceUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/${data.id}`);
        } else {
          setOrder(null);
        }
      });
    }
    // Track successful order conversion
    if (orderId && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
      });
    }
  }, [orderId, orderCode, order_id]);

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

  const handleDownloadInvoice = async () => {
    if (!orderId) return;
    setDownloading(true);
    try {
      const blob = await orderService.downloadInvoice(orderId);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Có lỗi xảy ra khi tải hóa đơn.");
      }
    } finally {
      setDownloading(false);
    }
  };

  if (!order) return <div>Đang tải...</div>;

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
              {/* Only show download/resend if allowed */}
              {(order.payment_type !== 'cod' || order.payment_status === 'paid') && (
                <>
                  <a
                    href={invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Tải hóa đơn PDF
                  </a>
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={downloading}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    {downloading ? "Đang tải..." : "Tải hóa đơn"}
                  </button>
                  <button
                    onClick={handleResendInvoice}
                    disabled={resending}
                    className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    {resending ? "Đang gửi lại..." : "Gửi lại hóa đơn qua email"}
                  </button>
                  <div className="mt-2 text-gray-500 text-sm">
                    Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc tải hóa đơn trực tiếp tại đây.
                  </div>
                  {resendStatus && (
                    <div className="mt-1 text-sm text-green-600">{resendStatus}</div>
                  )}
                </>
              )}
              {/* Show warning for COD not paid */}
              {order.payment_type === 'cod' && order.payment_status !== 'paid' && (
                <div className="mt-2 text-warning">
                  Hóa đơn sẽ được gửi và có thể tải sau khi thanh toán COD được xác nhận.
                </div>
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