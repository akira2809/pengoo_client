// types/product.d.ts

export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  oldPrice: number | null;
  discountDays: number | null;
  description?: string; // Thêm mô tả cho trang chi tiết sản phẩm
}