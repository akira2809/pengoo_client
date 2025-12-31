import { Metadata } from "next";
import NewsSection from "@/components/layouts/Blog/NewsSection";
import BlogListSection, { BlogPost } from "@/components/layouts/Blog/BlogListSection";
import { fetchAllPosts } from "@/app/api/services/blogApi";

export const metadata: Metadata = {
  title: "Blog - Tin Tức & Bài Viết Mới Nhất | Your Store Name",
  description: "Khám phá những bài viết mới nhất, tin tức công nghệ, hướng dẫn sử dụng sản phẩm và những câu chuyện thú vị từ cộng đồng. Cập nhật thường xuyên với nội dung chất lượng cao.",
  keywords: "blog, tin tức, bài viết, công nghệ, hướng dẫn, review sản phẩm, cộng đồng",
  authors: [{ name: "Your Store Name Team" }],
  creator: "Your Store Name",
  publisher: "Your Store Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://yourstore.com'),
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: "Blog - Tin Tức & Bài Viết Mới Nhất",
    description: "Khám phá những bài viết mới nhất, tin tức công nghệ, hướng dẫn sử dụng sản phẩm và những câu chuyện thú vị từ cộng đồng.",
    url: '/blogs',
    siteName: 'Your Store Name',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog - Your Store Name',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog - Tin Tức & Bài Viết Mới Nhất",
    description: "Khám phá những bài viết mới nhất, tin tức công nghệ, hướng dẫn sử dụng sản phẩm và những câu chuyện thú vị từ cộng đồng.",
    images: ['/og-blog.jpg'],
    creator: '@yourstorename',
    site: '@yourstorename',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// Helper to check if image is valid
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

export default async function BlogsPage() {
  try {
    const posts = await fetchAllPosts();
    
    
    if (!Array.isArray(posts)) {
      console.error('Expected posts to be an array, got:', typeof posts, posts);
      throw new Error('Invalid posts data format');
    }
    
    
    const mappedPosts: BlogPost[] = posts.map((post: {
      id: number;
      image?: string;
      name?: string;
      description?: string;
      created_at?: string;
      slug?: string;
      canonical?: string;
      order?: number;
    }) => ({
      id: post.id.toString(),
      imageSrc: isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE,
      title: post.name || 'No title',
      excerpt: post.description || 'No description available',
      date: post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date',
      link: `/blogs/${post.canonical || post.id}`,
      isFeatured: post.order === 1,
    }));

    // JSON-LD structured data for blog listing
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Your Store Name Blog',
      description: 'Tin tức, bài viết và hướng dẫn mới nhất từ Your Store Name',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourstore.com'}/blogs`,
      publisher: {
        '@type': 'Organization',
        name: 'Your Store Name',
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://yourstore.com',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourstore.com'}/logo.png`,
        },
      },
      blogPost: mappedPosts.slice(0, 10).map(post => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourstore.com'}${post.link}`,
        datePublished: post.date,
        author: {
          '@type': 'Organization',
          name: 'Your Store Name',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Your Store Name',
        },
        image: post.imageSrc.startsWith('http') ? post.imageSrc : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourstore.com'}${post.imageSrc}`,
      })),
    };

    return (
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NewsSection />
        <BlogListSection posts={mappedPosts} />
      </div>
    );
  } catch (error) {
    // Log the error for debugging
    console.error('Error loading blog posts:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog Posts</h2>
          <p className="text-gray-600">We&apos;re having trouble loading the blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }
}