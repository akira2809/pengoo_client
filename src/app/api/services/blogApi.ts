const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pengoo-back-end.vercel.app';

// Cache posts for 1 hour (3600 seconds) to prevent unnecessary refetches
export async function fetchAllPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`, { 
      next: { 
        revalidate: 3600, // Revalidate every hour
        tags: ['posts'] // Add a cache tag for manual revalidation if needed
      },
      // Only use 'no-store' in development for fresh data
      ...(process.env.NODE_ENV === 'development' ? { cache: 'no-store' } : {})
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error in fetchAllPosts:', error);
    throw error; // Re-throw to be handled by the component
  }
}

export async function fetchPostBySlug(slug: string) {
  const res = await fetch(`${API_URL}/posts/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}