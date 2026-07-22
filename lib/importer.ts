import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { classifyCategory, fetchFeed } from '@/lib/rss'
import { uniqueSlug } from '@/lib/slug'
import type { CategorySlug } from '@/lib/news-data'

type SourceRow = {
  id: string
  name: string
  feed_url: string
  site_url: string | null
  default_category: CategorySlug
  source_type: 'official' | 'commercial'
  auto_publish: boolean
}

export type ImportResult = {
  source: string
  imported: number
  skipped: number
  error: string | null
}

function cleanText(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function runNewsImport(): Promise<ImportResult[]> {
  if (!isDatabaseConfigured()) {
    throw new Error('Database is not configured')
  }

  const sources = await dbRequest<SourceRow[]>('news_sources', {
    query: '?select=*&active=eq.true&order=name.asc',
  })

  const results: ImportResult[] = []

  for (const source of sources) {
    const started = Date.now()
    let imported = 0
    let skipped = 0
    let errorMessage: string | null = null

    try {
      const items = (await fetchFeed(source.feed_url)).slice(0, 20)

      for (const item of items) {
        const existing = await dbRequest<Array<{ id: string }>>('stories', {
          query: `?select=id&source_url=eq.${encodeURIComponent(
            item.link,
          )}&limit=1`,
        })

        if (existing.length > 0) {
          skipped += 1
          continue
        }

        const category = classifyCategory(
          item.title,
          item.description,
          source.default_category,
        )

        const status =
          source.auto_publish && source.source_type === 'official'
            ? 'published'
            : 'draft'

        await dbRequest('stories', {
          method: 'POST',
          body: {
            slug: uniqueSlug(item.title, item.link),
            title: cleanText(item.title),
            category,
            summary: cleanText(item.description),
            source_name: source.name,
            source_url: item.link,
            image_url: item.imageUrl || null,
            community_angle: '',
            status,
            published_at:
              status === 'published' ? item.publishedAt : null,
            import_method: 'rss',
            source_id: source.id,
          },
        })

        imported += 1
      }
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : String(error)

      console.error(`News import failed for ${source.name}:`, error)
    }

    await dbRequest('import_logs', {
      method: 'POST',
      body: {
        source_id: source.id,
        source_name: source.name,
        imported_count: imported,
        skipped_count: skipped,
        error_message: errorMessage,
        duration_ms: Date.now() - started,
      },
    })

    results.push({
      source: source.name,
      imported,
      skipped,
      error: errorMessage,
    })
  }

  return results
}
