// src/app/type/tags.ts
import { ProductData } from './product'; // Nếu tag có chứa danh sách sản phẩm

export interface TagData {
  id: number;
  name: string;
  slug: string;
  products?: ProductData[];
}

export interface TagFilter {
  id: number;
  name: string;
  slug: string;
  productCount?: number; // Số lượng sản phẩm có trong tag, nếu cần
}

export interface CreateTagDto {
  name: string;
  slug: string;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
}
