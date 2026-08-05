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

const MAX_AI_ARTICLES_PER_RUN = 5
const MAX_ITEMS_PER_SOURCE = 20

function sourceRegion(
  source: SourceRow,
): 'australia' | 'nz-pacific' | null {
  const sourceText = [
    source.name,
    source.feed_url,
    source.site_url || '',
  ]
    .join(' ')
    .toLowerCase()

  const australianSignals = [
    '.gov.au',
    '.com.au',
    '.org.au',
    'abc.net.au',
    'sbs.com.au',
    'australia',
    'western australia',
    'new south wales',
    'victoria',
    'queensland',
    'south australia',
    'tasmania',
    'northern territory',
    'act government',
  ]

  const nzPacificSignals = [
    '.govt.nz',
    '.co.nz',
    '.org.nz',
    'rnz.co.nz',
    'beehive.govt.nz',
    'new zealand',
    'aotearoa',
    'fiji',
    'samoa',
    'tonga',
    'nauru',
    'vanuatu',
    'solomon islands',
    'cook islands',
    'niue',
    'papua new guinea',
    'pacific',
  ]

  if (
    australianSignals.some((signal) =>
      sourceText.includes(signal),
    )
  ) {
    return 'australia'
  }

  if (
    nzPacificSignals.some((signal) =>
      sourceText.includes(signal),
    )
  ) {
    return 'nz-pacific'
  }

  return null
}

function protectRegionalCategory(
  category: CategorySlug,
  source: SourceRow,
): CategorySlug {
  const region = sourceRegion(source)

  if (
    region === 'australia' &&
    category === 'nz-pacific'
  ) {
    return 'australia' as CategorySlug
  }

  if (
    region === 'nz-pacific' &&
    category === 'australia'
  ) {
    return 'nz-pacific' as CategorySlug
  }

  return category
}

function cleanText(
  value: string | null | undefined,
): string {
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
    .replace(
      /Get our breaking news email[^.]*\.?/gi,
      ' ',
    )
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
    text.match(
      /[^.!?]+[.!?]+(?:["'’”)]*)|[^.!?]+$/g,
    ) ?? [text]

  return sentences
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 5)
    .join(' ')
    .slice(0, 1200)
    .trim()
}

function metaContent(
  html: string,
  key: string,
): string {
  const escaped = key.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  )

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

    const contentType =
      response.headers.get('content-type') || ''

    if (!contentType.includes('text/html')) {
      return { description: '' }
    }

    const html = (await response.text()).slice(
      0,
      400_000,
    )

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
    console.error(
      'Article metadata fetch failed:',
      error,
    )

    return { description: '' }
  }
}

export async function runNewsImport(): Promise<
  ImportResult[]
> {
  if (!isDatabaseConfigured()) {
    throw new Error('Database is not configured')
  }

  const sources = await dbRequest<SourceRow[]>(
    'news_sources',
    {
      query:
        '?select=*&active=eq.true&order=name.asc',
    },
  )

  const results: ImportResult[] = []

  let aiArticlesCreated = 0

  for (const source of sources) {
    const started = Date.now()

    let imported = 0
    let skipped = 0
    let errorMessage: string | null = null

    try {
      const items = (
        await fetchFeed(source.feed_url)
      ).slice(0, MAX_ITEMS_PER_SOURCE)

      for (const item of items) {
        const existing = await dbRequest<
          Array<{ id: string }>
        >('stories', {
          query: `?select=id&source_url=eq.${encodeURIComponent(
            item.link,
          )}&limit=1`,
        })

        if (existing.length > 0) {
          skipped += 1
          continue
        }

        let originalSummary =
          firstFiveSentences(item.description)

        let imageUrl = item.imageUrl

        if (
          originalSummary.length < 90 ||
          !imageUrl
        ) {
          const metadata =
            await fetchArticleMetadata(item.link)

          if (
            originalSummary.length < 90 &&
            metadata.description
          ) {
            originalSummary =
              metadata.description
          }

          if (!imageUrl && metadata.imageUrl) {
            imageUrl = metadata.imageUrl
          }
        }

        if (!originalSummary) {
          originalSummary =
            firstFiveSentences(item.title)
        }

        const originalTitle =
          cleanText(item.title)

        const classifiedInitialCategory =
          classifyCategory(
            originalTitle,
            originalSummary,
            source.default_category,
          )

        const initialCategory =
          protectRegionalCategory(
            classifiedInitialCategory,
            source,
          )

        const canAutoPublish =
          source.auto_publish &&
          source.source_type === 'official'

        const canUseAi =
          canAutoPublish &&
          aiArticlesCreated <
            MAX_AI_ARTICLES_PER_RUN

        let finalTitle = originalTitle
        let finalSummary = originalSummary
        let communityAngle = ''
        let finalCategory = initialCategory
        let status: 'published' | 'draft' =
          'draft'
        let importMethod = 'rss'

        if (canUseAi) {
          console.log(
            `Sending article to OpenAI: ${originalTitle}`,
          )

          const writtenArticle =
            await writeArticle({
              title: originalTitle,
              summary: originalSummary,
              sourceName: source.name,
              sourceUrl: item.link,
              category: initialCategory,
            })

          finalTitle =
            cleanText(writtenArticle.title) ||
            originalTitle

          finalSummary =
            cleanText(writtenArticle.summary) ||
            originalSummary

          communityAngle = cleanText(
            writtenArticle.communityAngle,
          )

          const classifiedFinalCategory =
            classifyCategory(
              finalTitle,
              finalSummary,
              initialCategory,
            )

          finalCategory =
            protectRegionalCategory(
              classifiedFinalCategory,
              source,
            )

          status = 'published'
          importMethod = 'rss-ai'
          aiArticlesCreated += 1

          console.log(
            `AI article prepared: ${finalTitle}`,
          )
        } else if (canAutoPublish) {
          /*
           * Official stories beyond the five-article
           * AI limit remain drafts for later review.
           */
          status = 'draft'
          importMethod = 'rss'
        }

        await dbRequest('stories', {
          method: 'POST',
          body: {
            slug: uniqueSlug(
              finalTitle,
              item.link,
            ),
            title: finalTitle,
            category: finalCategory,
            summary: finalSummary,
            source_name: source.name,
            source_url: item.link,
            image_url:
              imageUrl || DEFAULT_NEWS_IMAGE,
            community_angle: communityAngle,
            status,
            published_at:
              status === 'published'
                ? item.publishedAt
                : null,
            import_method: importMethod,
            source_id: source.id,
          },
        })

        imported += 1

        console.log(
          `Imported ${status} story: ${finalTitle}`,
        )
      }
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : String(error)

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

  console.log(
    `News import completed. AI articles created: ${aiArticlesCreated}`,
  )

  return results
}
