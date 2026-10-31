import type { MetadataRoute } from 'next'
import { categories } from '@/lib/news-data'
import { getPublishedStories } from '@/lib/story-service'
import { isOriginalStory } from '@/lib/original-content'

const base = 'https://www.downundervoices.com'

export const revalidate = 900

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // getPublishedStories already falls back to the seed newsroom when the
  // database is unavailable, so the sitemap should never silently lose all
  // story URLs just because database configuration is missing at build time.
  // Only our own work is listed for Google (see lib/original-content.ts).
  const stories = (await getPublishedStories(1000)).filter(isOriginalStory)

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${base}/latest`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...stories.map((story) => ({
      url: `${base}/story/${encodeURIComponent(story.slug ?? story.id)}`,
      lastModified: new Date(story.publishedAt ?? story.date),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...[
      'about',
      'contact',
      'submit',
      'editorial-policy',
      'corrections',
      'advertise',
      'radio',
    ].map((path) => ({
      url: `${base}/${path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ]
}
