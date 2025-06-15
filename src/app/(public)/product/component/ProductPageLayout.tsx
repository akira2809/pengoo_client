// src/components/layouts/ProductPageLayout.tsx
"use client";

import React, {
  useState,
  Fragment,
  useMemo,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";
import { ProductData } from "@/app/type/product";
import { ProductPageHeader } from "@/app/(public)/product/component/layouts/product/ProductPageHeader";
import { ProductSidebarFilters } from "@/app/(public)/product/component/layouts/product/ProductSidebarFilters";
import { ProductGrid } from "@/app/(public)/product/component/layouts/product/ProductGrid";
import { ProductPagination } from "@/app/(public)/product/component/layouts/product/ProductPagination";
import { MobileProductFiltersModal } from "@/app/(public)/product/component/layouts/product/MobileProductFiltersModal";
import { IoFilter } from "react-icons/io5"; // Icon filter

interface ProductPageLayoutProps {
  products: ProductData[];
  isLoading?: boolean;
  error?: string | null;
  setFilters: Dispatch<
    SetStateAction<{
      name: string;
      category: string;
      tags: string;
      minPrice: number;
      maxPrice: number;
    }>
  >;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
}

type PriceRange = {
  min: number;
  max: number;
};

type DisplayRange = {
  min: string;
  max: string;
};

const sortOptions = [
  { id: 1, name: "Thứ tự mặc định", value: "default" },
  { id: 2, name: "Thứ tự bằng chữ cái (A-Z)", value: "az" },
  { id: 3, name: "Thứ tự bằng chữ cái (Z-A)", value: "za" },
  { id: 4, name: "Giá: Thấp đến Cao", value: "price_asc" },
  { id: 5, name: "Giá: Cao đến Thấp", value: "price_desc" },
];

export const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  products,
  isLoading,
  error,
  setFilters,
  categories,
}) => {
  const [sortSelected, setSortSelected] = useState(sortOptions[0]);
  const [sortedProducts, setSortedProducts] = useState(products);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 5000000,
  });
  const [displayRange, setDisplayRange] = useState<DisplayRange>({
    min: "",
    max: "",
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(22); // Số sản phẩm mỗi trang

  // --- Handlers for Filters ---
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const categoryId = e.target.value;
  
      setSelectedCategories((prev) => {
        const newSelectedCategories = prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId];
        return newSelectedCategories;
      });
  
      // Move setFilters outside of setSelectedCategories
      const newSelectedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];
      
      setFilters((prevFilters) => ({
        ...prevFilters,
        category: newSelectedCategories.length > 0 ? newSelectedCategories[0] : "",
      }));
    },
    [selectedCategories, setFilters]
  );

  const formatPrice = useCallback((price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("₫", "đ");
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value;

    setDisplayRange(prev => ({
      ...prev,
      [type]: value
    }));

    if (value === '') {
      const newPriceRange = {
        ...priceRange,
        [type]: 0
      };
      setPriceRange(newPriceRange);
      setFilters(prevFilters => ({ // prevFilters ở đây là đúng
        ...prevFilters,
        minPrice: newPriceRange.min,
        maxPrice: newPriceRange.max
      }));
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return;

    const newPriceRange = {
      ...priceRange,
      [type]: numValue
    };

    if (type === 'min' && numValue > priceRange.max) {
      newPriceRange.max = numValue;
      setDisplayRange(prev => ({ ...prev, max: numValue.toString() }));
    } else if (type === 'max' && numValue < priceRange.min) {
      newPriceRange.min = numValue;
      setDisplayRange(prev => ({ ...prev, min: numValue.toString() }));
    }

    setPriceRange(newPriceRange);
    setFilters(prev => ({
      ...prev, // <--- Sửa từ 'prevFilters' thành 'prev' ở đây!
      minPrice: newPriceRange.min,
      maxPrice: newPriceRange.max
    }));
  }, [priceRange, setFilters]);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, type: "min" | "max") => {
      e.target.select();
      if (priceRange[type] === 0) {
        setDisplayRange((prev) => ({
          ...prev,
          [type]: "",
        }));
      }
    },
    [priceRange]
  );

  const handleBlur = useCallback(
    (type: "min" | "max") => {
      if (displayRange[type] === "") {
        setDisplayRange((prev) => ({
          ...prev,
          [type]: priceRange[type].toString(),
        }));
      } else {
        const numValue = Number(displayRange[type]);
        if (!isNaN(numValue) && numValue >= 0) {
          setDisplayRange((prev) => ({
            ...prev,
            [type]: numValue.toString(),
          }));
        }
      }
    },
    [displayRange, priceRange]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 5000000 });
    setDisplayRange({ min: "", max: "" });
    setShowOutOfStock(true);
    setCurrentPage(1);
    setFilters({
      name: "",
      category: "",
      tags: "",
      minPrice: 0,
      maxPrice: 5000000,
    });
    setSortSelected(sortOptions[0]); // Reset sort to default
  }, [setFilters]);

  // --- Effects for Sorting ---
  useEffect(() => {
    const sorted = [...products];
    switch (sortSelected.value) {
      case "az":
        sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case "za":
        sorted.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      case "price_asc":
        sorted.sort((a, b) => a.product_price - b.product_price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.product_price - a.product_price);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  }, [sortSelected, products]);

  // --- NEW useEffect to reset current page when filters/sort change ---
  useEffect(() => {
    // Chỉ reset trang nếu currentProducts thay đổi đáng kể (ngoại trừ việc thay đổi trang)
    // Để tránh vòng lặp, hãy đảm bảo dependencies chỉ là những thứ ảnh hưởng đến filter/sort
    setCurrentPage(1);
  }, [selectedCategories, priceRange, showOutOfStock, sortSelected]); // Dependencies của bộ lọc/sắp xếp

  // --- Memoized Filtered and Sorted Products ---
  // Remove the problematic useEffect and move its logic into the filteredAndSortedProducts useMemo
  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = [...sortedProducts];

    // Filter by category
    if (selectedCategories.length > 0) {
      currentProducts = currentProducts.filter((product) => {
        const categoryId =
          typeof product.category_ID === "object"
            ? String(product.category_ID.id)
            : String(product.category_ID);
        return selectedCategories.includes(categoryId);
      });
    }

    // Filter out of stock if needed
    if (!showOutOfStock) {
      currentProducts = currentProducts.filter((product) => {
        const stock = product.quantity_stock ?? 1;
        return stock > 0;
      });
    }

    // Filter by price range
    currentProducts = currentProducts.filter((product) => {
      const price = Number(product.product_price) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    return currentProducts;
  }, [sortedProducts, showOutOfStock, selectedCategories, priceRange]);

  // Add this new useEffect to handle page reset when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, showOutOfStock, sortSelected]);

  // --- Loading and Error States ---
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
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // --- Render ProductPageLayout ---
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 bg-white">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Sidebar lọc - CHỈ HIỂN THỊ TRÊN MÀN HÌNH LỚN */}
        <ProductSidebarFilters
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          displayRange={displayRange}
          showOutOfStock={showOutOfStock}
          handlePriceChange={handlePriceChange}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          setShowOutOfStock={setShowOutOfStock}
          formatPrice={formatPrice}
        />

        {/* Khu vực hiển thị sản phẩm */}
        <main className="w-full lg:w-3/4">
          <ProductPageHeader
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            setSortSelected={setSortSelected}
            totalFilteredProducts={filteredAndSortedProducts.length}
            totalProducts={products.length}
          />

          {/* Pagination Controls - Top */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Hiển thị{" "}
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredAndSortedProducts.length
              )}
              -
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedProducts.length
              )}{" "}
              của {filteredAndSortedProducts.length} sản phẩm
            </div>
            <ProductPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedProducts.length}
              onPageChange={setCurrentPage}
            />
          </div>

          <ProductGrid
            products={filteredAndSortedProducts.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            onClearFilters={handleClearFilters}
            priceRange={priceRange}
            selectedCategories={selectedCategories}
            showOutOfStock={showOutOfStock}
            categories={categories}
          />

          {/* Pagination Controls - Bottom */}
          {filteredAndSortedProducts.length > itemsPerPage && (
            <ProductPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedProducts.length}
              onPageChange={setCurrentPage}
            />
          )}
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
      <MobileProductFiltersModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        setSortSelected={setSortSelected}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        displayRange={displayRange}
        handlePriceChange={handlePriceChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        showOutOfStock={showOutOfStock}
        setShowOutOfStock={setShowOutOfStock}
        formatPrice={formatPrice}
      />
    </div>
  );
};
