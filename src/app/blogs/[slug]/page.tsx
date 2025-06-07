// app/blog/[slug]/page.tsx
import BlogPostDetail from '@/components/layouts/Blog/BlogPostDetail';
import { ALL_BLOG_POSTS, getBlogPostById } from '@/app/api/data/blogPosts';
import { notFound } from 'next/navigation'; // Để xử lý 404

// Hàm này là bắt buộc trong App Router cho dynamic segments
// Nó sẽ tạo ra các trang tĩnh tại thời điểm build
export async function generateStaticParams() {
  return ALL_BLOG_POSTS.map((post) => ({
    slug: post.id,
  }));
}

// Đây là hàm sẽ fetch dữ liệu cho trang cụ thể
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostById(params.slug);

  if (!post) {
    notFound(); // Trả về trang 404 của Next.js
  }

  return (
    <>
      {/* Title và meta tags có thể được định nghĩa trong layout hoặc trong page này */}
      {/* Đối với App Router, metadata thường được quản lý ở layout hoặc trong page này
          bằng cách export metadata object/function */}
      {/* Ví dụ đơn giản: */}
      <title>{post.title} - Blog</title>
      <meta name="description" content={post.excerpt} />
      {/* Để quản lý metadata tốt hơn trong App Router, xem tài liệu Next.js */}

      <BlogPostDetail post={post} />
    </>
  );
}

// Đối với App Router, bạn cũng có thể xuất metadata riêng biệt:
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostById(params.slug);

  if (!post) {
    return {
      title: 'Bài viết không tìm thấy',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}