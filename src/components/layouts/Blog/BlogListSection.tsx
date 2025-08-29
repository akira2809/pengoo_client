// components/layouts/Blog/BlogListSection.tsx
"use client"
import React, { useState } from 'react';
import BlogCard from './BlogCard';
import FeaturedBlogCard from './FeaturedBlogCard';
import Pagination from './Pagination';

export interface BlogPost {
  id: string;
  imageSrc?: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  isFeatured?: boolean;
  order?: number;
}

interface BlogListSectionProps {
  posts: BlogPost[];
}

const BlogListSection: React.FC<BlogListSectionProps> = ({ posts }) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Show 6 posts per page (3 columns x 2 rows)

  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-gray-600">Không có bài viết nào để hiển thị.</p>
        </div>
      </section>
    );
  }

  // Find the post with isFeatured = true or the first post
  const featuredPost = posts.find(post => post.isFeatured) || posts[0];
  
  // Get other posts and sort them by order field
  const otherPosts = posts
    .filter(post => post.id !== featuredPost?.id)
    .sort((a, b) => (a.order || Number.MAX_SAFE_INTEGER) - (b.order || Number.MAX_SAFE_INTEGER));

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = otherPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(otherPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when changing page
    }
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Hiển thị bài viết đầu tiên với giao diện lớn */}
        {featuredPost && (
          <div className="mb-16">
            <FeaturedBlogCard {...featuredPost} imageSrc={featuredPost.imageSrc ?? ""} />
          </div>
        )}

        {/* Hiển thị bài viết theo trang hiện tại */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {currentPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListSection;