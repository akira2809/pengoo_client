// components/Blog/BlogPostDetail.tsx
import React, { JSX } from 'react';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi'; // Icon lịch

interface BlogPost {
  id: string;
  imageSrc?: string;
  title: string;
  excerpt: string; // Vẫn giữ excerpt, có thể dùng cho meta description
  date: string;
  link: string;
  content: (string | JSX.Element)[];
}

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Bài viết không tìm thấy.</p>
      </div>
    );
  }

  return (
    <article className="bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4"> {/* Chiều rộng tối đa cho nội dung */}
        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Date */}
        <div className="flex items-center justify-center text-base text-gray-500 mb-8 font-sans">
          <FiCalendar className="mr-2 text-lg" />
          <span>{post.date}</span>
        </div>

        {/* Main Image */}
        {post.imageSrc && (
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg mb-12">
            <Image
              src={post.imageSrc}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              quality={90}
              priority // Tải sớm ảnh chính
            />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-lg mx-auto text-gray-800 font-sans leading-relaxed">
          {/* Tailwind Typography plugin sẽ giúp định dạng các thẻ HTML mặc định */}
          {/* Nếu bạn chưa cài @tailwindcss/typography, hãy cài: npm install -D @tailwindcss/typography */}
          {/* Sau đó thêm vào tailwind.config.js: plugins: [require('@tailwindcss/typography')], */}
          {post.content.map((block, index) => (
            <React.Fragment key={index}>{block}</React.Fragment>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogPostDetail;