import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import {
  stories as seedStories,
  type Story,
  type CategorySlug,
} from '@/lib/news-data'

type StoryRow = {
  id: string
  slug: string
  title: string
  category: CategorySlug
  published_at: string | null
  summary: string
  source_name: string
  source_url: string
  image_url: string | null
  community_angle: string | null
  author: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
}

function rowToStory(row: StoryRow): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: (row.published_at ?? row.created_at).slice(0, 10),
    summary: row.summary,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    image: row.image_url || '/placeholder.svg',
    communityAngle:
      row.community_angle ||
      'This story is included because it may matter to communities across New Zealand, Australia and the Pacific.',
    author: row.author || undefined,
    status: row.status,
    publishedAt: row.published_at || undefined,
  }
}

function seedSorted() {
  return [...seedStories]
    .map((story) => ({ ...story, slug: story.slug ?? story.id, status: 'published' as const }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPublishedStories(limit = 60): Promise<Story[]> {
  if (!isDatabaseConfigured()) return seedSorted().slice(0, limit)

  try {
    const rows = await dbRequest<StoryRow[]>(
      'stories',
      { query: `?select=*&status=eq.published&order=published_at.desc.nullslast,created_at.desc&limit=${limit}` },
    )
    return rows.map(rowToStory)
  } catch (error) {
    console.error('Falling back to seed stories:', error)
    return seedSorted().slice(0, limit)
  }
}

export async function getStoriesByCategory(category: CategorySlug, limit = 30) {
  const stories = await getPublishedStories(100)
  return stories.filter((story) => story.category === category).slice(0, limit)
}

export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  if (!isDatabaseConfigured()) {
    return seedSorted().find((story) => (story.slug ?? story.id) === slug)
  }

  try {
    const rows = await dbRequest<StoryRow[]>(
      'stories',
      { query: `?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1` },
    )
    return rows[0] ? rowToStory(rows[0]) : undefined
  } catch (error) {
    console.error('Story lookup failed:', error)
    return seedSorted().find((story) => (story.slug ?? story.id) === slug)
  }
}

export async function getAllStoriesForAdmin(): Promise<StoryRow[]> {
  if (!isDatabaseConfigured()) return []
  return dbRequest<StoryRow[]>('stories', {
    query: '?select=*&order=created_at.desc&limit=200',
  })
}
