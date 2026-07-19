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

function splitIntoSentences(text: string): string[] {
  const cleaned = cleanText(text)

  if (!cleaned) {
    return []
  }

  const matches = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g)

  if (!matches) {
    return []
  }

  return matches
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)
}

function ensureSentenceEnding(text: string): string {
  const cleaned = cleanText(text)

  if (!cleaned) {
    return ''
  }

  if (/[.!?]$/.test(cleaned)) {
    return cleaned
  }

  return `${cleaned}.`
}

function buildExpandedSummary(
  title: string,
  description: string | null | undefined,
  sourceName: string,
  category: CategorySlug,
): string {
  const cleanedTitle = cleanText(title)
  const cleanedDescription = cleanText(description)

  const sentences = splitIntoSentences(cleanedDescription).map(
    ensureSentenceEnding,
  )

  if (sentences.length === 0) {
    sentences.push(
      ensureSentenceEnding(
        `${sourceName} has released an update concerning ${cleanedTitle}`,
      ),
    )
  }

  const categoryName = category.replace(/-/g, ' ')

  const supportingSentences = [
    `The information currently available was supplied through ${sourceName}.`,
    `The development is being covered in the ${categoryName} section of Downunder Voices.`,
    'The issue may be relevant to communities across New Zealand, Australia or the wider Pacific region.',
    'Readers should consult the original source for the complete report and any official statements.',
    'Further information may become available as the organisations or people involved provide additional updates.',
    'Downunder Voices will continue to follow important developments connected with this story.',
    'This article is a summary of information supplied by the original publisher and is not presented as independent eyewitness reporting.',
  ]

  for (const supportingSentence of supportingSentences) {
    if (sentences.length >= 6) {
      break
    }

    const completedSentence = ensureSentenceEnding(supportingSentence)

    const alreadyIncluded = sentences.some(
      (sentence) =>
        sentence.toLowerCase() === completedSentence.toLowerCase(),
    )

    if (!alreadyIncluded) {
      sentences.push(completedSentence)
    }
  }

  return sentences.join(' ')
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

        const expandedSummary = buildExpandedSummary(
          item.title,
          item.description,
          source.name,
          category,
        )

        await dbRequest('stories', {
          method: 'POST',
          body: {
            slug: uniqueSlug(item.title, item.link),
            title: cleanText(item.title),
            category,
            summary: expandedSummary,
            source_name: source.name,
            source_url: item.link,
            image_url: item.imageUrl || null,
            community_angle:
              'This update may affect communities across New Zealand, Australia or the Pacific. Readers can visit the original publisher for the complete report, official documents and any later corrections.',
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
