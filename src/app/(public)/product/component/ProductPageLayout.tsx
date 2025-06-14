// src/components/layouts/ProductPageLayout.tsx
"use client";

import React, { useState, Fragment, useMemo } from 'react';
import { ProductData } from '@/app/type/product';
import { ProductCard } from '@/components/common/ProductCard';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { MobileFilterModal } from '@/components/common/MobileFilterModal';
import { Listbox, Transition, Switch } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5'; // Icon filter

interface ProductPageLayoutProps {
  products: ProductData[];
  isLoading?: boolean;
  error?: string | null;
}

const sortOptions = [
  { id: 1, name: 'Thứ tự mặc định', value: 'default' },
  { id: 2, name: 'Thứ tự bằng chữ cái (A-Z)', value: 'az' },
  { id: 3, name: 'Thứ tự bằng chữ cái (Z-A)', value: 'za' },
  { id: 4, name: 'Giá: Thấp đến Cao', value: 'price_asc' },
  { id: 5, name: 'Giá: Cao đến Thấp', value: 'price_desc' },
];

export const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({ products, isLoading, error }) => {
  const [sortSelected, setSortSelected] = useState(sortOptions[0]);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique categories from products
  const productCategories = useMemo(() => {
    const categories = new Map<number, { id: number; name: string }>();
    
    products.forEach(product => {
      if (product.category_ID) {
        const category = typeof product.category_ID === 'object' 
          ? product.category_ID 
          : { id: product.category_ID, name: `Category ${product.category_ID}` };
        categories.set(category.id, category);
      }
    });
    
    return Array.from(categories.values()).map(cat => ({
      id: cat.id,
      name: cat.name,
      value: String(cat.id)
    }));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    console.log('Original products count:', products.length);
    console.log('First few products:', products.slice(0, 3).map(p => ({
      id: p.id,
      name: p.product_name,
      price: p.product_price,
      category: p.category_ID,
      stock: p.quantity_stock
    })));
    
    let currentProducts = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      const beforeCount = currentProducts.length;
      currentProducts = currentProducts.filter(product => {
        const categoryId = typeof product.category_ID === 'object' 
          ? String(product.category_ID.id) 
          : String(product.category_ID);
        return selectedCategories.includes(categoryId);
      });
      console.log(`After category filter (${selectedCategories.join(',')}): ${beforeCount} -> ${currentProducts.length}`);
    }

    // Filter out of stock if needed
    if (!showOutOfStock) {
      const beforeCount = currentProducts.length;
      currentProducts = currentProducts.filter(product => {
        const stock = product.quantity_stock ?? 0;
        return stock > 0;
      });
      console.log(`After out-of-stock filter: ${beforeCount} -> ${currentProducts.length}`);
    }

    // Filter by price range
    const beforeCount = currentProducts.length;
    currentProducts = currentProducts.filter(product => {
      const price = Number(product.product_price) || 0;
      const inRange = price >= priceRange.min && price <= priceRange.max;
      if (!inRange) {
        console.log(`Product ${product.id} (${product.product_name}) price ${price} is outside range ${priceRange.min}-${priceRange.max}`);
      }
      return inRange;
    });
    console.log(`After price range filter (${priceRange.min} - ${priceRange.max}): ${beforeCount} -> ${currentProducts.length}`);

    // Sort products
    currentProducts.sort((a, b) => {
      const priceA = Number(a.product_price) || 0;
      const priceB = Number(b.product_price) || 0;
      
      if (sortSelected.value === 'az') {
        return a.product_name.localeCompare(b.product_name);
      }
      if (sortSelected.value === 'za') {
        return b.product_name.localeCompare(a.product_name);
      }
      if (sortSelected.value === 'price_asc') {
        return priceA - priceB;
      }
      if (sortSelected.value === 'price_desc') {
        return priceB - priceA;
      }
      return 0;
    });

    return currentProducts;
  }, [products, sortSelected, showOutOfStock, selectedCategories, priceRange]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedCategories(prev =>
      checked ? [...prev, value] : prev.filter(cat => cat !== value)
    );
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-48 w-full bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 w-full mt-2 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 bg-white">
      <div className="flex flex-col lg:flex-row lg:space-x-8">

        {/* Sidebar lọc - CHỈ HIỂN THỊ TRÊN MÀN HÌNH LỚN */}
        <aside className="hidden lg:block w-full lg:w-1/4 mb-8 lg:mb-0 bg-gray-50 p-6 rounded-lg shadow-sm
                          lg:sticky lg:top-8 lg:self-start lg:h-fit max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lọc Sản Phẩm</h2>

          <FilterDropdown title="Sản phẩm">
            <div className="space-y-2">
              {productCategories.map(category => (
                <label key={category.id} className="flex items-center text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    value={category.value}
                    checked={selectedCategories.includes(category.value)}
                    onChange={handleCategoryChange}
                    className="form-checkbox h-4 w-4 text-amber-800 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-base">{category.name}</span>
                </label>
              ))}
            </div>
          </FilterDropdown>

          <FilterDropdown title="Giá">
            <div className="text-gray-700 text-base">
              <p>Khoảng giá: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-5/12 p-2 border border-gray-300 rounded-md"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-5/12 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">Hiển thị hết hàng</span>
                <Switch
                  checked={showOutOfStock}
                  onChange={setShowOutOfStock}
                  className={`${
                    showOutOfStock ? 'bg-amber-800' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      showOutOfStock ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </FilterDropdown>
        </aside>

        {/* Khu vực hiển thị sản phẩm */}
        <main className="w-full lg:w-3/4">
          <div className="flex justify-end items-center mb-6">
            {/* Dropdown sắp xếp - Vẫn giữ nguyên */}
            <Listbox value={sortSelected} onChange={setSortSelected}>
              {({ open }) => (
                <div className="relative w-full sm:w-auto min-w-[200px]">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm">
                    <span className="block truncate">{sortSelected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <FaChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {sortOptions.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                            }`
                          }
                          value={option}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {option.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <FaCheck className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div className="w-full">
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Đang hiển thị {filteredAndSortedProducts.length} sản phẩm (Tổng: {products.length})
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={{
                      ...product,
                      id: Number(product.id),
                      product_price: Number(product.product_price) || 0,
                      product_name: product.product_name,
                      image_url: product.image_url,
                      slug: product.slug || String(product.id),
                      status: product.status,
                      discount: product.discount || 0,
                      quantity_stock: product.quantity_stock || 0,
                      images: Array.isArray(product.images) ? product.images : []
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center space-y-4 py-12">
                  <p className="text-xl text-gray-600">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange({ min: 0, max: 5000000 });
                      setShowOutOfStock(true);
                    }}
                    className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left text-sm text-gray-600">
                    <p className="font-medium mb-2">Thông tin gỡ rối:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tổng số sản phẩm: {products.length}</li>
                      <li>Khoảng giá: {priceRange.min} - {priceRange.max} VNĐ</li>
                      <li>Danh mục đã chọn: {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Tất cả'}</li>
                      <li>Hiển thị hết hàng: {showOutOfStock ? 'Có' : 'Không'}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Nút "Filter" Sticky chỉ hiển thị trên mobile */}
      <button
        className="fixed bottom-4 right-4 lg:hidden flex items-center px-5 py-3 bg-amber-800 text-white rounded-full shadow-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 z-40 text-lg"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <IoFilter className="mr-2 text-xl" /> Lọc
      </button>

      {/* Mobile Filter Modal */}
      <MobileFilterModal 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)}
      >
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Sắp xếp</h3>
            <Listbox value={sortSelected} onChange={setSortSelected}>
              {({ open }) => (
                <div className="relative w-full min-w-[200px]">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm">
                    <span className="block truncate">{sortSelected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <FaChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {sortOptions.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                            }`
                          }
                          value={option}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {option.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <FaCheck className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Danh mục</h3>
            <FilterDropdown title="Sản phẩm" initialOpen={true}>
              <div className="space-y-2">
                {productCategories.map(category => (
                  <label key={category.id} className="flex items-center text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      value={category.value}
                      checked={selectedCategories.includes(category.value)}
                      onChange={handleCategoryChange}
                      className="form-checkbox h-4 w-4 text-amber-800 rounded focus:ring-amber-500"
                    />
                    <span className="ml-2 text-base">{category.name}</span>
                  </label>
                ))}
              </div>
            </FilterDropdown>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Giá</h3>
            <FilterDropdown title="Giá" initialOpen={true}>
              <div className="text-gray-700 text-base">
                <p>Khoảng giá: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}</p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-5/12 p-2 border border-gray-300 rounded-md"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-5/12 p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">Hiển thị hết hàng</span>
                  <Switch
                    checked={showOutOfStock}
                    onChange={setShowOutOfStock}
                    className={`${
                      showOutOfStock ? 'bg-amber-800' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        showOutOfStock ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
            </FilterDropdown>
          </div>
        </div>
      </MobileFilterModal>
    </div>
  );
};