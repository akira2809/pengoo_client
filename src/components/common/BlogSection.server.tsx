import { fetchAllPosts } from '@/app/api/services/blogApi';
import { BlogSection } from './BlogSection';

// Helper to check if image URL is valid
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

export async function BlogSectionWrapper() {
  try {
    const apiPosts = await fetchAllPosts();
    
    const posts = apiPosts.map((post) => {
      // Format date in Vietnamese locale
      const formattedDate = new Date(post.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
      
      // Handle category info if available
      const category = post.catalogue ? {
        name: post.catalogue.name,
        link: `/categories/${post.catalogue.canonical}`
      } : undefined;

      return {
        id: post.id.toString(),
        imageSrc: isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE,
        title: post.name,
        excerpt: post.description || post.meta_description || '',
        date: formattedDate,
        link: `/blogs/${post.canonical}`,
        isFeatured: post.order === 1,
        category: category
      };
    });

    return <BlogSection posts={posts} />;
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-red-500">Error loading blog posts. Please try again later.</p>
        </div>
      </section>
    );
  }
}
