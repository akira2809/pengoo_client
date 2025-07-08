export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discountPercent: number;
  status: 'active' | 'inactive' | 'expired' | string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  milestonePoints?: number;
  createdAt?: string;
  updatedAt?: string;
  productIds?: number[]; // Optional if included in DTO
  userIds?: number[];    // Optional if included in DTO
}

export interface UserCoupon {
  id: number;
  coupon: Coupon;
  redeemed: boolean;
  redeemedAt?: string;
  userId?: number;
}
