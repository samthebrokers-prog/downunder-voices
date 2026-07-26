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

type ArticleMetadata = {
  description: string
  imageUrl?: string
}

function cleanText(value: string | null | undefined): string {
  if (!value) return ''

  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function removeFeedNoise(value: string): string {
  return value
    .replace(/Get our breaking news email[^.]*\.?/gi, ' ')
    .replace(/Continue reading\.{0,3}/gi, ' ')
    .replace(/Read more\.{0,3}/gi, ' ')
    .replace(
      /The information currently available was supplied through[\s\S]*$/i,
      ' ',
    )
    .replace(/\s+/g, ' ')
    .trim()
}

function firstFiveSentences(value: string): string {
  const text = removeFeedNoise(cleanText(value))
  if (!text) return ''

  const sentences =
    text.match(/[^.!?]+[.!?]+(?:["'’”)]*)|[^.!?]+$/g) ?? [text]

  return sentences
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 5)
    .join(' ')
    .slice(0, 1000)
    .trim()
}

function metaContent(html: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      'i',
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`,
      'i',
    ),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return cleanText(match[1])
  }

  return ''
}

async function fetchArticleMetadata(
  url: string,
): Promise<ArticleMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'DownunderVoicesBot/1.0 (+https://downundervoices.com)',
      },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
      redirect: 'follow',
    })

    if (!response.ok) return { description: '' }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return { description: '' }
    }

    const html = (await response.text()).slice(0, 400_000)

    const description =
      metaContent(html, 'og:description') ||
      metaContent(html, 'twitter:description') ||
      metaContent(html, 'description')

    const imageUrl =
      metaContent(html, 'og:image:secure_url') ||
      metaContent(html, 'og:image') ||
      metaContent(html, 'twitter:image') ||
      undefined

    return {
      description: firstFiveSentences(description),
      imageUrl:
        imageUrl && /^https?:\/\//i.test(imageUrl)
          ? imageUrl
          : undefined,
    }
  } catch {
    return { description: '' }
  }
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
        const existing = await dbRequest<Array<{ id: string }>>(
          'stories',
          {
            query: `?select=id&source_url=eq.${encodeURIComponent(
              item.link,
            )}&limit=1`,
          },
        )

        if (existing.length > 0) {
          skipped += 1
          continue
        }

        let summary = firstFiveSentences(item.description)
        let imageUrl = item.imageUrl

        if (summary.length < 90 || !imageUrl) {
          const metadata = await fetchArticleMetadata(item.link)

          if (summary.length < 90 && metadata.description) {
            summary = metadata.description
          }

          if (!imageUrl && metadata.imageUrl) {
            imageUrl = metadata.imageUrl
          }
        }

        if (!summary) {
          summary = firstFiveSentences(item.title)
        }

        const category = classifyCategory(
          item.title,
          summary,
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
            summary,
            source_name: source.name,
            source_url: item.link,
            image_url: imageUrl || null,
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

      console.error(
        `News import failed for ${source.name}:`,
        error,
      )
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
