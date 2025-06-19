// components/Header/CollectionsDropdown.tsx
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { productService } from "@/app/api/services/productService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

interface CollectionsDropdownProps {
  collectionsOpen: boolean;
  onClose: () => void;
}

export default function CollectionsDropdown({
  collectionsOpen,
  onClose,
}: CollectionsDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getCategories();
        if (response?.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh mục sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const collectionsMenuRef = useRef<HTMLDivElement>(null);
  const collectionsItemsRef = useRef<HTMLDivElement>(null);

  // Animation logic (di chuyển từ Header.tsx)
  useEffect(() => {
    if (collectionsOpen) {
      gsap.set(collectionsMenuRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transformOrigin: "top center",
        display: "block"
      });
      gsap.set(collectionsItemsRef.current?.children || [], {
        opacity: 0,
        y: 20
      });

      gsap.to(collectionsMenuRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(collectionsItemsRef.current?.children || [], {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.05,
        delay: 0.1,
        ease: "power2.out"
      });
    } else {
      gsap.to(collectionsItemsRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.15,
        stagger: 0.03,
        ease: "power2.in"
      });
      gsap.to(collectionsMenuRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.2,
        delay: 0.05,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(collectionsMenuRef.current, { display: "none" });
        }
      });
    }
  }, [collectionsOpen]);

  if (loading) {
    return (
      <div className="absolute left-0 right-0 top-full z-50 w-full bg-white p-4 shadow-lg">
        <div className="container mx-auto">
          <p>Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute left-0 right-0 top-full z-50 w-full bg-white p-4 shadow-lg">
        <div className="container mx-auto">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={collectionsMenuRef}
        className="absolute left-0 right-0 top-full bg-background-50 shadow-2xl border-t z-[9999]"
        style={{ display: collectionsOpen ? "block" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-text-900">Danh mục sản phẩm</h3>
            <a href="/collections" className="text-sm text-primary hover:underline font-semibold">
              Xem tất cả →
            </a>
          </div>

          <div ref={collectionsItemsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collection/${category.id}`} // Sử dụng ID làm tham số có slug thì thay thành chữ slug
                className="group flex items-center space-x-4 p-4 rounded-lg hover:bg-background-100 transition-colors"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={80}
                    height={60}
                    className="w-20 h-15 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-text-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h4>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description}
                    </p>
                  )}
                  {category.productCount !== undefined && (
                    <span className="text-xs text-gray-400 mt-2 block">
                      {category.productCount} sản phẩm
                    </span>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Featured Section */}
          <div className="mt-8 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-primary to-accent text-white p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Sản phẩm mới</h4>
                <p className="text-sm opacity-90 mb-3">Những mẫu mã mới nhất</p>
                <a href="/new-arrivals" className="text-sm font-semibold underline hover:no-underline">
                  Mua ngay
                </a>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-gray-800">Khuyến mãi</h4>
                <p className="text-sm text-gray-600 mb-3">Giảm giá lên đến 50%</p>
                <a href="/sale" className="text-sm font-semibold text-primary hover:underline">
                  Xem ưu đãi
                </a>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-gray-800">Bộ sưu tập</h4>
                <p className="text-sm text-gray-600 mb-3">Xu hướng thời trang mới nhất</p>
                <a href="/collections" className="text-sm font-semibold text-primary hover:underline">
                  Khám phá
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Collections Overlay */}
      {collectionsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
}