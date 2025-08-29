"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collectionService } from "@/app/api/services/collectionService";
import CategoryGrid from "@/components/layouts/collection/CategoryGrid";
import { BlogSection } from "@/components/common/BlogSection";
import { Skeleton } from "@/components/common/UI/Skeleton";

interface RawCollection {
  id: string | number;
  name?: string;
  slug?: string;
  image_url?: string;
  createdAt?: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
}

export default function CollectionsContent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const sort = searchParams.get("sort"); // ví dụ: sort=newest

  useEffect(() => {
    let isMounted = true;

    const loadCollections = async () => {
      try {
        setLoading(true);

        const response = await collectionService.getCollections();
        const data: RawCollection[] = response?.data || [];

        let formatted = data.map((item) => ({
          id: String(item.id),
          name: item.name || "Không tên",
          slug: item.slug || "",
          image: item.image_url || "/placeholder.png",
          createdAt: item.createdAt || "",
        }));

        // ✅ Nếu sort=newest thì sắp xếp theo createdAt giảm dần
        if (sort === "newest") {
          formatted = formatted.sort((a, b) => {
            const dateA = new Date(a.createdAt || "").getTime();
            const dateB = new Date(b.createdAt || "").getTime();
            return dateB - dateA;
          });
        }

        if (isMounted) {
          setCollections(formatted);
        }
      } catch (error) {
        console.error("Lỗi tải collections:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
    return () => {
      isMounted = false;
    };
  }, [sort]);

  return (
    <main>
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Danh mục Collections</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Skeleton 
                  variant="card" 
                  className="w-full h-full rounded-xl"
                  effect="pulse"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Skeleton variant="text" className="h-8 w-32 mb-4" />
                  <div className="w-10 h-10 rounded-full bg-white/20" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length > 0 ? (
          <CategoryGrid collections={collections} />
        ) : (
          <div className="text-gray-500">
            Không có danh mục nào để hiển thị.
          </div>
        )}
      </div>
      <BlogSection />
    </main>
  );
}
