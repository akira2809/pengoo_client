// src/app/api/services/collectionService.ts

import { apiClient } from '../apiClient';
import { ProductData } from '@/app/type/product';
import { API_CONFIG } from '../apiConfig';

export interface CollectionData {
  id: number;
  name: string;
  products: ProductData[];
  description: string;
  image_url: string;
}

export const collectionService = {
   // Lấy tất cả collections (có cả products bên trong)
  async getCollections() {
    return apiClient.get<CollectionData[]>(API_CONFIG.ENDPOINTS.COLLECTIONS.BASE);
  },

  // Lấy collection theo ID
  async getCollectionById(id: string | number) {
    return apiClient.get<CollectionData>(API_CONFIG.ENDPOINTS.COLLECTIONS.BY_ID(id));
  },

  async getCollectionBySlug(slug: string ) {
    return apiClient.get<CollectionData>(API_CONFIG.ENDPOINTS.COLLECTIONS.BY_SLUG(slug));
  },
};
