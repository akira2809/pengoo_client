'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useStore } from '@/app/stores/store';
import { ProductPagination } from "@/app/(public)/products/component/layouts/product/ProductPagination";
import { showSuccessToast, showErrorToast } from '@/components/common/UI/toastHelper';

export default function CouponsPage() {
  const { user } = useAuthStore();

  const myVouchers = useStore((state) => state.myVouchers);
  const fetchMyVouchers = useStore((state) => state.fetchMyVouchers);
  const verifyVoucher = useStore((state) => state.verifyVoucher);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);

  const [inputCode, setInputCode] = useState('');
  const [checking, setChecking] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) fetchMyVouchers();
  }, [user, fetchMyVouchers]);

  const handleCheckCoupon = async () => {
    if (!inputCode.trim()) return;
    setChecking(true);
    const isValid = await verifyVoucher(inputCode.trim());
    setChecking(false);
    if (isValid) {
      showSuccessToast('Áp dụng mã khuyến mãi thành công!');
      setInputCode('');
      fetchMyVouchers();
    } else {
      showErrorToast('Mã khuyến mãi không hợp lệ hoặc đã hết hạn.');
    }
  };

  const paginatedVouchers = myVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Mã khuyến mãi</h1>

      <div className="mb-6">
        <p className="mb-2 text-sm text-gray-600">
          Điểm của bạn: <strong>{user?.points ?? 0}</strong>
        </p>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Nhập mã khuyến mãi"
            className="w-full px-4 py-2 pr-28 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleCheckCoupon}
            disabled={checking}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 px-4 py-1.5 bg-background-900 text-white text-sm rounded-md hover:bg-background-800 disabled:opacity-50"
          >
            {checking ? 'Đang kiểm tra...' : 'Kiểm tra'}
          </button>
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Mã bạn đang có:</h2>
        {isLoading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : myVouchers.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có mã nào.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {paginatedVouchers.map((uc) => (
                <li key={uc.id} className="border rounded-md p-4 bg-gray-50">
                  <p className="font-medium">{uc.coupon.code}</p>
                  <p className="text-gray-600">
                    {uc.coupon.description || 'Không có mô tả'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Giảm {uc.coupon.discountPercent}% • Cần {uc.coupon.milestonePoints} điểm • Đã đổi: {uc.redeemed ? '✔️' : '❌'}
                  </p>
                </li>
              ))}
            </ul>

            <ProductPagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={myVouchers.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
