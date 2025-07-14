// src/types/product.ts

export interface ProductImage {
  id: number;
  url: string;
  name?: string;
  folder?: string | null;
  ord?: number | null;
  alt?: string;
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

// CMS Content structure from backend
export interface CmsContent {
  id: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImages?: string[];
  aboutTitle?: string;
  aboutText?: string;
  aboutImages?: string[];
  sliderImages?: string[];
  detailsTitle?: string;
  detailsContent?: string;
  tabs?: { title: string; content: string; images?: string[] }[];
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
  featuredSections?: Array<{
    title: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    textBgColor?: string;
    isImageRight?: boolean;
  }>;
}

export interface ProductData {
  id: number;
  product_name: string;
  description: string;
  product_price: number;
  slug: string;
  status: string;
  image_url: string;
  discount: number;
  meta_title: string;
  meta_description: string;
  quantity_sold: number;
  category_ID: Category | number;
  tag_ID: string | number;
  publisher_ID: Publisher | number;
  tags: string[];
  images: ProductImage[];
  features: ProductFeature[];
  created_at: string;
  updated_at: string;
  warranty?: string;
  shipping_info?: string;
  quantity_stock?: number;
  cmsContent?: CmsContent; // <-- Add this for CMS integration
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