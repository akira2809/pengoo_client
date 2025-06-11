// src/app/stores/slice/useProductStore.ts
import { StateCreator } from 'zustand';
import { Product, ProductState } from '../type';
import { productService } from '@/app/api/services/productService';

interface ApiProduct {
  id: string | number;
  product_name: string;
  description: string;
  product_price: string | number;
  discount: string | number;
  slug: string;
  meta_title: string;
  meta_description: string;
  image_url: string | string[];
  quantity_sold: string | number;
  categoryId: string | number;
  publisherID: number;
  status: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to convert ApiProduct to Product
const mapApiProductToProduct = (item: ApiProduct): Product => {
  const productPrice = String(item.product_price || '0');
  const discount = String(item.discount || '0');
  const originalPrice = (parseFloat(productPrice) + parseFloat(discount)).toString();
  const imageUrl = Array.isArray(item.image_url) ? item.image_url[0] : String(item.image_url || '');

  return {
    id: String(item.id || ''),
    product_name: String(item.product_name || ''),
    name: String(item.product_name || ''),
    description: String(item.description || ''),
    product_price: productPrice,
    discount: discount,
    slug: String(item.slug || ''),
    meta_title: String(item.meta_title || ''),
    meta_description: String(item.meta_description || ''),
    image_url: imageUrl,
    quantity_sold: String(item.quantity_sold || '0'),
    categoryId: String(item.categoryId || ''),
    publisherID: Number(item.publisherID) || 0,
    status: Number(item.status) || 0,
    tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
    originalPrice: originalPrice,
    discountedPrice: productPrice,
    images: [{
      src: imageUrl,
      alt: String(item.meta_title || '')
    }]
  };
};

// Helper function to handle errors
const handleError = (
  error: unknown, 
  defaultMessage: string, 
  set: (state: Partial<ProductState> | ((state: ProductState) => Partial<ProductState>)) => void
): void => {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  set({ error: errorMessage, isLoading: false });
};

export const createProductSlice: StateCreator<ProductState> = (set) => ({
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  /**
   * Fetches all products from the API
   */
  fetchProducts: async (): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProducts();
      console.log('API Response:', response); // Debug log

      if (!response?.data) {
        throw new Error('Invalid response format from server');
      }

      const products = response.data.map(mapApiProductToProduct);
      
      // Update products in the store
      set(state => ({
        // Merge with existing products, avoiding duplicates
        products: [...state.products, ...products.filter(newProduct =>
          !state.products.some(existing => existing.id === newProduct.id)
        )],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      handleError(error, 'Failed to fetch products', set);
    }
  },

  fetchProductById: async (id: string): Promise<Product | null> => {
    if (!id) {
      set({ error: 'Product ID is required', isLoading: false });
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await productService.getProductById(id) as { data?: ApiProduct };

      if (!response?.data) {
        throw new Error('Product not found');
      }

      const product = mapApiProductToProduct(response.data);

      // Add to products array if not already present
      set(state => ({
        products: state.products.some(p => p.id === product.id)
          ? state.products
          : [...state.products, product],
        selectedProduct: product,
        isLoading: false,
        error: null
      }));

      return product;
    } catch (error) {
      handleError(error, 'Failed to fetch product', set);
      return null;
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    // First check if product is already in the store
    const state = (set as unknown as { getState: () => ProductState }).getState();
    const existingProduct = state.products.find(p => p.id === id);

    if (existingProduct) {
      set({ selectedProduct: existingProduct });
      return existingProduct;
    }

    // If not found, fetch from API
    return await (set as unknown as { getState: () => { fetchProductById: (id: string) => Promise<Product | null> } }).getState().fetchProductById(id);
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    if (!slug) return null;

    // First check if product is already in the store
    const state = (set as unknown as { getState: () => ProductState }).getState();
    const existingProduct = state.products.find(p => p.slug === slug);

    if (existingProduct) {
      set({ selectedProduct: existingProduct });
      return existingProduct;
    }

    // If not found, fetch from API
    set({ isLoading: true, error: null });

    
    try {
      const response = await productService.getProductBySlug(slug);
      if (!response?.data) return null;

      const product = mapApiProductToProduct(response.data);

      // Add to products array if not already present
      set(state => ({
        products: state.products.some(p => p.id === product.id)
          ? state.products
          : [...state.products, product],
        selectedProduct: product,
        isLoading: false,
        error: null
      }));

      return product;
    } catch (error) {
      handleError(error, 'Failed to fetch product by slug', set);
      return null;
    }
  },

  // MARK: - Missing methods added below

  searchProducts: async (query: string): Promise<Product[]> => {
    if (!query.trim()) return [];

    set({ isLoading: true, error: null });

    try {
      const response = await productService.searchProducts(query);
      if (!response?.data) return [];

      const searchResults = response.data.map(mapApiProductToProduct);
      
      set(state => ({
        products: [...state.products, ...searchResults.filter(newProduct =>
          !state.products.some(existing => existing.id === newProduct.id)
        )],
        isLoading: false,
        error: null
      }));
      
      return searchResults;
    } catch (error) {
      handleError(error, 'Failed to search products', set);
      return [];
    }
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProductsByCategory(categoryId);
      if (!response?.data) return [];
      
      const categorizedProducts = response.data.map(mapApiProductToProduct);
      
      set(state => ({
        products: [...state.products, ...categorizedProducts.filter(newProduct =>
          !state.products.some(existing => existing.id === newProduct.id)
        )],
        isLoading: false,
        error: null
      }));
      
      return categorizedProducts;
    } catch (error) {
      handleError(error, 'Failed to fetch products by category', set);
      return [];
    }
  },

  getFeaturedProducts: async (): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getFeaturedProducts();
      if (!response?.data) return;
      
      const featuredProducts = response.data.map(mapApiProductToProduct);
      
      set(state => ({
        featuredProducts: [...state.featuredProducts, ...featuredProducts.filter(newProduct =>
          !state.featuredProducts.some(existing => existing.id === newProduct.id)
        )],
        products: [...state.products, ...featuredProducts.filter(newProduct =>
          !state.products.some(existing => existing.id === newProduct.id)
        )],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      handleError(error, 'Failed to fetch featured products', set);
    }
  },
});