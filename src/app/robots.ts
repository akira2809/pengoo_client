import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://pengoo.store/sitemap.xml',
    // Optional: Uncomment if you need to set crawl delay
    // host: 'https://pengoo.store',
  }
}
