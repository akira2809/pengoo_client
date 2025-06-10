// components/Blog/FeaturedBlogCard.tsx
import React from 'react';
import Image from 'next/image';

interface FeaturedBlogCardProps {
  id: string;
  imageSrc: string; // Featured post should always have an image
  title: string;
  excerpt: string;
  date: string;
  link: string;
}

const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({ id, imageSrc, title, excerpt, date, link }) => {
  return (
    <a href={link} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Image - lớn hơn các thẻ bình thường */}
        <div className="relative w-full h-80 md:h-96 overflow-hidden"> {/* Chiều cao lớn hơn */}
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            quality={90}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8"> {/* Padding lớn hơn */}
          {/* Title - Font lớn và đậm theo UI mẫu */}
          <h3 className=" text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-amber-800 transition-colors duration-200">
            {title}
          </h3>

          {/* Excerpt - Dài hơn và font phù hợp */}
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {excerpt}
          </p>

          {/* Date */}
          <p className="text-base text-gray-500">
            {date}
          </p>
        </div>
      </div>
    </a>
  );
};

export default FeaturedBlogCard;