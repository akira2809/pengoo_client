'use client';

import { useEffect, useState, ComponentPropsWithoutRef } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useStore } from '@/app/stores/store'; // Assuming this is a Zustand store
import { ProductPagination } from "@/app/(public)/products/component/layouts/product/ProductPagination";

// --- Type Definitions (assuming from store) ---
type Coupon = {
    id: number;
    code: string;
    description?: string;
    discountPercent: number;
    milestonePoints: number;
};

type UserCoupon = {
    id: number;
    redeemed: boolean;
    coupon: Coupon;
};

// --- Helper Icons ---
const TicketIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
);
const StarIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const NoCouponIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15.5 22v-3.5a2.5 2.5 0 0 0-5 0V22"/><path d="M18 8a6 6 0 0 0-12 0"/><path d="M12 2v2"/><path d="M12 18.5V14"/><path d="M4 11V7.5a2.5 2.5 0 0 1 5 0V11"/><path d="M15 11V7.5a2.5 2.5 0 0 1 5 0V11"/></svg>
);


export default function CouponsPage() {
    const { user } = useAuthStore();
    const { myVouchers, fetchMyVouchers, verifyVoucher, isLoading, error } = useStore();
    const [inputCode, setInputCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        if (user?.id) fetchMyVouchers();
    }, [user?.id, fetchMyVouchers]);

    const handleVerifyCoupon = async () => {
        if (!inputCode.trim()) return;
        setIsVerifying(true);
        const success = await verifyVoucher(inputCode.trim());
        if (success) {
            setInputCode('');
            // The store should ideally handle re-fetching, but we can call it again just in case.
            fetchMyVouchers(); 
        }
        setIsVerifying(false);
    };

    const paginatedVouchers = myVouchers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Kho Voucher</h1>

                {/* --- Input and Points Section --- */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                            <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-2">Thêm mã khuyến mãi</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <TicketIcon className="text-gray-400"/>
                                </span>
                                <input
                                    type="text"
                                    id="coupon-code"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                    placeholder="Nhập mã tại đây"
                                    className="w-full pl-10 pr-28 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                                <button
                                    onClick={handleVerifyCoupon}
                                    disabled={isVerifying || !inputCode}
                                    className="absolute inset-y-0 right-0 flex items-center justify-center w-24 m-1 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {isVerifying ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : 'Lưu'}
                                </button>
                            </div>
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>
                        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg flex items-center gap-4">
                            <StarIcon className="text-yellow-500 w-8 h-8 shrink-0"/>
                            <div>
                                <p className="text-sm text-gray-600">Điểm của bạn</p>
                                <p className="text-2xl font-bold text-gray-900">{user?.points ?? 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Coupon List --- */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Voucher của bạn</h2>
                    {isLoading ? (
                         <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                        </div>
                    ) : myVouchers.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <NoCouponIcon className="mx-auto text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Bạn chưa có voucher nào</h3>
                            <p className="mt-1 text-sm text-gray-500">Hãy tìm và lưu voucher để sử dụng nhé!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginatedVouchers.map((uc: UserCoupon) => (
                                <div key={uc.id} className="flex rounded-lg shadow-sm bg-white overflow-hidden">
                                    {/* Left part of the ticket */}
                                    <div className="w-1/3 bg-indigo-600 text-white flex flex-col justify-center items-center p-4 text-center">
                                        <p className="text-2xl sm:text-3xl font-bold">{uc.coupon.discountPercent}%</p>
                                        <p className="text-sm font-medium">GIẢM</p>
                                    </div>
                                    {/* Dashed line separator */}
                                    <div className="relative">
                                        <div className="absolute top-0 bottom-0 w-px bg-white"></div>
                                        <div className="h-full border-l-2 border-dashed border-gray-300"></div>
                                    </div>
                                    {/* Right part of the ticket */}
                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800 uppercase tracking-wider">{uc.coupon.code}</p>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{uc.coupon.description || 'Áp dụng cho tất cả sản phẩm.'}</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-xs text-gray-500">Cần: {uc.coupon.milestonePoints} điểm</p>
                                            {uc.redeemed ? (
                                                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">Đã sử dụng</span>
                                            ) : (
                                                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded-full">Chưa sử dụng</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {myVouchers.length > ITEMS_PER_PAGE && (
                        <div className="mt-8">
                            <ProductPagination
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={myVouchers.length}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
