// src/components/product/ProductGrid.tsx
import React from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductData, Category, Publisher } from "@/app/type/product";

// Define the image type for our component
interface ProductImage {
  id: number;
  url: string;
  name?: string;
  ord?: number;
}

// Extend the ProductData interface to include additional properties
interface ExtendedProductData extends Omit<ProductData, 'images' | 'category_ID' | 'publisher_ID'> {
  images: ProductImage[];
  meta_description: string;
  quantity_sold: number;
  discount: number;
  quantity_stock: number;
  category_ID: number;
  publisher_ID: number;
  image_url: string; // Ensure image_url is included
}

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.length > 0 ? (
        products.map((product) => {
          // Process product images
          type ImageInput = string | { id?: unknown; url?: string; src?: string; name?: string; ord?: unknown } | null;
          
          const processImages = (images: unknown): ProductImage[] => {
            if (!Array.isArray(images)) return [];
            
            return (images as ImageInput[])
              .filter((img): img is Exclude<ImageInput, null> => img !== null && img !== undefined)
              .map((img, index): ProductImage | null => {
                try {
                  // Handle string URLs
                  if (typeof img === 'string') {
                    return {
                      id: index,
                      url: img,
                      name: index === 0 ? 'main' : '',
                      ord: index
                    };
                  }
                  
                  // Handle image objects
                  if (typeof img === 'object' && img !== null) {
                    // Handle case where img might be an object with url or src property
                    const url = 'url' in img ? String(img.url) : 
                              'src' in img ? String(img.src) : '';
                    
                    if (!url) return null;
                    
                    return {
                      id: 'id' in img ? Number(img.id) : index,
                      url: url,
                      name: 'name' in img ? String(img.name) : (index === 0 ? 'main' : ''),
                      ord: 'ord' in img ? Number(img.ord) : index
                    };
                  }
                } catch (error) {
                  console.error('Error processing image:', img, error);
                }
                return null;
              })
              .filter((img): img is ProductImage => img !== null && Boolean(img?.url));
          };
          
          const processedImages = processImages(product.images || []);
          
          // Get the primary image URL, either from the first image in the array or from image_url
          // If no images are available, use a fallback image
          const getFallbackImage = (productName: string) => {
            // Create a simple fallback image with the first letter of the product name
            const firstLetter = productName?.charAt(0)?.toUpperCase() || 'P';
            const colors = [
              'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 
              'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return `data:image/svg+xml,${encodeURIComponent(
              `<svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6" />
                <rect width="100%" height="100%" fill="${color.replace('bg-', '').replace('-500', '')}" opacity="0.5" />
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="80" 
                      text-anchor="middle" dominant-baseline="middle" fill="#ffffff">
                  ${firstLetter}
                </text>
              </svg>`
            )}`;
          };
          
          const primaryImageUrl = processedImages[0]?.url || 
                                (typeof product.image_url === 'string' && product.image_url ? 
                                  product.image_url : 
                                  getFallbackImage(product.product_name));
          
          // Prepare product data for ProductCard
          const productData: ExtendedProductData = {
            ...product,
            id: Number(product.id) || 0,
            product_price: Number(product.product_price) || 0,
            product_name: product.product_name || 'Sản phẩm không có tên',
            image_url: primaryImageUrl,
            slug: product.slug || String(product.id || ''),
            status: product.status || 'active',
            discount: Number(product.discount) || 0,
            quantity_stock: Number(product.quantity_stock) || 0,
            images: processedImages,
            quantity_sold: Number(product.quantity_sold) || 0,
            meta_description: product.meta_description || '',
            description: product.description || '',
            meta_title: product.meta_title || product.product_name || '',
            category_ID: (() => {
              if (!product.category_ID) return 0;
              if (typeof product.category_ID === 'object' && product.category_ID !== null) {
                return Number((product.category_ID as Category).id) || 0;
              }
              return Number(product.category_ID) || 0;
            })(),
            publisher_ID: (() => {
              if (!product.publisher_ID) return 0;
              if (typeof product.publisher_ID === 'object' && product.publisher_ID !== null) {
                return Number((product.publisher_ID as Publisher).id) || 0;
              }
              return Number(product.publisher_ID) || 0;
            })(),
            tags: Array.isArray(product.tags) ? product.tags : [],
            features: Array.isArray(product.features) ? product.features : [],
            created_at: product.created_at || new Date().toISOString(),
            updated_at: product.updated_at || new Date().toISOString()
          };
          
          return (
            <div key={product.id} className="w-full group">
              <ProductCard product={productData} />
            </div>
          );
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
