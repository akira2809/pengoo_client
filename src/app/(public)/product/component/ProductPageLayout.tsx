// src/components/layouts/ProductPageLayout.tsx
"use client";

import React, { useState, Fragment, useMemo } from 'react';
import { ProductData } from '@/app/api/data/product';
import { ProductCard } from '@/components/common/ProductCard';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { MobileFilterModal } from '@/components/common/MobileFilterModal';
import { Listbox, Transition, Switch } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5'; // Icon filter

interface ProductPageLayoutProps {
  products: ProductData[];
}

const sortOptions = [
  { id: 1, name: 'Thứ tự mặc định', value: 'default' },
  { id: 2, name: 'Thứ tự bằng chữ cái (A-Z)', value: 'az' },
  { id: 3, name: 'Thứ tự bằng chữ cái (Z-A)', value: 'za' },
  { id: 4, name: 'Giá: Thấp đến Cao', value: 'price_asc' },
  { id: 5, name: 'Giá: Cao đến Thấp', value: 'price_desc' },
];

const productCategories = [
  { id: 1, name: 'Board Games', value: 'board_games' },
  { id: 2, name: 'Drink Games', value: 'drink_games' },
  { id: 3, name: 'Accessories', value: 'accessories' },
];

export const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({ products }) => {
  const [sortSelected, setSortSelected] = useState(sortOptions[0]);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = [...products];

    if (selectedCategories.length > 0) {
      currentProducts = currentProducts.filter(product =>
        product.category && selectedCategories.includes(product.category)
      );
    }

    if (!showOutOfStock) {
      currentProducts = currentProducts.filter(product => !product.isOutOfStock);
    }

    currentProducts = currentProducts.filter(product =>
      product.discountedPrice >= priceRange.min && product.discountedPrice <= priceRange.max
    );

    currentProducts.sort((a, b) => {
      if (sortSelected.value === 'az') {
        return a.name.localeCompare(b.name);
      }
      if (sortSelected.value === 'za') {
        return b.name.localeCompare(a.name);
      }
      if (sortSelected.value === 'price_asc') {
        return a.discountedPrice - b.discountedPrice;
      }
      if (sortSelected.value === 'price_desc') {
        return b.discountedPrice - a.discountedPrice;
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

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
  };

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">Không tìm thấy sản phẩm nào.</p>
            )}
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
     {/* Mobile Filter Modal */}
     <MobileFilterModal isOpen={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)}>
        {/* Nội dung filter tương tự như sidebar */}
        <div className="mb-6">
             {/* Sắp xếp - ĐÃ DI CHUYỂN VÀO TRONG MODAL CHO MOBILE */}
        <div> {/* Dùng div để tạo khoảng cách và cấu trúc */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sắp xếp</h3>
          <Listbox value={sortSelected} onChange={setSortSelected}>
            {({ open }) => (
              <div className="relative w-full min-w-[200px]"> {/* Không cần sm:w-auto ở đây vì đã trong modal */}
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

        <div className="mb-6"> {/* Thêm mb-6 để tạo khoảng cách */}
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

       
      </MobileFilterModal>
    </div>
  );
};