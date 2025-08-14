import { NextResponse } from 'next/server'

interface BlogData {
  slug: string
  canonical?: string
  title?: string
  updated_at?: string
  created_at?: string
  featured_image?: string
  status?: string
}

async function fetchBlogs(): Promise<BlogData[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pengoo-back-end.vercel.app'
    const response = await fetch(`${apiUrl}/posts`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error('Failed to fetch blogs for sitemap:', response.status)
      return []
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
    return []
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store'
  const blogs = await fetchBlogs()

  if (blogs.length === 0) {
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- No blog posts available -->
</urlset>`

    return new NextResponse(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${blogs
  .filter(blog => (blog.slug || blog.canonical) && blog.status !== 'draft')
  .map(blog => {
    const lastModified = blog.updated_at 
      ? new Date(blog.updated_at).toISOString()
      : new Date(blog.created_at || new Date()).toISOString()
    
    const imageTag = blog.featured_image
      ? `    <image:image>
      <image:loc>${blog.featured_image}</image:loc>
      <image:title>${blog.title || 'Blog Post Image'}</image:title>
    </image:image>`
      : ''

    return `  <url>
    <loc>${baseUrl}/blogs/${blog.canonical || blog.slug}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
${imageTag}
  </url>`
  }).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}