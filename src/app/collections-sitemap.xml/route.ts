import { NextResponse } from 'next/server'

interface CollectionData {
  id: number
  slug: string
  name: string
  description?: string
  updated_at?: string
  created_at?: string
  image?: string
}

async function fetchCollections(): Promise<CollectionData[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pengoo-back-end.vercel.app'
    const response = await fetch(`${apiUrl}/collections`, {
      cache: 'no-store' // Always fetch fresh data for sitemap
    })
    
    if (!response.ok) {
      console.error('Failed to fetch collections for sitemap:', response.status)
      return []
    }
    
    const data = await response.json()
    // Handle both direct array and data.data structure
    return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
  } catch (error) {
    console.error('Error fetching collections for sitemap:', error)
    return []
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store'
  const collections = await fetchCollections()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${collections
  .filter(collection => collection.slug)
  .map(collection => {
    const lastModified = collection.updated_at 
      ? new Date(collection.updated_at).toISOString()
      : new Date().toISOString()
    
    const imageTag = collection.image
      ? `    <image:image>
      <image:loc>${collection.image}</image:loc>
      <image:title>${collection.name}</image:title>
    </image:image>`
      : ''

    return `  <url>
    <loc>${baseUrl}/collections/${collection.slug}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
${imageTag}
  </url>`
  }).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  })
}