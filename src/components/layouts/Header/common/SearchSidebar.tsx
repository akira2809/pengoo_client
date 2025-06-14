// components/Header/SearchSidebar.tsx
'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { useRouter, useSearchParams } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { useSearchStore } from '@/app/stores/slice/searchStore';
import type { Product } from '@/app/stores/type';
import { Skeleton } from '@/components/common/UI/Skeleton';

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'pages'>('products');

  // Sử dụng search store
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading: isSearching,
    searchProducts: originalSearchProducts,
    clearSearch,
    error,
  } = useSearchStore();

  const searchPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Track search start time
  const searchStartTime = useRef<number>(0);
  const minSearchDuration = 1500; // Minimum duration to show skeleton (1.5s)

  // Debounce search input
  const performSearch = useCallback((query: string) => {
    if (query.trim() === '') {
      clearSearch();
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set the search start time when starting a new search
    searchStartTime.current = Date.now();
    
    debounceTimer.current = setTimeout(() => {
      // Start the search
      originalSearchProducts(query);
      
      // Calculate remaining time to reach minimum duration
      const elapsed = Date.now() - searchStartTime.current;
      const remainingTime = Math.max(0, minSearchDuration - elapsed);
      
      // If we still need to wait to reach min duration
      if (remainingTime > 0) {
        setTimeout(() => {
          // This ensures the loading state is cleared after min duration
          // even if the search completed earlier
          if (isSearching) {
            // Force a re-render to update the loading state
            setSearchQuery(prev => prev + ' ');
            setSearchQuery(prev => prev.trim());
          }
        }, remainingTime);
      }
    }, 300); // Keep a short debounce for typing
  }, [originalSearchProducts, clearSearch, isSearching, setSearchQuery]);

  // Xử lý thay đổi input tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Xử lý submit form tìm kiếm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?name=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  // Tự động focus vào input khi mở sidebar
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Đặt giá trị ban đầu từ URL nếu có
      const query = searchParams.get('name') || '';
      if (query) {
        setSearchQuery(query);
        performSearch(query);
      }
      searchInputRef.current.focus();
    }
  }, [isOpen, searchParams, setSearchQuery, performSearch]);

  // Animation khi mở/đóng sidebar
  useEffect(() => {
    if (!searchPopupRef.current) return;

    if (isOpen) {
      gsap.to(searchPopupRef.current, {
        x: '0%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else {
      gsap.to(searchPopupRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  // Đóng sidebar khi nhấn ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Xử lý click vào kết quả tìm kiếm
  const handleResultClick = (product: Product) => {
    router.push(`/product/${product.slug}`);
    onClose();
  };

  // Animation setup for the new UI
  useEffect(() => {
    if (!searchPopupRef.current) return;

    if (isOpen) {
      gsap.set(searchPopupRef.current, {
        x: '100%',
        display: 'flex',
      });

      gsap.to(searchPopupRef.current, {
        x: '0%',
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(searchPopupRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (searchPopupRef.current) {
            searchPopupRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={searchPopupRef}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      style={{ display: 'none' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Tìm kiếm</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Đóng tìm kiếm"
          type="button"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder={isSearching ? 'Đang tìm kiếm...' : 'Tìm kiếm sản phẩm...'}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Sản phẩm
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'categories'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('categories')}
        >
          Danh mục
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'pages'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('pages')}
        >
          Trang
        </button>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {isSearching ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center p-3">
                <Skeleton variant="image" className="w-16 h-16 rounded-md" />
                <div className="ml-4 space-y-2 flex-1">
                  <Skeleton variant="text" className="h-4 w-3/4" />
                  <Skeleton variant="text" className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {activeTab === 'products' && (
              <div className="space-y-2">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleResultClick(product)}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleResultClick(product);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image_url || '/images/placeholder-product.png'}
                        alt={product.product_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {product.product_name}
                      </h3>
                      <div className="flex items-center space-x-2">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-sm font-medium text-red-600">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(Number(product.discount) || 0)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(product.product_price || 0)}
                          </span>
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                            -{Math.min(99, Math.round((1 - (Number(product.discount) / Number(product.product_price))) * 100))}%
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(product.product_price || 0)}
                        </span>
                      )}
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'categories' && (
              <div className="text-center py-8 text-gray-500">
                Tính năng đang được phát triển
              </div>
            )}
            {activeTab === 'pages' && (
              <div className="text-center py-8 text-gray-500">
                Tính năng đang được phát triển
              </div>
            )}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy kết quả nào cho &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <SearchIcon className="w-12 h-12 mb-4" />
            <p>Nhập từ khóa để tìm kiếm sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
}
