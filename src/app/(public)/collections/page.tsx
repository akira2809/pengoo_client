'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collectionService } from '@/app/api/services/collectionService';
import CategoryGrid from '@/components/layouts/collection/CategoryGrid';
import { BlogSection } from '@/components/common/BlogSection';

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

function CollectionsContent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const sort = searchParams.get('sort'); // ví dụ: sort=newest

  useEffect(() => {
    let isMounted = true;

    const loadCollections = async () => {
      try {
        setLoading(true);

        const response = await collectionService.getCollections();
        const data: RawCollection[] = response?.data || [];

        let formatted = data.map((item) => ({
          id: String(item.id),
          name: item.name || 'Không tên',
          slug: item.slug || '',
          image: item.image_url || '/placeholder.png',
          createdAt: item.createdAt || '',
        }));

        // ✅ Nếu sort=newest thì sắp xếp theo createdAt giảm dần
        if (sort === 'newest') {
          formatted = formatted.sort((a, b) => {
            const dateA = new Date(a.createdAt || '').getTime();
            const dateB = new Date(b.createdAt || '').getTime();
            return dateB - dateA;
          });
        }

        if (isMounted) {
          setCollections(formatted);
        }
      } catch (error) {
        console.error('Lỗi tải collections:', error);
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

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Đang tải bộ sưu tập...
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
