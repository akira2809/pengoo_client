// src/app/stores/type.ts

// Product related types
export interface Product {
  id: string;
  product_name: string;
  name: string;
  description: string;
  product_price: string;
  discountedPrice?: string;
  originalPrice?: string;
  discount?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  image_url: string;
  images?: Array<{ src: string; alt: string }>;
  quantity_sold?: string | number;
  categoryId?: string;
  publisherID?: number;
  status?: number;
  tags?: string[];
  features?: string[];
  warranty?: string;
  shippingInfo?: string;
  isOutOfStock?: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
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