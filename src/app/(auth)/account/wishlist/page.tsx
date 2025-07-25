'use client';

import { useEffect, useState, MouseEvent, ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { wishlistService } from '@/app/api/services/wishlistService';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';
import { useCartStore } from '@/app/stores/slice/cartStore';
import toast from 'react-hot-toast';
import { ProductPagination } from "@/app/(public)/products/component/layouts/product/ProductPagination";

// --- Type Definitions ---
import { ProductData } from '@/app/type/product';

type WishlistItem = {
  id: number;
  product: ProductData;
};

// --- Helper Icons ---
const TrashIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
const CartIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
);
const BrokenHeartIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.1 18.55l-.1.1-.11-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/><path d="M16 13l-4 4-4-4"/></svg>
);


export default function WishlistPage() {
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await wishlistService.getWishlist(Number(user.id));
        // Map API response to WishlistItem array
        const normalizedData = (res.data ?? []).map((product: ProductData): WishlistItem => ({
          id: product.id, // Using product ID as wishlist item ID
          product: {
            ...product,
            // Map any necessary fields that might be named differently
            image_url: product.images?.[0]?.url || product.image_url || '',
          }
        }));
        setWishlist(normalizedData);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        toast.error("Không thể tải danh sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user?.id]);

  // --- Helper Functions ---
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleRemoveItem = async (productId: number) => {
    if (!user?.id) return;
    // Note: In a real app, show a custom modal instead of confirm()
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?')) return;
    try {
        await wishlistService.removeFromWishlist(Number(user.id), productId);
        setWishlist(prev => prev.filter(item => item.product.id !== productId));
        toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích.");
    } catch {
        toast.error("Lỗi khi xóa sản phẩm.");
    }
  };

  const handleRemoveSelected = async () => {
    if (!user?.id || selectedItems.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn?`)) return;

    try {
      const productIdsToRemove = wishlist
        .filter(item => selectedItems.includes(item.id))
        .map(item => item.product.id);

      await Promise.all(
        productIdsToRemove.map(productId => wishlistService.removeFromWishlist(Number(user.id), productId))
      );

      setWishlist(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      toast.success("Đã xóa các sản phẩm đã chọn.");
    } catch {
      toast.error("Lỗi khi xóa các sản phẩm đã chọn.");
    }
  };

  const handleAddToCart = (e: MouseEvent, product: ProductData) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart({
      id: product.id,
      product_name: product.product_name,
      product_price: product.product_price,
      quantity: 1,
      image_url: product.image_url || product.images?.[0]?.url || '',
      slug: product.slug || '',
      description: product.meta_description || '',
      discount: product.discount || 0
    });
    toast.success(`Đã thêm "${product.product_name}" vào giỏ hàng!`);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === paginatedWishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedWishlist.map(i => i.id));
    }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
  
  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm max-w-2xl mx-auto mt-10">
        <BrokenHeartIcon className="mx-auto text-red-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Danh sách yêu thích trống</h3>
        <p className="mt-2 text-gray-600">Hãy thêm những sản phẩm bạn yêu vào đây nhé!</p>
        <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
          Bắt đầu mua sắm
        </Link>
      </div>
    );
  }

  const paginatedWishlist = wishlist.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline pb-4 mb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
          <span className="text-sm text-gray-600 mt-2 sm:mt-0">{wishlist.length} sản phẩm</span>
        </div>

        {/* --- Controls --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="select-all"
              checked={selectedItems.length > 0 && selectedItems.length === paginatedWishlist.length}
              onChange={selectAllItems}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="select-all" className="ml-3 text-sm text-gray-700">
              Chọn tất cả ({selectedItems.length})
            </label>
          </div>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            {selectedItems.length > 0 && (
              <button onClick={handleRemoveSelected} className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium transition-colors">
                <TrashIcon /> Xóa đã chọn
              </button>
            )}
          </div>
        </div>

        {/* --- Wishlist Items --- */}
        <div className="space-y-4">
          {paginatedWishlist.map(({ id, product }) => {
            const { finalPrice, discountPercentage } = calculateFinalPrice(product.product_price, product.discount);
            const isSelected = selectedItems.includes(id);
            return (
              <div key={id} className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-200 flex items-start gap-4 ${isSelected ? 'ring-2 ring-indigo-500' : 'border border-transparent'}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectItem(item.id)}
                  className="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 shrink-0"
                />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={product.image_url || product.images?.[0]?.url || '/images/placeholder.png'}
                    alt={product.product_name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <Link href={`/products/${product.slug || product.id}`} className="hover:underline">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{product.product_name}</h3>
                    </Link>
                    <p className={`mt-1 text-sm ${product.quantity_stock && product.quantity_stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      {product.quantity_stock && product.quantity_stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-indigo-600">{formatPrice(finalPrice)}</span>
                      {discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">{formatPrice(product.product_price)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 sm:mt-0">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.quantity_stock || product.quantity_stock <= 0}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <CartIcon />
                        <span>Thêm vào giỏ</span>
                      </button>
                      <button
                        onClick={() => handleRemoveItem(product.id)}
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
    </div>
  );
}

// Helper function to calculate final price
const calculateFinalPrice = (originalPrice: number, discount?: number) => {
    const validDiscount = discount && discount > 0 ? discount : 0;
    const finalPrice = Math.max(0, originalPrice * (1 - validDiscount / 100));
    return { finalPrice, discountPercentage: validDiscount };
};

