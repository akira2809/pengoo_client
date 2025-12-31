// app/blogs/[slug]/page.tsx
import { Metadata } from 'next'; // Import Metadata type
import BlogPostDetail from '@/components/layouts/Blog/BlogPostDetail';
import { fetchPostBySlug } from '@/app/api/services/blogApi';
import { notFound } from 'next/navigation';

// Hàm kiểm tra và trả về URL ảnh hợp lệ
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg'; // Ảnh placeholder mặc định

// --- SEO: Dynamic Metadata Generation ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  // Nếu bài viết không tồn tại, trả về metadata mặc định hoặc ném lỗi 404
  if (!post) {
    return {
      title: 'Bài viết không tìm thấy',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại.',
    };
  }

  const imageUrl = isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE;
  // Giả sử domain gốc của bạn
  const baseUrl = 'https://pengoo.store'; // THAY THẾ BẰNG DOMAIN THỰC TẾ CỦA BẠN!
  const fullImageUrl = imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : imageUrl;
  const postUrl = `${baseUrl}/blogs/${post.canonical || (await params).slug}`; // Sử dụng canonical nếu có, hoặc slug

  return {
    title: `${post.name} | Blog PENGOO`, // Tiêu đề bài viết
    description: post.description || `Đọc thêm về ${post.name} trên Blog PENGOO.`, // Mô tả bài viết
    keywords: post.keywords ? post.keywords.split(',').map((k: string) => k.trim()) : [
      'blog board game', 'tin tức board game', 'hướng dẫn board game',
      post.name.toLowerCase(), // Thêm tên bài viết làm từ khóa
    ], // Từ khóa động từ bài viết hoặc mặc định

    // Canonical URL: Quan trọng để tránh trùng lặp nội dung
    alternates: {
      canonical: postUrl,
    },

    // Open Graph Metadata cho chia sẻ trên mạng xã hội (Facebook, Zalo)
    openGraph: {
      title: post.name,
      description: post.description || `Đọc thêm về ${post.name} trên Blog PENGOO.`,
      url: postUrl,
      type: 'article', // Quan trọng: Đặt type là 'article' cho bài viết blog
      images: [
        {
          url: fullImageUrl, // Ảnh của bài viết
          width: 1200, // Kích thước khuyến nghị
          height: 630,
          alt: post.name,
        },
      ],
      publishedTime: post.created_at || undefined, // Thời gian xuất bản
      modifiedTime: post.updated_at || undefined, // Thời gian cập nhật
      authors: post.author_name ? [post.author_name] : ['PENGOO'], // Tên tác giả
      siteName: 'PENGOO Blog',
      locale: 'vi_VN',
    },

    // Twitter Card Metadata cho chia sẻ trên Twitter
    twitter: {
      card: 'summary_large_image',
      site: '@pengoo_vn', // Twitter handle của bạn (nếu có)
      creator: post.author_name ? `@${post.author_name.replace(/\s/g, '_')}` : '@pengoo_vn', // Creator Twitter handle
      title: post.name,
      description: post.description || `Đọc thêm về ${post.name} trên Blog PENGOO.`,
      images: [fullImageUrl], // Ảnh của bài viết
    },

    // JSON-LD Structured Data for Article Schema
    // Rất quan trọng để Google hiểu rõ nội dung là một bài viết
    // Bạn có thể thêm vào đây hoặc trong BlogPostDetail component nếu muốn
    // Tuy nhiên, thêm ở đây là chuẩn hơn vì nó là metadata cấp trang
  };
}

// --- Component Trang Chi Tiết Bài Viết ---
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound(); // Next.js sẽ hiển thị trang 404
  }

  const baseUrl = 'https://pengoo.store';
  const postUrl = `${baseUrl}/blogs/${post.canonical || (await params).slug}`;

  const mappedPost = {
    id: post.id.toString(),
    imageSrc: isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE,
    title: post.name,
    excerpt: post.description,
    date: post.created_at?.slice(0, 10),
    link: postUrl,
    content: [post.content],
    textColor: post.textColor || "#0f172a",
    bgColor: post.bgColor || "#fff",
    fontFamily: post.fontFamily || "sans-serif",
    fontSize: post.fontSize || "text-lg",
  };

  return (
    <>
      {/* Không cần <title> và <meta name="description"> ở đây nữa, vì đã có trong generateMetadata */}
      <BlogPostDetail post={mappedPost} />

      {/* Thêm JSON-LD Structured Data ở đây */}
      {post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article", // Hoặc BlogPosting nếu phù hợp hơn
              "headline": post.name,
              "description": post.description,
              "image": isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE, // URL đầy đủ của ảnh
              "datePublished": post.created_at || undefined,
              "dateModified": post.updated_at || undefined,
              "author": {
                "@type": "Person",
                "name": post.author_name || "PENGOO",
              },
              "publisher": {
                "@type": "Organization",
                "name": "PENGOO Board Game",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://pengoo.store/images/logo.png", // Thay thế bằng URL logo của bạn
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl, // URL chuẩn của bài viết
              },
              // Thêm các thuộc tính khác nếu có như bài viết liên quan, đánh giá, v.v.
            })
          }}
        />
      )}
    </>
  );
}