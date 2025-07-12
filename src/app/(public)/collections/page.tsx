'use client';

import { useEffect, useState } from 'react';
import { collectionService } from '@/app/api/services/collectionService';
import CategoryGrid from '@/components/layouts/collection/CategoryGrid';
import { BlogSection } from '@/components/common/BlogSection';


interface RawCategory {
  id?: string | number;
  name?: string;
  slug?: string;
  image_url: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}
interface Collection {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await collectionService.getCollections();
        console.log('Categories API response:', response);

        if (isMounted && response?.data && Array.isArray(response.data)) {
          // Chuyển đổi dữ liệu từ API sang đúng định dạng Category
          const formatted = response.data.map((cat: RawCategory): Category => ({
            id: String(cat.id || ''),
            name: cat.name || 'Không tên',
            slug: cat.slug || String(cat.id || ''),
            image: cat.image_url || '/placeholder.png',
          }));

          setCollections(formatted);
        } else {
          console.warn('Dữ liệu danh mục không hợp lệ');
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main>
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Danh mục Collections</h1>

      {loading ? (
        <div className="text-gray-500">Đang tải danh mục...</div>
      ) : collections.length > 0 ? (
        <CategoryGrid collections={collections} />
      ) : (
        <div className="text-gray-500">Không có danh mục nào để hiển thị.</div>
      )}
    </div>
    <BlogSection />
    </main>
  );
}
