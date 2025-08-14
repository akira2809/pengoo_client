// src/utils/productUtils.ts
import { ProductData } from "@/app/type/product";

export interface NormalizedProductData extends ProductData {
  images: Array<{
    id: number;
    url: string;
    name?: string;
    ord?: number | null;
  }>;
}

export const normalizeProductData = (product: unknown): NormalizedProductData => {
  const productObj = product as Record<string, unknown>;
  
  // Ensure images array is properly formatted
  const normalizedImages = Array.isArray(productObj.images) 
    ? productObj.images.map((img: unknown, index: number) => ({
        id: (img as Record<string, unknown>).id as number || index,
        url: (img as Record<string, unknown>).url as string || (img as Record<string, unknown>).src as string || '',
        name: (img as Record<string, unknown>).name as string || '',
        ord: (img as Record<string, unknown>).ord as number || index
      }))
    : [];

  return {
    ...productObj,
    images: normalizedImages,
    image_url: productObj.image_url as string || productObj.image as string || '',
    product_name: productObj.product_name as string || productObj.name as string || '',
    product_price: Number(productObj.product_price || productObj.price || 0),
    quantity_stock: Number(productObj.quantity_stock || 0),
    quantity_sold: Number(productObj.quantity_sold || 0),
    discount: Number(productObj.discount || 0),
  } as NormalizedProductData;
};