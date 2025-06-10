// components/layouts/Blog/BlogListSection.tsx
"use client"
import React, { useState } from 'react';
import BlogCard from './BlogCard'; // Import BlogCard
import FeaturedBlogCard from './FeaturedBlogCard'; // Import FeaturedBlogCard
import Pagination from './Pagination'; // Import Pagination
import { ALL_BLOG_POSTS } from "@/app/api/data/blogPosts"

interface BlogPost {
  id: string;
  imageSrc?: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  isFeatured?: boolean;
}

interface BlogListSectionProps {
  posts?: BlogPost[]; // Nhận danh sách bài viết (có thể từ props hoặc dùng dummy data)
}

export const BlogListSection: React.FC<BlogListSectionProps> = ({ posts = ALL_BLOG_POSTS }) => {
  // Lọc bài viết nổi bật và các bài viết khác
  const featuredPost = posts.find(post => post.isFeatured);
  const otherPosts = posts.filter(post => !post.isFeatured);

  // Phân trang (ví dụ đơn giản, bạn có thể phức tạp hơn)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Số bài viết mỗi trang (trừ bài nổi bật nếu có)

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentOtherPosts = otherPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(otherPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang khi đổi trang
    }
  };

  return (
    <section className=" py-16 md:py-20"> {/* Nền xám nhạt cho toàn bộ section */}
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Phần bài viết nổi bật (nếu có) */}
        {featuredPost && (
          <div className="mb-16"> {/* Margin dưới bài viết nổi bật */}
            <FeaturedBlogCard {...featuredPost} />
          </div>
        )}

        {/* Grid cho các bài viết còn lại */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"> {/* Khoảng cách giữa các cột và hàng */}
          {currentOtherPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default BlogListSection; // Export mặc định