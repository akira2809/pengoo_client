import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ========================
// Types
// ========================
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
  quantity_stock?: number;
}

interface OldCartItem {
  id?: string | number;
  productId?: number | string;
  name?: string;
  product_name?: string;
  price?: number | string;
  product_price?: number | string;
  quantity: number;
  image?: string;
  image_url?: string;
  discount?: number | string;
  quantity_stock?: number | string;
  [key: string]: unknown;
}

interface CartState {
  items: CartItem[];
  addItem: (
    item:
      | (Omit<CartItem, 'quantity'> & { quantity?: number })
      | (OldCartItem & { quantity?: number })
  ) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// ========================
// Helpers
// ========================

// Kiểm tra kiểu old item (để migrate/đọc fallback)
function isOldCartItem(item: unknown): item is OldCartItem {
  if (typeof item !== 'object' || item === null) return false;
  const obj = item as Record<string, unknown>;
  const hasId = 'productId' in obj || 'id' in obj;
  const hasName = 'name' in obj || 'product_name' in obj;
  const hasPrice = 'price' in obj || 'product_price' in obj;
  return hasId && hasName && hasPrice;
}

// Ép số an toàn (number | string -> number | undefined)
const toNum = (v: unknown): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// Dict / helpers đọc prop an toàn
type Dict = Record<string, unknown>;
const isDict = (v: unknown): v is Dict => typeof v === 'object' && v !== null;

const getNumberProp = (obj: unknown, key: string): number | undefined => {
  if (!isDict(obj)) return undefined;
  return toNum(obj[key]);
};

const getStringProp = (obj: unknown, key: string): string | undefined => {
  if (!isDict(obj)) return undefined;
  const v = obj[key];
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return undefined;
};

// ========================
// Auto reset storage cũ
// ========================
const CART_KEY = 'cart-storage';
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw && /"version"\s*:\s*2/.test(raw)) {
      console.warn('[cartStore] Found old version=2, clearing cart-storage');
      localStorage.removeItem(CART_KEY);
    }
  } catch {}
}

// console.log('[cartStore] INIT version 3');

// ========================
// Store
// ========================
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          // ---- Lấy productId/id an toàn, KHÔNG dùng any
          let productIdNum: number | undefined;

          if ('id' in item && item.id !== undefined && item.id !== null) {
            productIdNum = toNum((item as { id: unknown }).id);
          } else {
            productIdNum = getNumberProp(item, 'productId');
          }

          if (productIdNum === undefined) {
            console.error('Cannot add item to cart: Missing product ID', item);
            return state;
          }

          const existingItemIndex = state.items.findIndex(
            (i) => i.id === productIdNum
          );

          // ---- Đọc tồn kho (number|string) -> number|undefined
          const stock = getNumberProp(item, 'quantity_stock');

          // ---- Chuẩn hoá các field hiển thị/giá
          const name =
            ('product_name' in item
              ? getStringProp(item, 'product_name')
              : undefined) ??
            ('name' in item ? getStringProp(item, 'name') : undefined) ??
            'Unnamed Product';

          const price =
            ('product_price' in item
              ? getNumberProp(item, 'product_price')
              : undefined) ??
            ('price' in item ? getNumberProp(item, 'price') : undefined) ??
            0;

          const imageUrl =
            ('image_url' in item
              ? getStringProp(item, 'image_url')
              : undefined) ??
            ('image' in item ? getStringProp(item, 'image') : undefined) ??
            '';

          const discount = getNumberProp(item, 'discount') ?? 0;

          // ---- Nếu đã có item trong cart
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            const current = updatedItems[existingItemIndex];

            const addQty =
              (('quantity' in item
                ? toNum((item as { quantity?: unknown }).quantity)
                : undefined) ?? 1);

            let newQty = current.quantity + addQty;

            // Kẹp theo tồn kho (nếu có)
            if (typeof stock === 'number') {
              newQty = Math.min(newQty, stock);
            }

            updatedItems[existingItemIndex] = {
              ...current,
              quantity: newQty,
              quantity_stock:
                typeof stock === 'number' ? stock : current.quantity_stock,
            };

            return { items: updatedItems };
          }

          // ---- Nếu chưa có item
          const initQty =
            (('quantity' in item
              ? toNum((item as { quantity?: unknown }).quantity)
              : undefined) ?? 1);

          if (typeof stock === 'number' && stock <= 0) {
            // Hết hàng -> không thêm
            return state;
          }

          // Nếu vượt kho -> kẹp về stock
          const finalQty =
            typeof stock === 'number' ? Math.min(initQty, stock) : initQty;

          const newItem: CartItem = {
            id: productIdNum,
            product_name: name,
            product_price: price,
            quantity: finalQty,
            image_url: imageUrl,
            discount,
            quantity_stock: typeof stock === 'number' ? stock : undefined,
          };

          return { items: [...state.items, newItem] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const items = state.items.map((item) => {
            if (item.id !== id) return item;

            // kẹp >= 1
            let q = Math.max(1, Number(quantity) || 1);

            // kẹp theo tồn kho (ép về number an toàn)
            const stockNum = toNum(item.quantity_stock);
            if (typeof stockNum === 'number') {
              q = Math.min(q, stockNum);
            }

            return { ...item, quantity: q };
          });
          return { items };
        }),

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
      name: CART_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 3,

      migrate: (persistedState: unknown): { items: CartItem[] } => {
        if (!persistedState) return { items: [] };

        // persist lưu { state: {...}, version: n }
        const state =
          (persistedState as { state?: CartState }).state ||
          (persistedState as CartState);

        if (!state || !Array.isArray((state as { items?: unknown }).items)) {
          return { items: [] };
        }

        const migratedItems = (state as { items: Array<unknown> }).items
          .filter(
            (item: unknown): item is Record<string, unknown> =>
              item !== null && typeof item === 'object'
          )
          .map((item: Record<string, unknown>): CartItem | undefined => {
            // Chuẩn hoá và kẹp quantity theo stock
            const clamp = (q: number, s?: number) => {
              if (typeof s === 'number') return Math.max(1, Math.min(q, s));
              return Math.max(1, q);
            };

            if (isOldCartItem(item)) {
              const stockNum = getNumberProp(item, 'quantity_stock'); // <-- không dùng any
              const baseQty = Number(item.quantity) || 1;
              const finalQty = clamp(baseQty, stockNum);

              return {
                id:
                  toNum(item.productId) ??
                  toNum(item.id) ??
                  0,
                product_name:
                  getStringProp(item, 'name') ??
                  getStringProp(item, 'product_name') ??
                  'Unnamed Product',
                product_price:
                  getNumberProp(item, 'price') ??
                  getNumberProp(item, 'product_price') ??
                  0,
                quantity: finalQty,
                image_url:
                  getStringProp(item, 'image') ??
                  getStringProp(item, 'image_url') ??
                  '',
                discount: getNumberProp(item, 'discount') ?? 0,
                quantity_stock: stockNum,
              };
            }

            const typedItem = item as Partial<CartItem>;
            const stockNum = toNum(typedItem.quantity_stock);
            const baseQty = Number(typedItem.quantity) || 1;
            const finalQty = clamp(baseQty, stockNum);

            return {
              id: Number(typedItem.id || 0),
              product_name: String(typedItem.product_name || 'Unnamed Product'),
              product_price: Number(typedItem.product_price || 0),
              quantity: finalQty,
              image_url: String(typedItem.image_url || ''),
              discount: toNum(typedItem.discount) ?? 0,
              quantity_stock: stockNum,
              ...typedItem,
            };
          })
          .filter((item): item is CartItem => item !== undefined);

        return { items: migratedItems };
      },
    }
  )
);
