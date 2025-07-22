import { apiClient } from '../apiClient';
import { ProductData } from '@/app/type/product';

export const wishlistService = {
  // Lấy danh sách sản phẩm yêu thích (trả về mảng sản phẩm)
  getWishlist(userId: number) {
    return apiClient.get<ProductData[]>('/wishlist', { userId });
  },

  // Thêm vào yêu thích
  async addToWishlist(userId: number, productId: number) {
    return apiClient.post(`/wishlist/${productId}`, { userId });
  },

  // Xoá khỏi yêu thích từng product (MUST SEND BODY)
  async removeFromWishlist(userId: number, productId: number) {
    return apiClient.delete(`/wishlist/${productId}`, { userId });
  },

  // Xoá all products (if supported)
  removeFromAllWishlist(userId: number) {
    return apiClient.delete('/wishlist', { userId });
  },

  // Chuyển toàn bộ wishlist sang đơn hàng
  async moveToOrder(userId: number, orderId: number) {
    return apiClient.post(`/wishlist/move-to-order/${orderId}`, { userId });
  },

  // Lấy wishlist theo userId (same as getWishlist)
  async getWishlistByUserId(userId: number) {
    return apiClient.get<ProductData[]>('/wishlist', { userId });
  },

  // Xoá trái tim wishlist (same as removeFromWishlist)
  removeHeartWishlist(userId: number, productId: number) {
    return apiClient.delete(`/wishlist/${productId}`, { userId });
  },
};
