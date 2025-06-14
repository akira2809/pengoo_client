// src/app/stores/type.ts

// Product related types
export interface Product {
  // Core product info
  id: string;
  product_name: string;
  name: string;
  description: string;
  product_price: number;
  slug: string;
  status: number; // 0: Unavailable, 1: Available
  
  // Pricing
  discount: number;
  
  // Media
  image_url: string;
  images: Array<{ 
    id: number;
    url: string;
  }>;
  
  // Features
  features: Array<{
    id: number;
    title: string;
    content: string;
    image: string;
  }>;
  
  // Inventory & Sales
  quantity_sold: number;
  
  // Relationships
  category_ID: string | number;
  publisher_ID: number;
  
  // Metadata
  meta_title: string;
  meta_description: string;
  tags: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Optional fields
  warranty?: string;
  shipping_info?: string;
  quantity_stock?: number;
}

export interface ProductState {
  // Products state
  products: Product[];
  featuredProducts: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  
  // Product actions
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
  searchProducts: (query: string) => Promise<Product[]>;
  getProductsByCategory: (category: string) => Promise<Product[]>;
  getFeaturedProducts: () => Promise<void>;
}

// Cart related types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Auth related types
export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Combined store state
export type RootState = ProductState & CartState & AuthState;