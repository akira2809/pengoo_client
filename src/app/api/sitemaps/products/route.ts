import { NextResponse } from 'next/server'

interface ProductData {
  slug: string
  product_name?: string
  updated_at?: string
  status?: string
  images?: Array<{ url: string }>
}

async function fetchProducts(): Promise<ProductData[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pengoo-back-end.vercel.app'
    const response = await fetch(`${apiUrl}/products`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch products for sitemap:', response.status)
      return []
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    return []
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store'
  const products = await fetchProducts()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products
  .filter(product => product.slug && product.status !== 'inactive')
  .map(product => {
    const lastModified = product.updated_at 
      ? new Date(product.updated_at).toISOString()
      : new Date().toISOString()
    
    const imageTag = product.images && product.images.length > 0
      ? `    <image:image>
      <image:loc>${product.images[0].url}</image:loc>
      <image:title>${product.product_name || 'Product Image'}</image:title>
    </image:image>`
      : ''

    return `  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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