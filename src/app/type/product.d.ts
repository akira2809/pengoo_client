// src/types/product.ts
export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  textBgColor: string;
  isImageRight: boolean;
  isFirstBlock?: boolean;
}

// src/app/api/data/product.ts
export interface ProductData {
  id: string;
  product_name: string;
  description: string;
  product_price: number;
  discount: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  image_url: string | string[];
  quantity_sold: string;
  categoryId: string;
  publisherID: number;
  status: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Export empty array since we're using API
export const DUMMY_PRODUCTS: ProductData[] = [];

export interface ProductFeature {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  textBgColor: string;
  isImageRight: boolean;
  isFirstBlock?: boolean;
}