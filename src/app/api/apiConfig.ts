// Base API configuration
export const API_CONFIG = {
  // Base URL for all API requests
  BASE_URL: 'http://localhost:3000',
  
  // API endpoints
  ENDPOINTS: {
    // Product endpoints
    PRODUCTS: {
      BASE: '/products',
      FEATURED: '/products/featured',
      BY_ID: (id: string) => `/products/${id}`,
      BY_SLUG: (slug: string) => `/products/slug/${slug}`,
      SEARCH: '/products?name=',
      CATEGORIES: '/categories',
      TAGS: '/tags',
      BY_CATEGORY: (category: string) => `/products/category/${category}`,
      BY_TAG: (tag: string) => `/products/tag/${tag}`,
    },
    
    // Collection endpoints
    COLLECTIONS: {
      BASE: '/collections',
      BY_ID: (id: string | number) => `/collections/${id}`,
      BY_SLUG: (slug: string) => `/collections/slug/${slug}`,
    },

    // Order endpoints
    ORDERS: {
      BASE: '/orders',
      BY_ID: (id: string) => `/orders/${id}`,
      USER_ORDERS: '/orders/user',
      UPDATE_STATUS: (id: number) => `/orders/${id}/status`,
      PAYOS_SUCCESS: '/orders/payos/order-success',
      PAYOS_CANCEL: '/orders/payos/order-cancel',
    },
    
    // User endpoints
    USERS: {
      BASE: '/users',
      PROFILE: '/users/me',
      ADDRESSES: '/users/addresses',
      FAVORITES: '/users/favorites'
    },

    // Coupon endpoints
    COUPONS: {
      BASE: '/coupons',
      VERIFY_VOUCHER: '/coupons/verify-voucher',
      APPLYVOUCHER: '/coupons/validate',
      GET_BY_USER_ID: '/coupons/get-voucher-by-userId'
    },

    // Tag endpoints
    TAGS: {
      BASE: '/tags',
      BY_ID: (id: number | string) => `/tags/${id}`,
    },
    

    // wishlist endpoints
    WISHLIST: {
      BASE: '/wishlist',
      BY_USER_ID: (userId: number) => `/wishlist?userId=${userId}`,
      BY_PRODUCT_ID: (productId: number) => `/wishlist/${productId}`,
      MOVE_TO_ORDER: (orderId: number) => `/wishlist/move-to-order/${orderId}`,
    },


    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    }
  },
  
  // Default request configuration
  DEFAULT_REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000, // 10 seconds
    withCredentials: true // Enable sending/receiving cookies
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
    SERVER_ERROR: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.',
    UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này.',
    FORBIDDEN: 'Bạn không có quyền truy cập tài nguyên này.',
    NOT_FOUND: 'Không tìm thấy tài nguyên yêu cầu.',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
  }
} as const;

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Pagination type
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(key, String(item)));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Example usage:
// const query = buildQueryString({ page: 1, limit: 10, sortBy: 'name' });
// const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}${query}`;
