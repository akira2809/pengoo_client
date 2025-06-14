// src/types/product.ts
export interface ProductImage {
  src: string;
  alt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface ProductFeature {
  id: number;
  image: string;
  title: string;
  content: string;
}

// src/app/api/data/product.ts
export interface ProductData {
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
  features: ProductFeature[];
  created_at: string;
  updated_at: string;
  warranty?: string;
  shipping_info?: string;
  quantity_stock?: number;
}

// Export empty array since we're using API
export const DUMMY_PRODUCTS: ProductData[] = [];

export interface ProductFeatureUI {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  textBgColor: string;
  isImageRight: boolean;
  isFirstBlock?: boolean;
}