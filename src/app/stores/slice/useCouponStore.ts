// src/app/stores/slice/useCouponStore.ts
import { StateCreator } from 'zustand';
import { couponService } from '@/app/api/services/couponService';
import { Coupon, UserCoupon } from '@/app/type/coupon';

export interface CouponState {
  coupons: Coupon[];
  myVouchers: UserCoupon[];
  isLoading: boolean;
  error: string | null;

  fetchCoupons: () => Promise<void>;
  fetchMyVouchers: () => Promise<void>;
  verifyVoucher: (code: string) => Promise<boolean>;
  applyVoucher: (code: string,orderValue:number) => Promise<void>;
}

export const createCouponSlice: StateCreator<CouponState> = (set) => ({
  coupons: [],
  myVouchers: [],
  isLoading: false,
  error: null,

  fetchCoupons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await couponService.getAll();
      set({ coupons: response?.data || [], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch coupons';
      set({ error: message, isLoading: false });
    }
  },

  fetchMyVouchers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await couponService.getMyVouchers();
      set({ myVouchers: response?.data || [], isLoading: false });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch vouchers';
        set({ error: message, isLoading: false });
    }
},

verifyVoucher: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
        const response = await couponService.verifyVoucherByUserPoint(code);
        set({ isLoading: false });
        return response;
    } catch (error ) {
        const message = error.message ? error.message : 'Verification failed';
      set({ error: message, isLoading: false });
      return false;
    }
  }
,
applyVoucher: async (code: string,orderValue:number) => {
    set({ isLoading: true, error: null });
    try {
        const response = await couponService.validateAndApply(code,orderValue);
        set({ isLoading: false });
        return response;
    } catch (error ) {
        const message = error.message ? error.message : 'Verification failed';
      set({ error: message, isLoading: false });
      return false;
    }
  }
});
