// src/app/(auth)/account/wishlist/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
};

export default function WishlistPage() {
  // Dữ liệu sản phẩm yêu thích tạm
  const [wishlist, setWishlist] = useState<Product[]>([
    {
      id: '1',
      name: 'Áo thun nam cổ tròn chất liệu cotton 100%',
      price: 249000,
      originalPrice: 299000,
      image: '/placeholder-product.jpg',
      inStock: true,
      rating: 4.5,
      reviewCount: 128,
    },
    {
      id: '2',
      name: 'Quần jean nam ống đứng form slim fit',
      price: 499000,
      originalPrice: 599000,
      image: '/placeholder-product.jpg',
      inStock: true,
      rating: 4.8,
      reviewCount: 256,
    },
    {
      id: '3',
      name: 'Giày thể thao đế cao su chống trượt',
      price: 799000,
      image: '/placeholder-product.jpg',
      inStock: false,
      rating: 4.2,
      reviewCount: 89,
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map(item => item.id));
    }
  };

  const removeSelectedItems = () => {
    if (selectedItems.length === 0) return;
    if (!confirm('Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?')) return;
    
    setWishlist(wishlist.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const moveToCart = (productId: string) => {
    // Logic thêm vào giỏ hàng
    alert(`Đã thêm sản phẩm vào giỏ hàng (ID: ${productId})`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <span className="text-sm text-gray-600">
            {wishlist.length} sản phẩm
          </span>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Danh sách yêu thích trống
          </h3>
          <p className="text-gray-500 mb-6">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selectAll"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={selectedItems.length === wishlist.length && wishlist.length > 0}
                onChange={selectAllItems}
              />
              <label
                htmlFor="selectAll"
                className="ml-2 text-sm text-gray-700"
              >
                Chọn tất cả ({selectedItems.length})
              </label>
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={removeSelectedItems}
                className="text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                Xóa đã chọn
              </button>
            )}
          </div>

          <div className="border-t border-gray-200">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row items-start md:items-center py-6 border-b border-gray-200"
              >
                <div className="flex items-start w-full">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product.id)}
                      onChange={() => toggleSelectItem(product.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-6 md:mt-0"
                    />
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          <Link href={`/products/${product.id}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <div className="mt-1 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            ({product.reviewCount} đánh giá)
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 md:mt-0 text-right">
                        <div className="text-base font-medium text-gray-900">
                          {product.price.toLocaleString()}đ
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {product.originalPrice.toLocaleString()}đ
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-sm mt-1 ${
                            product.inStock ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => moveToCart(product.id)}
                        className={`flex-1 bg-primary-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                          !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Thêm vào giỏ hàng
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWishlist(
                            wishlist.filter((item) => item.id !== product.id)
                          );
                        }}
                        className="flex-1 bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Tiếp tục mua sắm
            </Link>
            {wishlist.length > 0 && (
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-gray-700">
                  Đã chọn <span className="font-medium">{selectedItems.length}</span> sản phẩm
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}