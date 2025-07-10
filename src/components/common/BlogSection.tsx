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
  order: number;
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
  id: string;
  imageSrc: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  isFeatured?: boolean;
  category?: {
    name: string;
    link: string;
  };
}

// Helper to check if image URL is valid
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

// Component props
interface BlogSectionProps {
  title?: string;
  viewAllLink?: string;
  posts?: ApiBlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  title = "Blogs and News",
  viewAllLink = "/blogs",
  posts: initialPosts = []
}) => {
  const [posts, setPosts] = React.useState<ApiBlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = React.useState(!initialPosts.length);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPosts = async () => {
      if (initialPosts.length) return;
      
      try {
        const data = await fetchAllPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [initialPosts]);

  // Transform API posts to component format
  const formattedPosts = React.useMemo(() => {
    return posts.map((post) => {
      // Format date in Vietnamese locale
      const formattedDate = new Date(post.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
      
      // Handle category info if available
      const category = post.catalogue ? {
        name: post.catalogue.name,
        link: `/categories/${post.catalogue.canonical}`
      } : undefined;

      return {
        id: post.id.toString(),
        imageSrc: isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE,
        title: post.name,
        excerpt: post.description || post.meta_description || '',
        date: formattedDate,
        link: `/blogs/${post.canonical}`,
        isFeatured: post.order === 1,
        category: category
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
          <p>No blog posts found.</p>
        </div>
      </section>
    );
  }



  return (
    <section className="py-16 px-4 md:py-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            {title}
          </h2>
          <a
            href={viewAllLink}
            className="flex items-center text-lg font-semibold text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            View all <FiArrowRight className="ml-2 text-xl" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formattedPosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              className="block group"
              aria-label={`Read more about ${post.title}`}
            >
              <div className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                <div className="relative w-full h-60 overflow-hidden">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={post.isFeatured}
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    {post.category && (
                      <span className="text-sm font-medium text-blue-600">
                        {post.category.name}
                      </span>
                    )}
                    <p className="text-sm text-gray-500">{post.date}</p>
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-background-800 transition-colors duration-200 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    Read more →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};