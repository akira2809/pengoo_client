// components/Header/SearchSidebar.tsx
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";

interface SearchResult {
  id: number;
  title: string;
  price?: number;
  image: string;
  type: 'product' | 'collection' | 'page';
}

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "collections" | "pages">("products");
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Dummy search results - replace with actual search functionality
  const searchResults: SearchResult[] = [
    {
      id: 1,
      title: "Majestic Mahjong Set",
      price: 895.00,
      image: "/placeholder-product.jpg",
      type: "product"
    },
    {
      id: 2,
      title: "Five in a Row",
      price: 98.00,
      image: "/placeholder-product.jpg",
      type: "product"
    },
    {
      id: 3,
      title: "Game Collections",
      image: "/placeholder-collection.jpg",
      type: "collection"
    },
    {
      id: 4,
      title: "About Us",
      image: "/placeholder-page.jpg",
      type: "page"
    }
  ];

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim() === "") {
      setDebouncedQuery("");
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 2000); // 2 second debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Filter results based on active tab and debounced search query
  const filteredResults = debouncedQuery
    ? searchResults.filter(
        (item) =>
          (activeTab === "products" && item.type === "product" && item.title.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
          (activeTab === "collections" && item.type === "collection" && item.title.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
          (activeTab === "pages" && item.type === "page" && item.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
      )
    : [];

  // Animation logic
  useEffect(() => {
    if (isOpen) {
      gsap.set(searchPopupRef.current, {
        x: "100%",
        display: "flex",
      });

      gsap.to(searchPopupRef.current, {
        x: "0%",
        duration: 0.4,
        ease: "power2.out",
      });

      // Focus input when opened
      searchInputRef.current?.focus();
    } else {
      gsap.to(searchPopupRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (searchPopupRef.current) {
            searchPopupRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={searchPopupRef}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      style={{ display: "none" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Search</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close search"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={isSearching ? "Searching..." : "Search for products, collections, pages..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "products"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "collections"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("collections")}
        >
          Collections
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "pages"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("pages")}
        >
          Pages
        </button>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {isSearching && searchQuery && (
          <div className="flex justify-center items-center h-20">
            <div className="animate-pulse text-gray-500">Searching...</div>
          </div>
        )}
        {!isSearching && searchQuery && filteredResults.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No results found for "{searchQuery}"
          </div>
        )}
        {filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  {item.price !== undefined && (
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <SearchIcon className="w-12 h-12 mb-4" />
            <p>No {activeTab} found</p>
          </div>
        )}
      </div>
    </div>
  );
}
