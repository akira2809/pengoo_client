import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define types
interface CartItem {
  id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url: string;
  discount: number;
  slug?: string;
  description?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  images?: Array<{ url: string; alt?: string }>;
  features?: string[];
}

interface OldCartItem {
  id?: string | number;
  productId?: number;
  name?: string;
  product_name?: string;
  price?: number | string;
  product_price?: number | string;
  quantity: number;
  image?: string;
  image_url?: string;
  discount?: number | string;
  [key: string]: any;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Helper function to check if an item matches the old cart item format
function isOldCartItem(item: unknown): item is OldCartItem {
  if (typeof item !== 'object' || item === null) return false;
  return (
    ('productId' in item || 'id' in item) && 
    ('name' in item || 'product_name' in item) && 
    ('price' in item || 'product_price' in item)
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const productId = 'id' in item ? item.id : 'productId' in item ? item.productId : null;
          if (!productId) {
            console.error('Cannot add item to cart: Missing product ID', item);
            return state;
          }
          
          const existingItemIndex = state.items.findIndex(i => i.id === Number(productId));
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1)
            };
            return { items: updatedItems };
          }
          
          const newItem: CartItem = {
            id: Number(productId),
            product_name: String(
              'name' in item ? item.name : 
              'product_name' in item ? item.product_name : 
              'Unnamed Product'
            ),
            product_price: Number(
              'price' in item ? item.price : 
              'product_price' in item ? item.product_price : 
              0
            ),
            quantity: item.quantity || 1,
            image_url: String(
              'image' in item ? item.image :
              'image_url' in item ? item.image_url :
              'images' in item && Array.isArray((item as any).images) && (item as any).images[0]?.url ? 
                (item as any).images[0].url :
              ''
            ),
            discount: Number(item.discount) || 0,
          };
          
          return { items: [...state.items, newItem] };
        }),
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),
      
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const price = Number(item.product_price) || 0;
          const quantity = Number(item.quantity) || 0;
          const discount = Number(item.discount) || 0;
          const itemTotal = price * quantity * (1 - discount / 100);
          return total + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2, // Increment version to trigger migration
      migrate: (persistedState: unknown) => {
        if (!persistedState) return { items: [] };
        
        // Handle both direct state and wrapped state (from persist)
        const state = (persistedState as { state?: CartState }).state || persistedState as CartState;
        
        if (!state || !Array.isArray((state as any).items)) {
          return { items: [] };
        }
        
        // Migrate each item to the new format
        const migratedItems = (state as any).items
          .filter((item: unknown) => item !== null && typeof item === 'object')
          .map((item: unknown) => {
            // Handle old format
            if (isOldCartItem(item)) {
              return {
                id: Number(item.productId || item.id || 0),
                product_name: String(item.name || item.product_name || 'Unnamed Product'),
                product_price: Number(item.price || item.product_price || 0),
                quantity: Number(item.quantity) || 1,
                image_url: String(item.image || item.image_url || ''),
                discount: Number(item.discount) || 0,
              };
            }
            
            // Ensure required fields in new format
            const typedItem = item as Partial<CartItem>;
            return {
              id: Number(typedItem.id || 0),
              product_name: String(typedItem.product_name || 'Unnamed Product'),
              product_price: Number(typedItem.product_price || 0),
              quantity: Number(typedItem.quantity) || 1,
              image_url: String(typedItem.image_url || ''),
              discount: Number(typedItem.discount) || 0,
              ...typedItem, // Spread any additional properties
            };
          });
        
        return { items: migratedItems };
      },
    }
  )
);