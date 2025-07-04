import { apiClient } from '../apiClient';
import { API_CONFIG } from '../apiConfig';
import { ProductData } from '@/app/type/product';

interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const productService = {
  // Get all products
  async getProducts() {
    return apiClient.get<ProductData[]>(API_CONFIG.ENDPOINTS.PRODUCTS.BASE);
  },
  // Get a single product by ID
  async getProductById(id: string) {
    return apiClient.get<ProductData>(API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  // Get a single product by slug
  async getProductBySlug(slug: string) {
    try {
      // First try to get the product using the exact slug match
      const response = await apiClient.get<ProductData[]>(`${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}?slug=${encodeURIComponent(slug)}`);
      
      if (response?.data && response.data.length > 0 && response.data[0].slug === slug) {
        return { data: response.data[0] };
      }
      
      // Fallback: If direct slug query doesn't work, fetch all and filter with exact match
      const allProducts = await apiClient.get<ProductData[]>(API_CONFIG.ENDPOINTS.PRODUCTS.BASE);
      
      if (allProducts?.data) {
        const product = allProducts.data.find(p => p.slug === slug);
        if (product) {
          return { data: product };
        }
      }
      
      throw new Error(`Không tìm thấy sản phẩm với slug: ${slug}`);
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw new Error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải thông tin sản phẩm');
    }
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 4) {
    return apiClient.get<ProductData[]>(API_CONFIG.ENDPOINTS.PRODUCTS.FEATURED, { limit });
  },

  // Search products
  async searchProducts(query: string, params: Omit<GetProductsParams, 'search'> = {}) {
    return apiClient.get<{
      items: ProductData[];
      total: number;
      page: number;
      limit: number;
    }>(API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH, { ...params, search: query });
  },

  // Get products by category
  async getProductsByCategory(category: string, params: Omit<GetProductsParams, 'category'> = {}) {
    return apiClient.get<{
      items: ProductData[];
      total: number;
      page: number;
      limit: number;
      category: string;
    }>(API_CONFIG.ENDPOINTS.PRODUCTS.BY_CATEGORY(category), params);
  },

  // Get all product categories
  async getCategories() {
    return apiClient.get<Array<{
      id: string;
      name: string;
      slug: string;
      productCount: number;
    }>>(API_CONFIG.ENDPOINTS.PRODUCTS.CATEGORIES);
  },

  async getTags() {
    return apiClient.get<Array<{
      id: string;
      name: string;
      type: string;
    }>>(API_CONFIG.ENDPOINTS.PRODUCTS.TAGS);
  },

};

// Example usage:
/*
// Get all products
const { data: products } = await productService.getProducts({ page: 1, limit: 10 });

// Get a single product by slug
const { data: product } = await productService.getProductBySlug('game-of-drunks');

// Search products
const { data: searchResults } = await productService.searchProducts('drunk', { limit: 5 });

// Get products by category
const { data: categoryProducts } = await productService.getProductsByCategory('board_games');
*/
