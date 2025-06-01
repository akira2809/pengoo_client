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

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  originalPrice: number;
  discountedPrice: number; // Giá sau khi giảm giá
  description: string;
  features: string[];
  warranty: string;
  shippingInfo: string;
  images: ProductImage[]; // Mảng các ảnh sản phẩm
  // Thêm các trường bạn có thể cần cho lọc/sắp xếp, ví dụ:
  category?: string; // Để lọc theo danh mục
  isOutOfStock?: boolean; // Trạng thái hết hàng
  discount?: string; // Dùng cho hiển thị text "20% OFF"
}