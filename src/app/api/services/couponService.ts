import { apiClient } from '../apiClient';
import { API_CONFIG } from '../apiConfig';
import { Coupon, UserCoupon } from '@/app/type/coupon';

interface ValidateCouponPayload {
  code: string;
  orderValue: number;
  userId: number;
  productIds: number[];
}

interface ValidateCouponResponse {
  valid: boolean;
  discount: number;
  message?: string;
}

interface RedeemCouponResponse {
  message: string;
  coupon: string;
}

interface NextMilestoneCouponResponse {
  coupon: {
    code: string;
    discount: number;
  } | null;
}

interface VerifyVoucherResponse {
  valid: boolean;
  message?: string;
  vouchers: UserCoupon[];
}

export const couponService = {
  // Get all coupons
  async getAll() {
    return apiClient.get<Coupon[]>(API_CONFIG.ENDPOINTS.COUPONS.BASE);
  },

  // Create a coupon
  async createCoupon(data: Partial<Coupon> & { productIds?: number[]; userIds?: number[] }) {
    return apiClient.post<Coupon>(API_CONFIG.ENDPOINTS.COUPONS.BASE, data);
  },

  // Validate a coupon for a specific user and order
  async validateCoupon(data: ValidateCouponPayload) {
    const payload: Record<string, unknown> = {
      code: data.code,
      orderValue: data.orderValue,
      userId: data.userId,
      productIds: data.productIds
    };
    
    return apiClient.post<ValidateCouponResponse>(
      `${API_CONFIG.ENDPOINTS.COUPONS.BASE}/validate`,
      payload
    );
  },

  // Redeem coupon via token
  async redeemCoupon(token: string) {
    return apiClient.get<RedeemCouponResponse>(
  `${API_CONFIG.ENDPOINTS.COUPONS.BASE}/redeem?token=${token}`
  );
},

  // Update coupon
  async updateCoupon(id: number, data: Partial<Coupon>) {
    return apiClient.patch<Coupon>(`${API_CONFIG.ENDPOINTS.COUPONS.BASE}/${id}`, data);
  },

  // Delete coupon
  async deleteCoupon(id: number) {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.COUPONS.BASE}/${id}`);
  },

  // Update coupon status
  async updateStatus(id: number, status: string) {
    return apiClient.patch(`${API_CONFIG.ENDPOINTS.COUPONS.BASE}/${id}/${status}/status`);
  },

  // Get milestone coupons
  async getMilestoneCoupons() {
    return apiClient.get<{ coupons: Coupon[] }>(
      `${API_CONFIG.ENDPOINTS.COUPONS.BASE}/milestone-coupons`
    );
  },

  // Get next milestone coupon based on user points
  async getNextMilestoneCoupon(userPoints: number) {
    return apiClient.get<NextMilestoneCouponResponse>(
      `${API_CONFIG.ENDPOINTS.COUPONS.BASE}/next-milestone-coupon`,
      { userPoints }
    );
  },

  // Get all vouchers owned by the logged-in user
  async getMyVouchers() {
    return apiClient.post<{ vouchers: UserCoupon[] }>(
      `${API_CONFIG.ENDPOINTS.COUPONS.BASE}/get-voucher-by-userId`
    );
  },

  // Verify voucher by user points
  async verifyVoucherByUserPoint(code: string): Promise<VerifyVoucherResponse> {
    const res = await apiClient.post<VerifyVoucherResponse>(
      API_CONFIG.ENDPOINTS.COUPONS.VERIFY_VOUCHER,
      { voucherCode: code } as Record<string, unknown>
    );
    if (!res.data) {
      throw new Error('Failed to verify voucher');
    }
    return res.data;
  },

  async validateAndApply(code: string, orderValue: number) {
    const res = await apiClient.post(
      API_CONFIG.ENDPOINTS.COUPONS.APPLYVOUCHER,
      {  code,orderValue }
    );
    return res.data;
  },

  // Get vouchers by user ID (for admin or current user)
  async getVoucherByUserId() {
    return apiClient.post<{ vouchers: UserCoupon[] }>(
      `${API_CONFIG.ENDPOINTS.COUPONS.BASE}/get-voucher-by-userId`
    );
  }
};
