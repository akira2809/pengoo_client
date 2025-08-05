'use client';

import React from 'react';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { fetchAllPosts } from '@/app/api/services/blogApi';

// Interface for blog post from API
export interface ApiBlogPost {
  id: number;
  name: string;
  canonical: string;
  description: string;
  content: string;
  meta_description: string;
  meta_keyword: string;
  meta_title: string;
  image: string;
  order: number | null;
  publish: boolean;
  created_at: string;
  updated_at: string;
  catalogue?: {
    id: number;
    name: string;
    canonical: string;
  };
}

// Interface for blog post in the component
export interface BlogPost {
  id: number;
  imageSrc: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  isFeatured: boolean;
  category?: {
    id: number;
    name: string;
    link: string;
  };
}

// Helper to check if image URL is valid

const PLACEHOLDER_IMAGE = '/images/placeholder-blog.jpg';

// Component props
interface BlogSectionProps {
  title?: string;
  viewAllLink?: string;
  posts?: ApiBlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  title = "Bài viết và tin tức",
  viewAllLink = "/blogs",
  posts: initialPosts = []
}) => {
  const [posts, setPosts] = React.useState<ApiBlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = React.useState(initialPosts.length === 0);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch posts if no initial posts provided
  React.useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const data = await fetchAllPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [initialPosts]);

  // Transform API posts to component format
  const formattedPosts = React.useMemo<BlogPost[]>(() => {
    if (!posts || posts.length === 0) return [];

    return posts.map((post) => {
      // Format date in Vietnamese locale
      const postDate = post.updated_at ? new Date(post.updated_at) : new Date();
      const formattedDate = postDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Handle category
      const category = post.catalogue ? {
        id: post.catalogue.id,
        name: post.catalogue.name,
        link: `/blogs/category/${post.catalogue.canonical}`
      } : undefined;

      // Handle image URL
      const isValidImage = post.image && 
        (post.image.startsWith('http') || post.image.startsWith('/'));
      const imageSrc = isValidImage ? post.image : PLACEHOLDER_IMAGE;

      return {
        id: post.id,
        imageSrc,
        title: post.name || 'Không có tiêu đề',
        excerpt: post.description || post.meta_description || '',
        date: formattedDate,
        link: `/blogs/${post.canonical || post.id}`,
        isFeatured: post.order === 1,
        category
      };
    });
  }, [posts]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-lg"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (formattedPosts.length === 0) {
    return (
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>Không có bài viết nào để hiển thị.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:py-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <a 
            href={viewAllLink}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            Xem tất cả <FiArrowRight className="ml-2" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover"
                />
                {post.category && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {post.category.name}
                  </span>
                )}
              </div>
              <div className="p-4">
                {post.category && (
                  <span className="text-sm text-gray-500">{post.category.name}</span>
                )}
                <h3 className="text-xl font-semibold mt-2 mb-2 line-clamp-2">
                  <a href={post.link} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </a>
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <time dateTime={post.date}>{post.date}</time>
                  <a 
                    href={post.link}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Đọc thêm <FiArrowRight className="ml-1" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};