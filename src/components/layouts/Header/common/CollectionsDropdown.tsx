// components/Header/CollectionsDropdown.tsx
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { productService } from "@/app/api/services/productService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClassNames } from "@emotion/react";

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
    < >
      <div
        ref={collectionsMenuRef}
        // ✅ Thay đổi màu nền chính
        className="collections-theme" // Sử dụng class CSS mới
        style={{ display: collectionsOpen ? "block" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            {/* ✅ Cập nhật màu chữ tiêu đề */}
            <h3 className="text-2xl font-bold text-white">
              Danh mục sản phẩm
            </h3>
            {/* ✅ Cập nhật màu link */}
            <Link 
              href="/collections" 
              className="flex items-center text-sm font-semibold text-white/70 hover:text-white transition-colors group"
            >
              Xem tất cả
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
  
          <div ref={collectionsItemsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collection/${category.slug}`}
                // ✅ Cập nhật màu sắc cho từng mục
                className="group flex items-center space-x-4 p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 border border-white/10"
              >
                <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {/* ✅ Cập nhật màu chữ danh mục */}
                  <h4 className="font-semibold text-white/90 group-hover:text-white transition-colors truncate">
                    {category.name}
                  </h4>
                  {category.description && (
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  {category.productCount !== undefined && (
                    // ✅ Cập nhật màu tag đếm sản phẩm
                    <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium bg-sky-500/20 text-sky-300 rounded-full">
                      {category.productCount} sản phẩm
                    </span>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  {/* ✅ Cập nhật màu icon mũi tên */}
                  <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
  
          {/* Featured Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Thẻ 1 giữ nguyên vì đã có màu gradient đẹp */}
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Sản phẩm mới</h4>
                <p className="text-sm text-white/90 mb-4">Những mẫu mã mới nhất</p>
                <a href="/new-arrivals" className="inline-flex items-center text-sm font-semibold text-white hover:text-white/80 transition-colors">Mua ngay <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></a>
              </div>
              
              {/* ✅ Cập nhật 2 thẻ còn lại cho phù hợp theme tối */}
              <div className="bg-white/5 p-6 rounded-xl transition-all duration-300 hover:bg-white/10 border border-white/10">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 text-amber-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                </div>
                <h4 className="font-bold text-lg mb-2 text-white">Khuyến mãi</h4>
                <p className="text-sm text-white/70 mb-4">Giảm giá lên đến 50%</p>
                <a href="/sale" className="inline-flex items-center text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">Xem ưu đãi <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></a>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl transition-all duration-300 hover:bg-white/10 border border-white/10">
                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mb-4 text-violet-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01"></path></svg>
                </div>
                <h4 className="font-bold text-lg mb-2 text-white">Bộ sưu tập</h4>
                <p className="text-sm text-white/70 mb-4">Xu hướng thời trang mới</p>
                <Link href="/collection" className="inline-flex items-center text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors">Khám phá<svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity ${collectionsOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
    </>
  );
}