const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchAllPosts() {
  const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPostBySlug(slug: string) {
  const res = await fetch(`${API_URL}/posts/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}