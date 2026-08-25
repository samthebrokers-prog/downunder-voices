import type { MetadataRoute } from 'next'
import { categories } from '@/lib/news-data'
import { getPublishedStories } from '@/lib/story-service'
import { isDatabaseConfigured } from '@/lib/db'

const base = 'https://www.downundervoices.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = isDatabaseConfigured()
    ? await getPublishedStories(500)
    : []

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...[
      'about',
      'contact',
      'submit',
      'privacy',
      'terms',
      'editorial-policy',
      'corrections',
      'copyright',
      'advertise',
    ].map((path) => ({
      url: `${base}/${path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
    ...stories.map((story) => ({
      url: `${base}/story/${story.slug ?? story.id}`,
      lastModified: new Date(story.publishedAt ?? story.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
