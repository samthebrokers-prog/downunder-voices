import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/social-image/'],
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: [
      'https://www.downundervoices.com/sitemap.xml',
      'https://www.downundervoices.com/news-sitemap.xml',
    ],
  }
}
