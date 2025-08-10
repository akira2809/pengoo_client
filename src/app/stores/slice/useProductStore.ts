// src/app/stores/slice/useProductStore.ts
import { StateCreator } from 'zustand';
import { Product, ProductState } from '../type';
import { productService } from '@/app/api/services/productService';

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface Publisher {
  id: number;
  name: string;
}

interface ApiProduct {
  id: number;
  product_name: string;
  description: string;
  product_price: number; // Changed from string to number
  slug: string;
  status: string;
  image_url: string;
  discount: number;
  meta_title: string;
  meta_description: string;
  quantity_sold: number;
  category_ID: Category | number;
  publisher_ID: Publisher | number;
  tags: string[];
  images: Array<{
    id: number;
    url: string;
  }>;
  features: Array<{
    id: number;
    title: string;
    content: string;
    image: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Helper function to convert ApiProduct to Product
const mapApiProductToProduct = (item: ApiProduct): Product => {
  // Convert product price to number
  const productPrice = item.product_price || 0;
  const discount = item.discount || 0;
  const imageUrl = item.image_url || '';
  
  const categoryId = typeof item.category_ID === 'object' 
    ? String(item.category_ID.id) 
    : String(item.category_ID || '');
    
  const publisherID = typeof item.publisher_ID === 'object'
    ? item.publisher_ID.id
    : Number(item.publisher_ID || 0);
    
  // Convert images to the correct format
  const productImages = Array.isArray(item.images) 
    ? item.images.map((img, index) => {
        if (typeof img === 'string') {
          return {
            id: index + 1,
            url: img,
            name: index === 0 ? 'main' : '',
            ord: index
          };
        }
        return {
          id: img.id || index + 1,
          url: img.url || '',
          name: 'name' in img ? String(img.name) : (index === 0 ? 'main' : ''),
          ord: 'ord' in img ? Number(img.ord) : index
        };
      })
    : [];
    
  // If no images but we have an image_url, use that as the main image
  if (productImages.length === 0 && item.image_url) {
    productImages.push({
      id: 1,
      url: item.image_url,
      name: 'main',
      ord: 0
    });
  }

  // Create the base product object
  const productData = {
    id: String(item.id),
    product_name: item.product_name || '',
    name: item.product_name || '',
    description: item.description || '',
    product_price: productPrice,
    discount: discount,
    slug: item.slug || '',
    status: item.status === 'Available' ? 1 : 0,
    meta_title: item.meta_title || '',
    meta_description: item.meta_description || '',
    image_url: productImages[0]?.url || imageUrl, // Use first image URL or fallback to image_url
    quantity_sold: item.quantity_sold || 0,
    category_ID: categoryId,
    publisher_ID: publisherID,
    tags: Array.isArray(item.tags) ? item.tags : [],
    images: productImages,
    features: Array.isArray(item.features) 
      ? item.features.map(f => ({
          id: f.id || 0,
          title: f.title || '',
          content: f.content || '',
          image: f.image || ''
        }))
      : [],
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    quantity_stock: 'quantity_stock' in item ? Number(item.quantity_stock) : 0,
    warranty: 'warranty' in item ? String(item.warranty || '') : '',
    shipping_info: 'shipping_info' in item ? String(item.shipping_info || '') : ''
  };
  
  console.log('Mapped product data:', productData); // Debug log
  return productData;
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

      // Map the response data to match the ApiProduct interface
      const apiProducts: ApiProduct[] = response.data.map(item => ({
        ...item,
        // Ensure images is an array of {id, url} objects
        images: Array.isArray(item.images) 
          ? item.images.map((img, index) => ({
              id: typeof img === 'object' ? img.id : index + 1,
              url: typeof img === 'object' ? img.url : String(img)
            }))
          : [],
        // Ensure features is an array of feature objects
        features: Array.isArray(item.features)
          ? item.features.map(f => ({
              id: f.id || 0,
              title: f.title || '',
              content: f.content || '',
              image: f.image || ''
            }))
          : [],
        // Ensure tags is always an array of strings
        tags: Array.isArray(item.tags)
          ? item.tags.map(tag => typeof tag === 'string' ? tag : String(tag))
          : []
      }));

      const products = apiProducts.map(mapApiProductToProduct);
      
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

  /**
   * Fetches products by category ID
   */
  fetchProductsByCategory: async (categoryId: string): Promise<void> => {
    if (!categoryId) {
      set({ error: 'Category ID is required', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await productService.getProductsByCategory(categoryId);
      console.log('Category Products Response:', response);

      if (!response?.data) {
        throw new Error('No products found for this category');
      }

      // The response.data should be an array of products
      const productsData = Array.isArray(response.data) ? response.data : [];
      
      // Define interfaces for the API response
      interface ApiImage {
        id?: number | string;
        url?: string;
        [key: string]: unknown;
      }

      interface ApiFeature {
        id?: number | string;
        title?: string;
        content?: string;
        image?: string;
        [key: string]: unknown;
      }

      interface ApiProductResponse extends Omit<ApiProduct, 'images' | 'features'> {
        images?: (ApiImage | string)[];
        features?: ApiFeature[];
        [key: string]: unknown;
      }

      // Map the response data to match the ApiProduct interface
      const apiProducts: ApiProduct[] = productsData.map((item: ApiProductResponse) => {
        const images = Array.isArray(item.images) 
          ? item.images.map((img, index) => ({
              id: typeof img === 'object' && img !== null && 'id' in img ? Number(img.id) : index + 1,
              url: typeof img === 'object' && img !== null && 'url' in img ? String(img.url) : String(img)
            }))
          : [];

        const features = Array.isArray(item.features)
          ? item.features.map((f) => ({
              id: f.id ? Number(f.id) : 0,
              title: f.title || '',
              content: f.content || '',
              image: f.image || ''
            }))
          : [];

        return {
          ...item,
          images,
          features
        } as unknown as ApiProduct; // Type assertion needed due to complex nested types
      });

      const products = apiProducts.map(mapApiProductToProduct);
      
      // Update products in the store
      set({
        products,
        isLoading: false,
        error: null
      });
    } catch (error) {
      handleError(error, 'Failed to fetch products by category', set);
    }
  },
  
  // Add missing comma if this is the last method in the object

  fetchProductById: async (id: string): Promise<Product | null> => {
    if (!id) {
      set({ error: 'Product ID is required', isLoading: false });
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await productService.getProductById(id);

      if (!response?.data) {
        throw new Error('Product not found');
      }

      // Map the response data to match the ApiProduct interface
      const apiProduct: ApiProduct = {
        ...response.data,
        // Ensure images is an array of {id, url} objects
        images: Array.isArray(response.data.images) 
          ? response.data.images.map((img, index) => ({
              id: typeof img === 'object' ? img.id : index + 1,
              url: typeof img === 'object' ? img.url : String(img)
            }))
          : [],
        // Ensure features is an array of feature objects
        features: Array.isArray(response.data.features)
          ? response.data.features.map(f => ({
              id: f.id || 0,
              title: f.title || '',
              content: f.content || '',
              image: f.image || ''
            }))
          : [],
        // Ensure tags is always an array of strings
        tags: Array.isArray(response.data.tags)
          ? response.data.tags.map(tag => typeof tag === 'string' ? tag : String(tag))
          : []
      };

      const product = mapApiProductToProduct(apiProduct);
      set({ selectedProduct: product, isLoading: false });
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

      const product = mapApiProductToProduct({
        ...response.data,
        tags: Array.isArray(response.data.tags)
          ? response.data.tags.map(tag => typeof tag === 'string' ? tag : String(tag))
          : []
      });

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

      // Ensure response.data is an array before mapping
      const searchData = Array.isArray(response.data) ? response.data : [response.data];
      const searchResults = searchData.map(item => mapApiProductToProduct(item as ApiProduct));
      
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
      
      // Ensure response.data is an array before mapping
      const categoryData = Array.isArray(response.data) ? response.data : [response.data];
      const categorizedProducts = categoryData.map(item => mapApiProductToProduct(item as ApiProduct));
      
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

  // Add any other store methods here
  getFeaturedProducts: async (limit: number = 4): Promise<void> => {
    set({ isLoading: true, error: null });
    
    try {
      // First try to get featured products from the API
      const response = await productService.getFeaturedProducts(limit);
      
      if (response?.data) {
        // Define interfaces for the response data
        interface ImageData {
          id?: number | string;
          url?: string;
        }

        interface FeatureData {
          id?: number | string;
          title?: string;
          content?: string;
          image?: string;
        }

        type ProductResponse = Partial<ApiProduct> & {
          images?: Array<ImageData | string>;
          features?: FeatureData[];
        };

        // Handle both array and object responses
        const responseData = (Array.isArray(response.data) 
          ? response.data 
          : [response.data]) as ProductResponse[];
        
        if (responseData.length > 0) {
          // Map the response data to match the ApiProduct interface
          const apiProducts = responseData.map((item) => {
            const product: Partial<ApiProduct> = { ...item };
            
            // Ensure images is an array of {id, url} objects
            if (Array.isArray(item.images)) {
              product.images = item.images.map((img, index) => {
                if (typeof img === 'string') {
                  return { id: index + 1, url: img };
                }
                return {
                  id: img.id || index + 1,
                  url: img.url || ''
                };
              });
            } else {
              product.images = [];
            }
            
            // Ensure features is an array of feature objects
            if (Array.isArray(item.features)) {
              product.features = item.features.map((f) => ({
                id: f.id || 0,
                title: f.title || '',
                content: f.content || '',
                image: f.image || ''
              }));
            } else {
              product.features = [];
            }
            
            return product as ApiProduct;
          });
          
          const products = apiProducts.map(mapApiProductToProduct);
          set({ 
            featuredProducts: products,
            isLoading: false 
          });
          return;
        }
      }
      
      // Fallback: Get the first N products if no featured products are available
      const state = (set as unknown as { getState: () => ProductState }).getState?.();
      if (state?.fetchProducts) {
        await state.fetchProducts();
        const updatedState = (set as unknown as { getState: () => ProductState }).getState?.();
        if (updatedState?.products) {
          set({
            featuredProducts: updatedState.products.slice(0, limit),
            isLoading: false
          });
          return;
        }
      }
      
      // If all else fails, set empty featured products
      set({
        featuredProducts: [],
        isLoading: false
      });
    } catch (error) {
      handleError(error, 'Failed to fetch featured products', set);
    }
  }
});

// Export the store
export default createProductSlice;
export { mapApiProductToProduct };
