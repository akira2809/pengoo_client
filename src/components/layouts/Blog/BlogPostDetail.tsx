// components/Blog/BlogPostDetail.tsx
import React, { JSX } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { FiCalendar } from 'react-icons/fi';

interface BlogPost {
  id: string;
  imageSrc?: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  content: (string | JSX.Element)[];
  textColor?: string;
  bgColor?: string;
  fontFamily?: string;
  fontSize?: string;
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
    <article
      style={{
        color: post.textColor,
        background: post.bgColor,
        fontFamily: post.fontFamily,
        fontSize: post.fontSize === "text-base" ? "1.25rem"
          : post.fontSize === "text-lg" ? "1.5rem"
          : post.fontSize === "text-2xl" ? "2rem"
          : undefined,
        transition: "background 0.2s, color 0.2s",
        minHeight: 200,
      }}
      className="py-12 md:py-16"
    >
      <div className="max-w-3xl mx-auto px-4">
        {/* Main Image */}
        {post.imageSrc && (
          <div className="relative w-full h-[260px] md:h-[350px] lg:h-[420px] overflow-hidden rounded-xl mb-8 shadow">
            <Image
              src={post.imageSrc}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl"
              quality={90}
              priority
            />
          </div>
        )}

        {/* Title */}
        <h1
          className="font-serif text-3xl md:text-4xl font-extrabold text-center mb-2 leading-tight"
          style={{ color: post.textColor, fontFamily: post.fontFamily }}
        >
          {post.title}
        </h1>

        {/* Date */}
        <div className="flex items-center justify-center text-sm text-gray-500 mb-8 font-sans gap-2">
          <FiCalendar className="text-lg" />
          <span>{post.date}</span>
        </div>

        {/* Excerpt/Description */}
        {post.excerpt && (
          <div className="italic text-gray-500 text-base text-center mb-8">{post.excerpt}</div>
        )}

        {/* Content Body */}
        <div
          className="prose prose-lg mx-auto font-sans leading-relaxed"
          style={{
            color: post.textColor,
            fontFamily: post.fontFamily,
            fontSize: post.fontSize === "text-base" ? "1.25rem"
              : post.fontSize === "text-lg" ? "1.5rem"
              : post.fontSize === "text-2xl" ? "2rem"
              : undefined,
          }}
        >
          <ReactMarkdown
            components={{
              img: ({ ...props }) => (
                <span className="block my-8 rounded-xl overflow-hidden shadow">
                  <Image
                    src={typeof props.src === 'string' ? props.src : ''}
                    alt={props.alt || ''}
                    width={900}
                    height={500}
                    className="rounded-xl max-w-full h-auto mx-auto"
                    style={{ objectFit: "contain" }}
                  />
                  {props.alt && (
                    <span className="block text-center text-xs text-gray-400 mt-2">{props.alt}</span>
                  )}
                </span>
              ),
            }}
          >
            {typeof post.content === 'string' ? post.content : post.content.join('\n')}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
};

export default BlogPostDetail;