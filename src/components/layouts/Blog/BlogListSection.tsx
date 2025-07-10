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
}

interface BlogListSectionProps {
  posts: BlogPost[];
}

const BlogListSection: React.FC<BlogListSectionProps> = ({ posts }) => {
  // Lấy bài viết đầu tiên làm featured post
  const [featuredPost, ...otherPosts] = posts;
  
  // Phân trang cho các bài viết còn lại
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9; // Số bài viết mỗi trang (sau khi đã tách featured post)

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = otherPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil((posts.length - 1) / postsPerPage); // Trừ 1 vì đã tách featured post

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang khi đổi trang
    }
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Hiển thị bài viết đầu tiên với giao diện lớn */}
        {featuredPost && (
          <div className="mb-16">
            <FeaturedBlogCard {...featuredPost} />
          </div>
        )}

        {/* Hiển thị các bài viết còn lại dưới dạng grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {currentPosts.map((post) => (
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

export default BlogListSection;