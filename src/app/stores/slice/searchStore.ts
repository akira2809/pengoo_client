'use client';

import { create } from 'zustand';
import { API_CONFIG } from '@/app/api/apiConfig';
import { SearchState } from '../type';
import type { Product } from '../type';

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = 'recentSearches';

const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
  return searches ? JSON.parse(searches) : [];
};

const saveRecentSearches = (searches: string[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  }
};

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  error: null,
  recentSearches: getRecentSearches(),

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchProducts: async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      set({ searchResults: [], isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Sử dụng endpoint tìm kiếm chung cho cả trường hợp 1 ký tự và nhiều ký tự
      const searchUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH}${encodeURIComponent(trimmedQuery)}`;

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        cache: 'no-store' // Đảm bảo không sử dụng cache cho tìm kiếm
      }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Lỗi tìm kiếm: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      
      // Handle different response formats
      let results = [];
      if (Array.isArray(responseData)) {
        results = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        results = responseData.data;
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }

      // Sắp xếp kết quả: ưu tiên sản phẩm bắt đầu bằng ký tự tìm kiếm
      if (trimmedQuery.length === 1) {
        const searchChar = trimmedQuery.toLowerCase();
        results.sort((a: Product, b: Product) => {
          const aStartsWith = a.product_name?.toLowerCase().startsWith(searchChar) ? 0 : 1;
          const bStartsWith = b.product_name?.toLowerCase().startsWith(searchChar) ? 0 : 1;
          return aStartsWith - bStartsWith;
        });
      }

      set({ searchResults: results });
      get().addToRecentSearches(trimmedQuery);
    } catch (error) {
      console.error('Search error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi không xác định khi tìm kiếm',
        searchResults: [] 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSearch: () => set({ searchQuery: '', searchResults: [] }),

  addToRecentSearches: (query) => {
    if (!query.trim()) return;
    
    set((state) => {
      // Remove duplicate if exists
      const newSearches = [
        query.trim(),
        ...state.recentSearches.filter((item) => item.toLowerCase() !== query.trim().toLowerCase())
      ].slice(0, MAX_RECENT_SEARCHES);
      
      saveRecentSearches(newSearches);
      return { recentSearches: newSearches };
    });
  },

  removeRecentSearch: (index) => {
    set((state) => {
      const newSearches = [...state.recentSearches];
      newSearches.splice(index, 1);
      saveRecentSearches(newSearches);
      return { recentSearches: newSearches };
    });
  },

  clearRecentSearches: () => {
    saveRecentSearches([]);
    set({ recentSearches: [] });
  },
}));
