// src/app/(public)/products/page.tsx
import React from 'react';
import { ProductPageLayout } from '@/app/(public)/product/component/ProductPageLayout';
import { DUMMY_PRODUCTS } from '@/app/api/data/product'; // Import dữ liệu mẫu

export default function ProductsPage() {
  const products = DUMMY_PRODUCTS; // Sử dụng dữ liệu mẫu

  return (
    <ProductPageLayout products={products} />
  );
}