"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPageLayout } from "../products/component/ProductPageLayout";
import { productService } from "@/app/api/services/productService";
import { ProductData } from "@/app/type/product";
import { useSearchStore } from "@/app/stores/slice/searchStore";
import { API_CONFIG } from "@/app/api/apiConfig";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy các tham số từ URL
  const searchQuery = searchParams.get("name") || "";
  const categoryParam = searchParams.get("category") || "";
  const minPriceParam = searchParams.get("minPrice") || "0";
  const maxPriceParam = searchParams.get("maxPrice") || "5000000";

  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      productCount: number;
    }>
  >([]);
  const [tags, setTags] = useState<
    Array<{
      id: string;
      name: string;
      type: string;
    }>
  >([]);

  // Khởi tạo filters từ URL params
  const [filtersState, setFiltersState] = useState({
    name: searchQuery,
    category: categoryParam,
    minPrice: parseInt(minPriceParam, 10),
    maxPrice: parseInt(maxPriceParam, 10),
  });

  // Sử dụng searchStore để lưu lịch sử tìm kiếm và tìm kiếm sản phẩm
  const {
    addToRecentSearches,
    setSearchQuery,
  } = useSearchStore();

  // Cập nhật URL khi filters thay đổi
  const updateUrlWithFilters = useCallback(
    (newFilters: typeof filtersState) => {
      const params = new URLSearchParams();

      if (newFilters.name) {
        params.set("name", newFilters.name);
      }

      if (newFilters.category) {
        params.set("category", newFilters.category);
      }

      if (newFilters.minPrice > 0) {
        params.set("minPrice", newFilters.minPrice.toString());
      }

      if (newFilters.maxPrice < 5000000) {
        params.set("maxPrice", newFilters.maxPrice.toString());
      }

      const newUrl = `/search?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

  // Xử lý khi filters thay đổi - đây là hàm sẽ được truyền vào ProductPageLayout
  const handleFiltersChange = useCallback(
    (value: unknown) => {
      // Xử lý cả trường hợp khi value là một hàm (prevState) => newState
      const newFilters =
        typeof value === "function" ? value(filtersState) : value;

      setFiltersState(newFilters);
      updateUrlWithFilters(newFilters);
    },
    [filtersState, updateUrlWithFilters]
  );

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);

      try {
        if (searchQuery) {
          // Lưu từ khóa tìm kiếm vào lịch sử
          addToRecentSearches(searchQuery);
          setSearchQuery(searchQuery);

          // Sử dụng API trực tiếp để có thể thêm các tham số lọc
          const searchUrl = `${API_CONFIG.BASE_URL}${
            API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH
          }${encodeURIComponent(searchQuery)}`;

          // Tạo các tham số bổ sung
          const additionalParams = new URLSearchParams();

          if (categoryParam) {
            additionalParams.set("category", categoryParam);
          }

          if (parseInt(minPriceParam, 10) > 0) {
            additionalParams.set("minPrice", minPriceParam);
          }

          if (parseInt(maxPriceParam, 10) < 5000000) {
            additionalParams.set("maxPrice", maxPriceParam);
          }

          // Thêm các tham số bổ sung vào URL nếu có
          const additionalParamsString = additionalParams.toString();
          const finalUrl = additionalParamsString
            ? `${searchUrl}&${additionalParamsString}`
            : searchUrl;

          const response = await fetch(finalUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error(
              `Lỗi tìm kiếm: ${response.status} ${response.statusText}`
            );
          }

          const responseData = await response.json();

          // Handle different response formats
          let results = [];
          if (Array.isArray(responseData)) {
            results = responseData;
          } else if (responseData && Array.isArray(responseData.data)) {
            results = responseData.data;
          } else if (
            responseData &&
            responseData.items &&
            Array.isArray(responseData.items)
          ) {
            results = responseData.items;
          } else {
            throw new Error("Dữ liệu trả về không hợp lệ");
          }

          setProducts(results);
        } else {
          // Nếu không có từ khóa tìm kiếm, sử dụng getProducts để lọc theo danh mục hoặc giá
          const apiParams: Record<string, unknown> = {};

          if (categoryParam) {
            apiParams.category = categoryParam;
          }

          if (parseInt(minPriceParam, 10) > 0) {
            apiParams.minPrice = parseInt(minPriceParam, 10);
          }

          if (parseInt(maxPriceParam, 10) < 5000000) {
            apiParams.maxPrice = parseInt(maxPriceParam, 10);
          }

          const response = await productService.getProducts(apiParams);

          if (response && response.data) {
            // The API returns an array of products directly
            setProducts(Array.isArray(response.data) ? response.data : []);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra khi tìm kiếm sản phẩm"
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await productService.getTags();
        if (response && response.data) {
          setTags(response.data);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchSearchResults();
    fetchCategories();
    fetchTags();
  }, [
    searchQuery,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    addToRecentSearches,
    setSearchQuery,
  ]);

  // Xử lý tìm kiếm trực tiếp trên trang
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      // Lưu từ khóa tìm kiếm vào lịch sử
      addToRecentSearches(localSearchQuery.trim());

      // Cập nhật URL với từ khóa tìm kiếm mới
      const newFilters = {
        ...filtersState,
        name: localSearchQuery.trim(),
      };
      updateUrlWithFilters(newFilters);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {searchQuery
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : "Tìm kiếm sản phẩm"}
        </h1>

        {/* Ô tìm kiếm trực tiếp ở giữa trang */}
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
              placeholder="Tìm kiếm sản phẩm..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <ProductPageLayout
        products={products}
        isLoading={isLoading}
        error={error}
        setFilters={handleFiltersChange}
        categories={categories}
        collections={[]} // Không cần collections cho trang tìm kiếm
        tags={tags}
      />
    </>
  );
}
