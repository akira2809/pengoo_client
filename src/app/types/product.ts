export interface ProductImage {
  id: number;
  url: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductFeature {
  id: number;
  name: string;
  description: string;
  image: string;
  title: string;
  content: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  product_price: number;
  product_name: string;
  image: string;
  image_url: string;
  images: ProductImage[];
  category: string;
  category_ID: number;
  publisher_ID: number;
  status: string;
  discount: number;
  quantity_stock: number;
  quantity_sold: number;
  rating: number;
  reviews: number;
  features: ProductFeature[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  tag_ID: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  product_price: number;
  product_name: string;
  image: string;
  image_url: string;
  images: ProductImage[];
  category: string;
  category_ID: number | ProductCategory;
  publisher_ID: number;
  status: string | number;
  discount: number;
  quantity_stock: number;
  quantity_sold: number;
  rating: number;
  reviews: number;
  features: string[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  tag_ID: number;
  // Add index signature for dynamic properties
  [key: string]: unknown;
}
