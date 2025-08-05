'use client';

import { useEffect, useState, MouseEvent, ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { wishlistService } from '@/app/api/services/wishlistService';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useCartStore } from '@/app/stores/slice/cartStore';
import { ProductPagination } from "@/app/(public)/products/component/layouts/product/ProductPagination";
// import { showSuccessToast, showErrorToast } from '@/components/common/UI/toastHelper';
// import { confirmRemoveAll, confirmRemoveSelected } from '@/components/common/UI/confirmDialog';

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

// --- Helper Icons ---
const TrashIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);
const CartIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);
const BrokenHeartIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.1 18.55l-.1.1-.11-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" /><path d="M16 13l-4 4-4-4" /></svg>
);

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
          (res.data ?? []).map((item: {
            id: number;
            product_id?: number;
            product_name?: string;
            product_price?: number;
            images?: Array<{ url: string }>;
            quantity_stock?: number;
            rating?: number;
            reviewCount?: number;
            slug?: string;
            meta_description?: string;
            discount?: number;
            product?: {
              id: number;
              product_name: string;
              product_price: number;
              images?: Array<{ url: string }>;
              quantity_stock: number;
              rating: number;
              reviewCount: number;
              slug?: string;
              meta_description?: string;
              discount?: number;
            };
          }) => ({
            id: item.id,
            product: item.product ? {
              ...item.product,
              product_price: Number(item.product.product_price),
              image: item.product.images?.[0]?.url || '',
            } : {
              id: item.product_id ?? item.id,
              product_name: item.product_name || '',
              product_price: Number(item.product_price || 0),
              image: item.images?.[0]?.url || '',
              quantity_stock: item.quantity_stock || 0,
              rating: item.rating || 0,
              reviewCount: item.reviewCount || 0,
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

    try {
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
      // showSuccessToast('Đã xoá các sản phẩm đã chọn khỏi danh sách yêu thích!');
    } catch (error: unknown) {
      console.error('Error removing selected items:', error);
      // showErrorToast('Có lỗi xảy ra khi xoá sản phẩm đã chọn.');
    }
  };

  // Remove all items functionality has been removed as it's not being used
  // and was causing ESLint warnings

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

    // Toast notification is commented out as the import is not available
    // showSuccessToast(`Đã thêm "${product.product_name}" vào giỏ hàng!`);
  };

  if (!user?.id) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-semibold text-gray-900">Vui lòng đăng nhập</h3>
        <p className="mt-2 text-gray-600">Bạn cần đăng nhập để xem danh sách yêu thích của mình.</p>
        <Link href="/login" className="mt-6 inline-block bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
          Đăng nhập
        </Link>
      </div>
    );
  }
  if (loading) return <div className="text-center py-16 text-gray-600">Đang tải...</div>;
  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm max-w-2xl mx-auto mt-10">
        <BrokenHeartIcon className="mx-auto text-red-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Danh sách yêu thích trống</h3>
        <p className="mt-2 text-gray-600">Hãy thêm những sản phẩm bạn yêu vào đây nhé!</p>
        <Link href="/" className="mt-6 inline-block bg-gray-200 text-white font-medium py-2 px-6 rounded-lg hover:bg-background-800 transition-colors">
          Bắt đầu mua sắm
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
              <TrashIcon /> Xóa đã chọn
            </button>
          )}
          {/* {wishlist.length > 0 && (
            <button onClick={removeAllItems} className="text-sm text-red-600 hover:text-red-800 flex items-center">
              Xoá tất cả
            </button>
          )} */}
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
                      disabled={!product.quantity_stock || product.quantity_stock <= 0}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-md hover:bg-background-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <CartIcon />
                      <span>Thêm vào giỏ</span>
                    </button>

                    <button
                      onClick={() => handleRemove(product.id)}
                      className="flex items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                      aria-label="Xóa"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Pagination --- */}
      {wishlist.length > itemsPerPage && (
        <div className="mt-8">
          <ProductPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={wishlist.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}