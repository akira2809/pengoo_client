// app/sitemap.ts
import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pengoo-back-end.vercel.app';

// Type định nghĩa dữ liệu từ API
interface Product {
  slug: string;
  updatedAt?: string;
}

interface BlogPost {
  slug: string;
  canonical?: string;
  updatedAt?: string;
  created_at?: string;
}

interface Collection {
  slug: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/termsOfServicePolicy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/promotionPolicy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/returnPolicy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/shippingPolicy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/commitment`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const [products, blogPosts, collections] = await Promise.all([
    fetchAPI<Product[]>(`${apiUrl}/products`),
    fetchAPI<BlogPost[]>(`${apiUrl}/posts`),
    fetchAPI<Collection[]>(`${apiUrl}/collections`),
  ]);

  const productPages = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogPages = blogPosts.map((b) => ({
    url: `${baseUrl}/blogs/${b.canonical || b.slug}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(b.created_at || now),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const collectionPages = collections.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages, ...collectionPages];
}

async function fetchAPI<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.error(`❌ Failed to fetch ${url}:`, res.status, res.statusText);
      return [] as T;
    }
    return await res.json();
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    return [] as T;
  }
}
