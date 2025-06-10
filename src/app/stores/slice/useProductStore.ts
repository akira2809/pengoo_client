// src/app/stores/slice/useProductStore.ts
import { StateCreator } from 'zustand';
import { Product, ProductState } from '../type';
import { productService } from '@/app/api/services/productService';

interface ApiProduct {
  id: string;
  product_name: string;
  description: string;
  product_price: string;
  discount: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  image_url: string;
  quantity_sold: string;
  categoryId: string;
  publisherID: number;
  status: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const createProductSlice: StateCreator<ProductState> = (set) => ({
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProducts();
      
      console.log('API Response:', response); // Debug log

      if (!response?.data) {
        throw new Error('Invalid response format from server');
      }

      const products: Product[] = response.data.map((item: ApiProduct) => {
        // Ensure all required fields have default values
        const product: Product = {
          id: item.id || '',
          product_name: item.product_name || '',
          name: item.product_name || '',
          description: item.description || '',
          product_price: item.product_price || '0',
          discount: item.discount || '0',
          slug: item.slug || '',
          meta_title: item.meta_title || '',
          meta_description: item.meta_description || '',
          image_url: item.image_url || '',
          quantity_sold: item.quantity_sold || '0',
          categoryId: item.categoryId || '',
          publisherID: item.publisherID || 0,
          status: item.status || 0,
          tags: Array.isArray(item.tags) ? item.tags : [],
          originalPrice: parseFloat(item.product_price || '0') + parseFloat(item.discount || '0'),
          discountedPrice: parseFloat(item.product_price || '0'),
          images: [{ url: item.image_url || '', alt: item.meta_title || '' }]
        };
        return product;
      });
      
      set({ 
        products, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },

  fetchProductById: async (id: string) => {
    if (!id) {
      set({ error: 'Product ID is required', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await productService.getProductById(id) as { data?: ApiProduct };
      
      if (!response?.data) {
        throw new Error('Product not found');
      }

      const productData = response.data;
      const product: Product = {
        ...productData,
        name: productData.product_name,
        originalPrice: parseFloat(productData.product_price) + parseFloat(productData.discount || '0'),
        discountedPrice: parseFloat(productData.product_price),
        images: [{ url: productData.image_url, alt: productData.meta_title }]
      };
      
      set({ 
        selectedProduct: product, 
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },
});