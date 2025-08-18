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
  // Enhanced status debugging
  console.log("ProductGrid - Products:", products);

  // Status analysis for debugging
  interface StatusAnalysisProduct {
    id: number;
    name: string;
    stock: number;
    rawStatus: string | null;
  }

  interface StatusAnalysisItem {
    count: number;
    products: StatusAnalysisProduct[];
    rawStatuses: Set<string>;
  }

  const statusAnalysis = products.reduce<Record<string, StatusAnalysisItem>>((acc, product) => {
    const quantityStock = typeof product.quantity_stock === 'number' ? product.quantity_stock : 0;
    // Get the raw status and normalize it
    const rawStatus = product.status || '';
    const status = String(rawStatus).toLowerCase().trim() || 'undefined';
    
    // Map status values to standardized values
    const statusMap: Record<string, string> = {
      'có sẵn': 'available',
      'có sẵn (số lượng có hạn)': 'available',
      'sắp ra mắt': 'coming soon',
      'sap ra mat': 'coming soon',
      'không khả dụng': 'unavailable',
      'ngừng sản xuất': 'discontinued',
      'ngung san xuat': 'discontinued',
      'hết hàng': 'unavailable',
      'out of stock': 'unavailable'
    };
    
    const normalizedStatus = statusMap[status] || status;

    if (!acc[normalizedStatus]) {
      acc[normalizedStatus] = { 
        count: 0, 
        products: [],
        rawStatuses: new Set<string>()
      };
    }
    
    acc[normalizedStatus].count++;
    acc[normalizedStatus].products.push({
id: product.id,
      name: product.product_name || 'Unnamed Product',
      stock: quantityStock,
      rawStatus: rawStatus || null
    });
    
    if (rawStatus) {
      acc[normalizedStatus].rawStatuses.add(rawStatus);
    }
    
    return acc;
  }, {});

  // Convert Sets to arrays for better console logging
  const statusAnalysisForLog = Object.entries(statusAnalysis).reduce<Record<string, {
    count: number;
    rawStatuses: string[];
    products: Array<{ id: number; name: string; stock: number }>;
    totalProducts: number;
  }>>((acc, [status, data]) => {
    acc[status] = {
      count: data.count,
      rawStatuses: Array.from(data.rawStatuses),
      products: data.products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock
      })),
      totalProducts: data.products.length
    };
    return acc;
  }, {});

  console.group('ProductGrid - Status Analysis');
  console.log('All status variants:', statusAnalysisForLog);
  console.log('Products with undefined/null status:', 
    products.filter(p => !p.status).map(p => ({ 
      id: p.id, 
      name: p.product_name || 'Unnamed Product',
      stock: typeof p.quantity_stock === 'number' ? p.quantity_stock : 0
    }))
  );
  console.groupEnd();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.length > 0 ? (
        products.map((product) => {
          const status =
            product.status?.toString().toLowerCase().trim() || "undefined";
          const stock = Number(product.quantity_stock) || 0;

          console.log("ProductGrid - Individual Product Status:", {
            id: product.id,
            name: product.product_name?.substring(0, 30) + "...",
            status: status,
            statusType: typeof product.status,
            rawStatus: JSON.stringify(product.status),
            stock: stock,
            isPurchasable: status === "available" && stock > 0,
          });

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

            {/* Status debugging info when no products found */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="font-medium text-gray-800 mb-2">
                Phân tích trạng thái sản phẩm:
              </p>
              <div className="text-xs space-y-1">
                <div className="text-blue-600">
                  🔍 Kiểm tra console để xem chi tiết status của từng sản phẩm
                </div>
                <div className="text-amber-600">
                  ⚠️ Có thể sản phẩm bị lọc do trạng thái không phù hợp
                </div>
                <div className="text-green-600">
                  ✅ Status hợp lệ: &quot;available&quot;, &quot;unavailable&quot;, &quot;coming soon&quot;,
                  &quot;discontinued&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
