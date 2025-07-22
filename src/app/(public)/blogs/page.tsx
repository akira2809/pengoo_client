import NewsSection from "@/components/layouts/Blog/NewsSection";
import BlogListSection, { BlogPost } from "@/components/layouts/Blog/BlogListSection";
import { fetchAllPosts } from "@/app/api/services/blogApi";

// Helper to check if image is valid
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

export default async function BlogsPage() {
  try {
    const posts = await fetchAllPosts();

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

    return (
      <div>
        <NewsSection />
        <BlogListSection posts={mappedPosts} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
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