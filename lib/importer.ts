import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { writeArticle } from '@/lib/ai-writer'
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

const DEFAULT_NEWS_IMAGE =
  'https://www.downundervoices.com/images/downunder-default-news.jpg'

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
    .slice(0, 1200)
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

    if (match?.[1]) {
      return cleanText(match[1])
    }
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

    if (!response.ok) {
      return { description: '' }
    }

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
  } catch (error) {
    console.error('Article metadata fetch failed:', error)

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

  /*
   * TEMPORARY CONTROLLED TEST:
   * Use only one official source that is approved for automatic publishing.
   */
  const testSources = sources
    .filter(
      (source) =>
        source.auto_publish &&
        source.source_type === 'official',
    )
    .slice(0, 1)

  const results: ImportResult[] = []

  for (const source of testSources) {
    const started = Date.now()
    let imported = 0
    let skipped = 0
    let errorMessage: string | null = null

    try {
      /*
       * Check up to 10 feed items so the importer can move past
       * stories that are already in the database.
       *
       * The loop stops immediately after one new story is imported.
       */
      const items = (await fetchFeed(source.feed_url)).slice(0, 10)

      for (const item of items) {
        if (imported >= 1) {
          break
        }

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

        let originalSummary = firstFiveSentences(item.description)
        let imageUrl = item.imageUrl

        if (originalSummary.length < 90 || !imageUrl) {
          const metadata = await fetchArticleMetadata(item.link)

          if (
            originalSummary.length < 90 &&
            metadata.description
          ) {
            originalSummary = metadata.description
          }

          if (!imageUrl && metadata.imageUrl) {
            imageUrl = metadata.imageUrl
          }
        }

        if (!originalSummary) {
          originalSummary = firstFiveSentences(item.title)
        }

        const originalTitle = cleanText(item.title)

        const category = classifyCategory(
          originalTitle,
          originalSummary,
          source.default_category,
        )

        console.log(
          `Sending one test article to OpenAI from ${source.name}`,
        )

        const writtenArticle = await writeArticle({
          title: originalTitle,
          summary: originalSummary,
          sourceName: source.name,
          sourceUrl: item.link,
          category,
        })

        const finalTitle =
          cleanText(writtenArticle.title) || originalTitle

        const finalSummary =
          cleanText(writtenArticle.summary) || originalSummary

        const communityAngle = cleanText(
          writtenArticle.communityAngle,
        )

        const finalImageUrl =
          imageUrl || DEFAULT_NEWS_IMAGE

        await dbRequest('stories', {
          method: 'POST',
          body: {
            slug: uniqueSlug(finalTitle, item.link),
            title: finalTitle,
            category,
            summary: finalSummary,
            source_name: source.name,
            source_url: item.link,
            image_url: finalImageUrl,
            community_angle: communityAngle,
            status: 'published',
            published_at: item.publishedAt,
            import_method: 'rss-ai',
            source_id: source.id,
          },
        })

        imported += 1

        console.log(
          `AI test article imported successfully: ${finalTitle}`,
        )
      }
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : String(error)

      console.error(
        `News import failed for ${source.name}:`,
        error,
      )
    }

    try {
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
    } catch (logError) {
      console.error(
        `Import log failed for ${source.name}:`,
        logError,
      )
    }

    results.push({
      source: source.name,
      imported,
      skipped,
      error: errorMessage,
    })
  }

  return results
}
