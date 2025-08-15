// src/components/product/ProductGrid.tsx
import React from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductData } from "@/app/type/product";

interface ProductGridProps {
  products: ProductData[];
  onClearFilters: () => void;
  priceRange: { min: number; max: number };
  selectedCategories: string[];
  showOutOfStock: boolean;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onClearFilters,
  priceRange,
  selectedCategories,
  showOutOfStock,
  categories,
}) => {
  console.log("ProductGrid - Products:", products);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.length > 0 ? (
        products.map((product) => {
          console.log("ProductGrid - Product images:", product.images);
          return <ProductCard product={product} key={product.id} />;
        })
      ) : (
        <div className="col-span-full text-center space-y-4 py-12 px-4">
          <p className="text-lg sm:text-xl text-gray-600">
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            onClick={onClearFilters}
            className="px-6 py-2.5 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition-colors text-sm sm:text-base"
          >
            Xóa bộ lọc
          </button>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left text-sm text-gray-600 max-w-md mx-auto">
            <p className="font-medium text-gray-800 mb-3">Thông tin gỡ rối:</p>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Khoảng giá:</span>
                <span className="font-medium">
                  {priceRange.min.toLocaleString()} -{" "}
                  {priceRange.max.toLocaleString()} đ
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Danh mục:</span>
                <span className="font-medium text-right">
                  {selectedCategories.length > 0
                    ? categories
                      .filter((cat) => selectedCategories.includes(cat.id))
                      .map((cat) => cat.name)
                      .join(", ")
                    : "Tất cả"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Hiển thị hết hàng:</span>
                <span className="font-medium">
                  {showOutOfStock ? "Có" : "Không"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
