import { apiClient } from '../apiClient';
// import { WishlistItem } from '@/app/type/wishlist';
import { ProductData } from '@/app/type/product';

export const wishlistService = {
  // 📌 Lấy danh sách sản phẩm yêu thích (trả về mảng sản phẩm)
  // ✅ Dùng GET với query param
    getWishlist(userId: number) {
    return apiClient.get<ProductData[]>(`/wishlist?userId=${userId}`);
    },
    // wishlistService.ts
    // async getWishlist(userId: number) {
    // return apiClient.get<ProductData[]>(`/wishlist`, {
    //     params: { userId }, // sẽ tự sinh ?userId=123
    // });
    // },



  // 📌 Thêm vào yêu thích
  async addToWishlist(userId: number, productId: number) {
    return apiClient.post(`/wishlist/${productId}`, { userId });
  },

  // 📌 Xoá khỏi yêu thích
  async removeFromWishlist(userId: number, productId: number) {
    return apiClient.delete(`/wishlist/${productId}`, { data: { userId } });
  },

  // 📌 Chuyển toàn bộ wishlist sang đơn hàng
  async moveToOrder(userId: number, orderId: number) {
    return apiClient.post(`/wishlist/move-to-order/${orderId}`, { userId });
  },
};
