import Image from 'next/image';
import { OrderItemDetail } from '@/app/type/order';
import { formatPrice } from '@/app/utils/formatters';

interface OrderItemListProps {
  items: OrderItemDetail[];
}

export function OrderItemList({ items }: OrderItemListProps) {
  if (!items || items.length === 0) {
    return <p className="py-4 text-center text-gray-500">Không có thông tin sản phẩm.</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, index) => {
        type ProductInfo = {
          product_name?: string;
          images?: { url: string; name?: string }[];
          original_price?: number;
        };

        const product: ProductInfo = (item as { product?: ProductInfo }).product || {};
        const productName = product.product_name || `Mã sản phẩm: ${item.productId}`;
        const productImages = product.images || [];
        let imageUrl = "https://via.placeholder.com/150";
        
        if (Array.isArray(productImages) && productImages.length > 0) {
          const mainImgObj = productImages.find(
            (img) => img.name && img.name.trim().toLowerCase() === "main"
          );
          imageUrl = mainImgObj?.url || productImages[0].url || imageUrl;
        }
        
        const itemTotal = item.price * item.quantity;
        
        return (
          <div key={`${item.productId}-${index}`} className="flex items-center space-x-4 py-3">
            <Image
              src={imageUrl}
              alt={productName}
              width={80}
              height={80}
              className="h-20 w-20 rounded-md object-cover bg-gray-100"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{productName}</h4>
              <p className="text-sm text-gray-500">Số lượng: {item.quantity ?? 0}</p>
              <p className="text-sm text-gray-600">
                Đơn giá: {formatPrice(item.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">{formatPrice(itemTotal)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}