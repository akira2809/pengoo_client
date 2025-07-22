// src/app/api/services/tagService.ts
import { apiClient } from '../apiClient';
import { API_CONFIG } from '../apiConfig';
import { TagData } from '@/app/type/tags';


export const tagService = {
  // Lấy tất cả tag
  async getAllTags() {
    return apiClient.get<TagData[]>(API_CONFIG.ENDPOINTS.TAGS.BASE);
  },

  // Lấy tag theo ID
  async getTagById(id: number) {
    return apiClient.get<TagData>(API_CONFIG.ENDPOINTS.TAGS.BY_ID(id));
  },

  // Lấy tag theo tên (nếu cần)
//   async getTagByName(name: string) {
//     return apiClient.get<TagData[]>(`${API_CONFIG.ENDPOINTS.TAGS.BASE}?name=${encodeURIComponent(name)}`);
//   },

  // Tạo tag mới
  async createTag(tag: { name: string; slug: string }) {
    return apiClient.post<TagData>(API_CONFIG.ENDPOINTS.TAGS.BASE, tag);
  },

  // Cập nhật tag
  async updateTag(id: number, tag: Partial<TagData>) {
    return apiClient.put<TagData>(API_CONFIG.ENDPOINTS.TAGS.BY_ID(id), tag);
  },

  // Xóa tag
  async deleteTag(id: number) {
    return apiClient.delete(API_CONFIG.ENDPOINTS.TAGS.BY_ID(id));
  },
};
