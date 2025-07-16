'use client';

import { useEffect, useState, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { wishlistService } from '@/app/api/services/wishlistService';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useCartStore } from '@/app/stores/slice/cartStore';
import toast from 'react-hot-toast';
import { ProductPagination } from "@/app/(public)/products/component/layouts/product/ProductPagination";

type WishlistItem = {
  id: number;
  product: {
    id: number;
    product_name: string;
    product_price: number;
    image?: string;
    quantity_stock: number;
    rating: number;
    reviewCount: number;
    slug?: string;
    meta_description?: string;
    discount?: number;
  };
};

export default function WishlistPage() {
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return;
      try {
        const res = await wishlistService.getWishlist(Number(user.id));
        setWishlist(
          (res.data ?? []).map((item: any) => ({
            id: item.id,
            product: item.product ? {
              ...item.product,
              product_price: Number(item.product.product_price),
              image: item.product.images?.[0]?.url || '',
            } : {
              id: item.product_id ?? item.id,
              product_name: item.product_name,
              product_price: Number(item.product_price),
              image: item.images?.[0]?.url || '',
              quantity_stock: item.quantity_stock,
              rating: item.rating,
              reviewCount: item.reviewCount,
              slug: item.slug,
              meta_description: item.meta_description,
              discount: item.discount,
            }
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user?.id]);

  const calculateFinalPrice = (originalPrice: number, discount?: number) => {
    const validDiscount = discount && discount > 0 ? discount : 0;
    const finalPrice = Math.max(0, originalPrice * (1 - validDiscount / 100));
    return {
      finalPrice,
      discountPercentage: validDiscount,
    };
  };

  const getValidImageUrl = (url: string | undefined | null): string | null => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:image')) return url;
    return `/${url.replace(/^\//, '')}`;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(
      selectedItems.length === wishlist.length ? [] : wishlist.map(i => i.id)
    );
  };

  const removeSelectedItems = async () => {
    if (!user?.id || selectedItems.length === 0) return;
    if (!confirm('Bạn có chắc muốn xoá các sản phẩm đã chọn?')) return;

    await Promise.all(
      selectedItems.map(wishlistId => {
        const item = wishlist.find(i => i.id === wishlistId);
        if (item) {
          return wishlistService.removeFromWishlist(Number(user.id), Number(item.product.id));
        }
        return Promise.resolve();
      })
    );
    setWishlist(wishlist.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const removeAllItems = async () => {
    if (!user?.id || wishlist.length === 0) return;
    if (!confirm('Bạn có chắc muốn xoá tất cả sản phẩm trong danh sách yêu thích?')) return;

    await Promise.all(
      wishlist.map(item =>
        wishlistService.removeFromWishlist(Number(user.id), Number(item.product.id))
      )
    );
    setWishlist([]);
    setSelectedItems([]);
  };

  const handleRemove = async (productId: number) => {
    if (!user?.id) return;
    await wishlistService.removeFromWishlist(Number(user.id), Number(productId));
    setWishlist(prev => prev.filter(item => item.product.id !== productId));
    setSelectedItems(prev => prev.filter(id => {
      const item = wishlist.find(i => i.id === id);
      return item && item.product.id !== productId;
    }));
  };

  const handleAddToCart = (e: MouseEvent, product: WishlistItem['product']) => {
    e.preventDefault();
    e.stopPropagation();

    const { finalPrice } = calculateFinalPrice(product.product_price, product.discount);

    addItem({
      id: product.id,
      product_name: product.product_name,
      product_price: product.product_price,
      quantity: 1,
      image_url: product.image || '',
      slug: product.slug || '',
      description: product.meta_description || '',
      discount: product.discount || 0
    });

    toast.success(`Đã thêm "${product.product_name}" vào giỏ hàng!`, {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#4CAF50",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  if (!user?.id) return <div className="text-center py-16 text-red-600">Bạn chưa đăng nhập.</div>;
  if (loading) return <div className="text-center py-16 text-gray-600">Đang tải...</div>;
  if (wishlist.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Danh sách yêu thích trống</h3>
        <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
        <Link href="/" className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const paginatedWishlist = wishlist.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
        <span className="text-sm text-gray-600">{wishlist.length} sản phẩm</span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedItems.length === wishlist.length}
            onChange={selectAllItems}
            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Chọn tất cả ({selectedItems.length})</label>
        </div>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <button onClick={removeSelectedItems} className="text-sm text-red-600 hover:text-red-800 flex items-center">
              Xoá đã chọn
            </button>
          )}
          {wishlist.length > 0 && (
            <button onClick={removeAllItems} className="text-sm text-red-600 hover:text-red-800 flex items-center">
              Xoá tất cả
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 border-t border-gray-200">
        {paginatedWishlist.map(({ id, product }) => {
          const { finalPrice, discountPercentage } = calculateFinalPrice(product.product_price, product.discount);
          const savedAmount = product.product_price - finalPrice;

          return (
            <div key={id} className="flex flex-col md:flex-row items-start md:items-center py-6 border-b border-gray-200">
              <div className="flex w-full items-start">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(id)}
                  onChange={() => toggleSelectItem(id)}
                  className="h-4 w-4 mt-6 text-primary-600 border-gray-300 rounded"
                />
                <div className="ml-4 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={getValidImageUrl(product.image) || 'https://placehold.co/96x96/e5e7eb/9ca3af?text=No+Image'}
                    alt={product.product_name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://placehold.co/96x96/e5e7eb/9ca3af?text=No+Image';
                    }}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h3 className="text-xl sm:text-lg font-bold text-gray-900 line-clamp-2 first-letter:uppercase">
                        {product.product_name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.meta_description}</p>
                      <p className="text-sm text-gray-500 mt-1">({product.reviewCount || 0} đánh giá)</p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      {discountPercentage > 0 ? (
                        <div className="space-y-1">
                          <div className="text-red-500 font-semibold text-base">{formatPrice(finalPrice)}</div>
                          <div className="text-gray-400 text-sm line-through">{formatPrice(product.product_price)}</div>
                          <div className="text-xs text-green-600">Tiết kiệm: {formatPrice(savedAmount)}</div>
                        </div>
                      ) : (
                        <div className="text-gray-800 font-semibold text-base">{formatPrice(product.product_price)}</div>
                      )}
                      <div className={`text-sm mt-1 ${product.quantity_stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.quantity_stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-4 w-full">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.quantity_stock === 0}
                      className={`w-40 py-2 px-4 text-sm font-medium rounded-md text-white bg-background-900 hover:bg-background-800 ${product.quantity_stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="w-25 py-2 px-4 text-sm font-medium rounded-md text-red-600 border border-gray-400 hover:bg-gray-100"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProductPagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={wishlist.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}