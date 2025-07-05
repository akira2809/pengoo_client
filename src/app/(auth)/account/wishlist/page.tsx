'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { wishlistService } from '@/app/api/services/wishlistService';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { ProductData } from '@/app/type/product';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState<ProductData[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await wishlistService.getWishlist(user.id);
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách yêu thích.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user?.id]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map((item) => item.id.toString()));
    }
  };

  const removeSelectedItems = async () => {
    if (!user?.id || selectedItems.length === 0) return;
    if (!confirm('Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?')) return;

    await Promise.all(
      selectedItems.map((id) =>
        wishlistService.removeFromWishlist(user.id, Number(id))
      )
    );

    setWishlist(wishlist.filter((item) => !selectedItems.includes(item.id.toString())));
    setSelectedItems([]);
  };

  const handleRemoveSingle = async (id: string | number) => {
    if (!user?.id) return;
    await wishlistService.removeFromWishlist(user.id, Number(id));
    setWishlist(wishlist.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((i) => i !== id.toString()));
  };

  const moveToCart = (productId: string | number) => {
    alert(`Đã thêm sản phẩm vào giỏ hàng (ID: ${productId})`);
  };

  if (!user?.id) {
    return <div className="text-center py-16 text-red-600">Bạn chưa đăng nhập.</div>;
  }

  if (loading) {
    return <div className="text-center py-16 text-gray-600">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
        <div className="text-sm text-gray-600 mt-2 md:mt-0">
          {wishlist.length} sản phẩm
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Danh sách yêu thích của bạn trống.</p>
          <Link href="/" className="text-primary-600 underline">
            Quay lại trang mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={selectedItems.length === wishlist.length && wishlist.length > 0}
                onChange={selectAllItems}
                className="mr-2"
              />
              Chọn tất cả ({selectedItems.length})
            </label>
            {selectedItems.length > 0 && (
              <button onClick={removeSelectedItems} className="text-red-600 text-sm">
                Xóa đã chọn
              </button>
            )}
          </div>

          <div className="space-y-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row items-start md:items-center border-b pb-4"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product.id.toString())}
                  onChange={() => toggleSelectItem(product.id.toString())}
                  className="mr-2 mt-2"
                />
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.product_name || 'Sản phẩm'}
                    width={100}
                    height={100}
                    className="rounded object-cover mr-4"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center text-xs text-gray-500 mr-4">
                    No image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-base font-medium">{product.product_name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.quantity_stock ? 'Còn hàng' : 'Hết hàng'}
                  </p>
                  <div className="text-base text-gray-800 mt-1">
                    {product.price?.toLocaleString() ?? 0}đ{' '}
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {product.originalPrice?.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col gap-2">
                  <button
                    className="text-sm text-white bg-primary-600 hover:bg-primary-700 px-4 py-1 rounded"
                    disabled={!product.inStock}
                    onClick={() => moveToCart(product.id)}
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    className="text-sm text-gray-600 hover:text-red-600"
                    onClick={() => handleRemoveSingle(product.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
