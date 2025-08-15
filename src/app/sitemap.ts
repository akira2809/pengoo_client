import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pengoo-back-end.vercel.app'

// Type definitions based on your API structure
interface Product {
  slug: string
  updated_at?: string
  status?: string
}

interface BlogPost {
  slug: string
  canonical?: string
  updated_at?: string
  created_at?: string
  status?: string
}

interface Collection {
  slug: string
  updated_at?: string
}

// Generic API fetch function
async function fetchAPI<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!res.ok) {
      console.error(`❌ Failed to fetch ${url}:`, res.status, res.statusText)
      return [] as T
    }
    
    const data = await res.json()
    // Handle both direct array and data.data structure
    return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []) as T
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error)
    return [] as T
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  
  // Static pages (based on your original sitemap)
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
    { url: `${baseUrl}/checkout`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/account`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/signin`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Fetch dynamic content from your APIs
  const [products, blogPosts, collections] = await Promise.all([
    fetchAPI<Product[]>(`${apiUrl}/products`),
    fetchAPI<BlogPost[]>(`${apiUrl}/posts`), // Using your original endpoint
    fetchAPI<Collection[]>(`${apiUrl}/collections`),
  ])

  // Generate product pages
  const productPages: MetadataRoute.Sitemap = products
    .filter(product => product.slug && product.status !== 'inactive')
    .map(product => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Generate blog pages
  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter(blog => (blog.slug || blog.canonical) && blog.status !== 'draft')
    .map(blog => ({
      url: `${baseUrl}/blogs/${blog.canonical || blog.slug}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(blog.created_at || now),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Generate collection pages
  const collectionPages: MetadataRoute.Sitemap = collections
    .filter(collection => collection.slug)
    .map(collection => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: collection.updated_at ? new Date(collection.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  console.log(`Generated sitemap with ${staticPages.length} static pages, ${productPages.length} products, ${blogPages.length} blogs, ${collectionPages.length} collections`)

  return [
    ...staticPages,
    ...productPages,
    ...blogPages,
    ...collectionPages,
  ]
}