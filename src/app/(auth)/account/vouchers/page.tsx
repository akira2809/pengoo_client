"use client";
import { useEffect, useState } from "react";

interface Coupon {
  id: number;
  code: string;
  discountPercent: number;
  minOrderValue: number;
  maxOrderValue: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface UserCoupon {
  id: number;
  redeemed: boolean;
  redeemedAt: string | null;
  redeemToken: string | null;
  coupon: Coupon;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/coupons/my-vouchers", {
          credentials: "include", // if using cookies for auth
          headers: {
            // If you use JWT in header:
            // 'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setVouchers(data.vouchers || []);
      } catch (err) {
        setError("Không thể tải voucher.");
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleRedeem = async (token: string | null) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/coupons/redeem?token=${token}`);
      const data = await res.json();
      alert(data.message || "Đã đổi voucher!");
      // Optionally refresh the list
      window.location.reload();
    } catch {
      alert("Đổi voucher thất bại.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Voucher của tôi</h2>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : vouchers.length === 0 ? (
        <div>Bạn chưa có voucher nào.</div>
      ) : (
        <div className="space-y-4">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between bg-yellow-50 shadow"
            >
              <div>
                <div className="font-semibold text-lg text-yellow-700">
                  {v.coupon.code}
                </div>
                <div>
                  Giảm {v.coupon.discountPercent}% cho đơn từ {v.coupon.minOrderValue} đến {v.coupon.maxOrderValue}₫
                </div>
                <div>
                  HSD: {new Date(v.coupon.endDate).toLocaleDateString()}
                </div>
                <div>
                  Trạng thái:{" "}
                  {v.redeemed ? (
                    <span className="text-green-600">Đã đổi</span>
                  ) : (
                    <span className="text-yellow-700">Chưa đổi</span>
                  )}
                </div>
              </div>
              <div className="mt-3 md:mt-0">
                {!v.redeemed && v.redeemToken && (
                  <button
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded font-bold shadow"
                    onClick={() => handleRedeem(v.redeemToken)}
                  >
                    Đổi voucher
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}