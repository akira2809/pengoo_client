"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const PaypalSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paypalOrderId = searchParams ? searchParams.get("token") : null;
  const orderId =
    searchParams?.get("orderId") ||
    searchParams?.get("order_id") ||
    null;
  const [status, setStatus] = useState("Đang xác nhận thanh toán PayPal...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const capturePaypalOrder = async () => {
      if (!paypalOrderId || !orderId) return;
      try {
        setStatus("Đang xác nhận thanh toán PayPal...");
        setLoading(true);
        // Use the token-based endpoint, which is idempotent and does not require user info
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/paypal/capture-order/${paypalOrderId}`,
          { method: "POST" }
        );
        if (res.ok) {
          setStatus(
            "Thanh toán thành công! Đang gửi hóa đơn đến email của bạn..."
          );
          toast.success("Thanh toán PayPal thành công!");
          setTimeout(() => {
            router.push(`/order/success?order_id=${orderId}`);
          }, 2500);
        } else {
          setStatus("Thanh toán PayPal thất bại.");
          toast.error("Thanh toán PayPal thất bại.");
          setTimeout(() => {
            router.push(`/order/cancel?order_id=${orderId}`);
          }, 2500);
        }
      } catch {
        setStatus("Có lỗi xảy ra khi xác nhận thanh toán.");
        toast.error("Thanh toán PayPal thất bại.");
        setTimeout(() => {
          router.push(`/order/cancel?order_id=${orderId}`);
        }, 2500);
      } finally {
        setLoading(false);
      }
    };
    capturePaypalOrder();
  }, [paypalOrderId, orderId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {loading && (
        <svg
          className="animate-spin h-8 w-8 text-blue-500 mb-4"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      <div className="text-lg font-semibold">{status}</div>
      <div className="mt-2 text-gray-500 text-sm">
        Vui lòng kiểm tra email để nhận hóa đơn sau khi thanh toán thành công.
      </div>
    </div>
  );
};

export default PaypalSuccessPage;