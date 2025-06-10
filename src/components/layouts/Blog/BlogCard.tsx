// components/Blog/BlogCard.tsx
import React from 'react';
import Image from 'next/image';

interface BlogCardProps {
  id: string;
  imageSrc?: string; // Có thể không có ảnh
  title: string;
  excerpt: string;
  date: string;
  link: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, imageSrc, title, excerpt, date, link }) => {
  return (
    <a href={link} className="block group h-full"> {/* Thêm h-full */}
      <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
        {/* If no image, maybe show a placeholder or just content */}
        {imageSrc && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={imageSrc}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
              quality={75}
            />
          </div>
        )}
        <div className="p-4 flex-grow"> {/* flex-grow để đẩy ngày tháng xuống cuối */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-800 transition-colors duration-200  leading-tight">
            {title}
          </h3>
          <p className="text-base text-gray-600 leading-relaxed line-clamp-3 ">
            {excerpt}
          </p>
        </div>
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;