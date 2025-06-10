// src/app/stores/store.ts
import { create } from 'zustand';
import { createProductSlice } from './slice/useProductStore';
import { ProductState, CartState, AuthState } from './type';

// Define the combined state type
type StoreState = ProductState & CartState & AuthState;

// Create the store with Zukeeper support
export const useStore = create<StoreState>((set, get) => ({
  ...createProductSlice(set, get),
  // Cart state
  items: [],
  addToCart: (product) => set((state) => ({ 
    items: [...state.items, { product, quantity: 1 }] 
  })),
  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter(item => item.product.id !== productId)
  })),
  // Auth state
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Thêm logic đăng nhập ở đây
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Export typed hooks
export const useProductStore = () => useStore((state) => state);