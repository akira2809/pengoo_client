const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pengoo-back-end.vercel.app';

// Interface for blog post from API
export interface ApiBlogPost {
  id: number;
  name: string;
  canonical: string;
  description: string;
  content: string;
  meta_description: string;
  meta_keyword: string;
  meta_title: string;
  image: string;
  order: number;
  publish: boolean;
  created_at: string;
  updated_at: string;
  catalogue?: {
    id: number;
    name: string;
    canonical: string;
  };
}

// Cache for storing the posts promise to prevent duplicate requests
let postsCache: Promise<ApiBlogPost[]> | null = null;

// Clear cache after 1 hour
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
let lastFetchTime = 0;

export async function fetchAllPosts(): Promise<ApiBlogPost[]> {
  const now = Date.now();
  const isCacheValid = now - lastFetchTime < CACHE_DURATION;

  // If we have a valid cache, return it
  if (postsCache && isCacheValid) {
    return postsCache;
  }

  try {
    // Create a new promise for the fetch request
    const fetchPromise = (async () => {
      const res = await fetch(`${API_URL}/posts`, { 
        next: { 
          revalidate: 3600, // Revalidate every hour
          tags: ['posts']
        },
        cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache'
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      // If the API returns an array directly, return it
      // Otherwise, check if it's an object with a data property
      const allPosts = Array.isArray(data) ? data : (data.data || data);

      lastFetchTime = Date.now();
      return allPosts;
    })();

    // Cache the promise
    postsCache = fetchPromise;
    
    // Clear cache on error
    fetchPromise.catch(() => {
      postsCache = null;
    });

    return await fetchPromise;
  } catch (error) {
    console.error('Error in fetchAllPosts:', error);
    // Clear cache on error
    postsCache = null;
    throw error; // Re-throw to be handled by the component
  }
}

export async function fetchPostBySlug(slug: string) {
  const res = await fetch(`${API_URL}/posts/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}