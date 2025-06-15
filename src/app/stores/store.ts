// src/app/stores/store.ts
import { create } from 'zustand';
import { createProductSlice } from './slice/useProductStore';
import { ProductState, CartState, AuthState, Product } from './type';
import { productService } from '../api/services/productService';

// Define the combined state type
type StoreState = ProductState & CartState & AuthState & {
  fetchProductsByCategory: (categoryId: string) => Promise<void>;
};

// Create the store
export const useStore = create<StoreState>((set, get) => ({
  ...createProductSlice(set, get),
  // Cart state
  items: [],
  addToCart: (product: Product) => set((state) => ({ 
    items: [...state.items, { product, quantity: 1 }] 
  })),
  removeFromCart: (productId: string) => set((state) => ({
    items: state.items.filter(item => item.product.id !== productId)
  })),
  updateQuantity: (productId: string, quantity: number) => set((state) => ({
    items: state.items.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    )
  })),
  clearCart: () => set({ items: [] }),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce(
    (total, item) => total + (item.product.product_price * item.quantity),
    0
  ),
  
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (credentials: { email: string; password: string }) => {
    // Thêm logic đăng nhập ở đây
    try {
      set({ isLoading: true });
      // Implement login logic here
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      set({ isLoading: true });
      // Implement registration logic here
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      // Implement auth check logic here
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Auth check failed',
        isLoading: false 
      });
      throw error;
    }
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  
  // Fetch products by category
  fetchProductsByCategory: async (categoryId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await productService.getProductsByCategory(categoryId);
      if (response?.data) {
        // Ensure the response data is an array of products
        const products = Array.isArray(response.data) ? response.data : [];
        set({ products, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },
}));

// Export typed hooks
export const useProductStore = () => useStore((state) => ({
  products: state.products,
  isLoading: state.isLoading,
  error: state.error,
  fetchProducts: state.fetchProducts,
  fetchProductsByCategory: state.fetchProductsByCategory,
}));