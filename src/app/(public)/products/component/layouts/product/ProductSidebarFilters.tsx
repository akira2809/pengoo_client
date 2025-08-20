// src/components/product/filters/ProductSidebarFilters.tsx
import React, { Dispatch, SetStateAction } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { IoOptionsOutline } from "react-icons/io5";
import { TagFilter } from "./TagFilter";
import { StatusFilter } from "./StatusFilter";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface DisplayRange {
  min: string;
  max: string;
}

interface Tag {
  id: string;
  name: string;
  type: string;
}

interface ProductSidebarFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  priceRange: PriceRange;
  displayRange: DisplayRange;
  showOutOfStock: boolean;
  handlePriceChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => void;
  handleFocus: (
    e: React.FocusEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => void;
  handleBlur: (type: "min" | "max") => void;
  setShowOutOfStock: Dispatch<SetStateAction<boolean>>;
  formatPrice: (price: number | string) => string;
  tags: Tag[];
  selectedTags: string[];
  onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: string[];
  onStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
  isAnyFilterActive: boolean;
}

export const ProductSidebarFilters: React.FC<ProductSidebarFiltersProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  displayRange,
  showOutOfStock,
  handlePriceChange,
  handleFocus,
  handleBlur,
  setShowOutOfStock,
  formatPrice,
  tags,
  selectedTags,
  onTagChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  isAnyFilterActive,
}) => {
  return (
    <aside
      className="hidden lg:block w-full lg:w-1/4 mb-8 lg:mb-0 bg-gray-50 p-6 rounded-lg shadow-sm
                      lg:sticky lg:top-8 lg:self-start lg:h-fit max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <div className="flex items-center space-x-2 mb-6">
        <IoOptionsOutline className="text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">Lọc Sản Phẩm</h2>
      </div>
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
      />
      <TagFilter
        tags={tags || []}
        selectedTags={selectedTags}
        onTagChange={onTagChange}
      />
      <StatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
      />
      <PriceRangeFilter
        priceRange={priceRange}
        displayRange={displayRange}
        showOutOfStock={showOutOfStock}
        handlePriceChange={handlePriceChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        setShowOutOfStock={setShowOutOfStock}
        formatPrice={formatPrice}
      />
      {isAnyFilterActive && (
        <button
          onClick={onClearFilters}
          className="w-full mt-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-md"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </aside>
  );
};
