import NewsSection from "@/components/layouts/Blog/NewsSection";
import BlogListSection from "@/components/layouts/Blog/BlogListSection";
import { fetchAllPosts } from "@/app/api/services/blogApi";

// Helper to check if image is valid
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg'; // Place a placeholder image in your public/ folder

export default async function BlogsPage() {
    const posts = await fetchAllPosts();

    const mappedPosts = posts.map((post: any) => ({
        id: post.id.toString(),
        imageSrc: isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE,
        title: post.name,
        excerpt: post.description,
        date: post.created_at?.slice(0, 10),
        link: `/blogs/${post.canonical}`,
        isFeatured: post.order === 1,
    }));

    return (
        <div>
            <NewsSection />
            <BlogListSection posts={mappedPosts} />
        </div>
    );
}