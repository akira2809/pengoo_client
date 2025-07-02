// app/blog/[slug]/page.tsx
import BlogPostDetail from '@/components/layouts/Blog/BlogPostDetail';
import { fetchPostBySlug } from '@/app/api/services/blogApi';
import { notFound } from 'next/navigation';

function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const PLACEHOLDER_IMAGE = '/placeholder.jpg';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const mappedPost = {
    id: post.id.toString(),
    imageSrc: isValidImageUrl(post.image) ? post.image : PLACEHOLDER_IMAGE,
    title: post.name,
    excerpt: post.description,
    date: post.created_at?.slice(0, 10),
    link: `/blogs/${post.canonical}`,
    content: [post.content],
  };

  return (
    <>
      <title>{post.name} - Blog</title>
      <meta name="description" content={post.description} />
      <BlogPostDetail post={mappedPost} />
    </>
  );
}