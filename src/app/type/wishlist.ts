import { ProductData } from './product';

export interface WishlistItem {
  id: number;
  userId: number;
  product: ProductData;
  createdAt: string;
}
