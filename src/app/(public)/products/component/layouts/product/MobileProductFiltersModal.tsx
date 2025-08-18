// src/components/product/MobileProductFiltersModal.tsx
import React, { Dispatch, Fragment, SetStateAction } from 'react';
import { MobileFilterModal } from '@/components/common/MobileFilterModal'; // Đảm bảo đường dẫn đúng
import { Listbox, Transition, Switch } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { FilterDropdown } from '@/components/common/FilterDropdown'; // Đảm bảo đường dẫn đúng
import { StatusFilter } from './StatusFilter';

interface SortOption {
  id: number;
  name: string;
  value: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}
interface Tag {
  id: string;
  name: string;
  type: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface MobileProductFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortOptions: SortOption[];
  sortSelected: SortOption;
  setSortSelected: Dispatch<SetStateAction<SortOption>>;
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tags: Tag[];
  selectedTags: string[];
  onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: string[];
  onStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  priceRange: PriceRange;
  displayRange: { min: string; max: string; }; // Display range for inputs
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => void;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>, type: 'min' | 'max') => void;
  handleBlur: (type: 'min' | 'max') => void;
  showOutOfStock: boolean;
  setShowOutOfStock: Dispatch<SetStateAction<boolean>>;
  formatPrice: (price: number | string) => string;
}

export const MobileProductFiltersModal: React.FC<MobileProductFiltersModalProps> = ({
  isOpen,
  onClose,
  sortOptions,
  sortSelected,
  setSortSelected,
  categories,
  selectedCategories,
  onCategoryChange,
  tags,
  selectedTags, 
  onTagChange,
  selectedStatus,
  onStatusChange,
  priceRange,
  displayRange,
  handlePriceChange,
  handleFocus,
  handleBlur,
  showOutOfStock,
  setShowOutOfStock,
  formatPrice,
}) => {
  return (
    <MobileFilterModal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sắp xếp</h3>
          <Listbox value={sortSelected} onChange={setSortSelected}>
            {({ open }) => (
              <div className="relative w-full min-w-[200px]">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-background-500 sm:text-sm">
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
                            active ? 'bg-background-100 text-background-900' : 'text-gray-900'
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
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-background-600">
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

        <div className="mb-2">
          {/* Tái sử dụng CategoryFilter */}
          <FilterDropdown title="Danh mục" initialOpen={false}>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.id} className="flex items-center text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    value={String(category.id)}
                    checked={selectedCategories.includes(String(category.id))}
                    onChange={onCategoryChange}
                    className="form-checkbox h-4 w-4 text-text-900 rounded focus:ring-text-900"
                  />
                  <span className="ml-2 text-base">{category.name}</span>
                </label>
              ))}
            </div>
          </FilterDropdown>
        </div>

        <div className="mb-6">
          <FilterDropdown title="Tags" initialOpen={false}>
            <div className="space-y-6">
              {/* Thể loại */}
              {tags.some(tag => tag.type === 'genre') && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600">Thể loại</p>
                  {tags
                    .filter(tag => tag.type === 'genre')
                    .map(tag => (
                      <label key={tag.id} className="flex items-center text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          value={String(tag.id)}
                          checked={selectedTags.includes(String(tag.id))}
                          onChange={onTagChange}
                          className="form-checkbox h-4 w-4 text-text-900 rounded focus:ring-text-900"
                        />
                        <span className="ml-2 text-base">{tag.name}</span>
                      </label>
                    ))}
                </div>
              )}

              {/* Độ tuổi */}
              {tags.some(tag => tag.type === 'age') && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600">Độ tuổi</p>
                  {tags
                    .filter(tag => tag.type === 'age')
                    .map(tag => (
                      <label key={tag.id} className="flex items-center text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          value={String(tag.id)}
                          checked={selectedTags.includes(String(tag.id))}
                          onChange={onTagChange}
                          className="form-checkbox h-4 w-4 text-text-900 rounded focus:ring-text-900"
                        />
                        <span className="ml-2 text-base">{tag.name}</span>
                      </label>
                    ))}
                </div>
              )}

              {/* Tag khác */}
              {tags.some(tag => tag.type !== 'genre' && tag.type !== 'age') && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600">Khác</p>
                  {tags
                    .filter(tag => tag.type !== 'genre' && tag.type !== 'age')
                    .map(tag => (
                      <label key={tag.id} className="flex items-center text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          value={String(tag.id)}
                          checked={selectedTags.includes(String(tag.id))}
                          onChange={onTagChange}
                          className="form-checkbox h-4 w-4 text-text-900 rounded focus:ring-text-900"
                        />
                        <span className="ml-2 text-base">{tag.name}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>
          </FilterDropdown>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={onStatusChange}
          />
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          {/* Tái sử dụng logic của PriceRangeFilter, nhưng UI có thể khác một chút do MobileFilterModal */}
          <FilterDropdown title="Giá" initialOpen={false}>
            <div className="text-gray-700 text-base">
              <p>Khoảng giá: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <input
                  type="number"
                  placeholder="Từ"
                  min="0"
                  value={displayRange.min || priceRange.min}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  onFocus={(e) => handleFocus(e, 'min')}
                  onBlur={() => handleBlur('min')}
                  className="w-5/12 p-2 border border-gray-300 rounded-md focus:ring-background-500 focus:border-background-500"
                />
                <span className="mx-1">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  min={priceRange.min}
                  value={displayRange.max || priceRange.max}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  onFocus={(e) => handleFocus(e, 'max')}
                  onBlur={() => handleBlur('max')}
                  className="w-5/12 p-2 border border-gray-300 rounded-md focus:ring-background-500 focus:border-background-500"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">Hiển thị hết hàng</span>
                <Switch
                  checked={showOutOfStock}
                  onChange={(checked) => setShowOutOfStock(checked)}
                  className={`${
                    showOutOfStock ? 'bg-background-800' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-background-500 focus:ring-offset-2`}
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
  );
};