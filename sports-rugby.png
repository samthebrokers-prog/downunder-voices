import type { CategorySlug } from '@/lib/news-data'

export type FeedItem = {
  title: string
  link: string
  description: string
  publishedAt: string
  imageUrl?: string
}

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function stripHtml(value: string) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tag(block: string, names: string[]) {
  for (const name of names) {
    const escaped = name.replace(':', '\\:')
    const match = block.match(
      new RegExp(
        `<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`,
        'i',
      ),
    )

    if (match) {
      return decodeEntities(match[1]).trim()
    }
  }

  return ''
}

function attribute(
  block: string,
  tagName: string,
  attributeName: string,
) {
  const escaped = tagName.replace(':', '\\:')

  const match = block.match(
    new RegExp(
      `<${escaped}\\b[^>]*\\b${attributeName}=["']([^"']+)["'][^>]*>`,
      'i',
    ),
  )

  return match?.[1] ? decodeEntities(match[1]).trim() : ''
}

function linkFromBlock(block: string) {
  const direct = tag(block, ['link'])

  if (direct && !direct.includes('<')) {
    return direct
  }

  return attribute(block, 'link', 'href') || tag(block, ['guid'])
}

function validImageUrl(value?: string) {
  if (!value) return undefined

  const cleaned = decodeEntities(value).trim()

  if (
    cleaned.startsWith('https://') ||
    cleaned.startsWith('http://')
  ) {
    return cleaned
  }

  return undefined
}

function imageFromBlock(block: string): string | undefined {
  const rawDescription = tag(block, [
    'content:encoded',
    'description',
    'summary',
    'content',
  ])

  const candidates = [
    attribute(block, 'media:content', 'url'),
    attribute(block, 'media:thumbnail', 'url'),
    attribute(block, 'enclosure', 'url'),
    tag(block, ['image']),
    block.match(
      /<image[^>]*>[\s\S]*?<url[^>]*>([\s\S]*?)<\/url>/i,
    )?.[1],
    rawDescription.match(
      /<img[^>]+(?:src|data-src|data-original)=["']([^"']+)["']/i,
    )?.[1],
    block.match(
      /<img[^>]+(?:src|data-src|data-original)=["']([^"']+)["']/i,
    )?.[1],
  ]

  for (const candidate of candidates) {
    const imageUrl = validImageUrl(candidate)

    if (imageUrl) {
      return imageUrl
    }
  }

  return undefined
}

export async function fetchFeed(
  feedUrl: string,
): Promise<FeedItem[]> {
  const response = await fetch(feedUrl, {
    headers: {
      'User-Agent':
        'DownunderVoicesBot/1.0 (+https://downundervoices.com)',
    },
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Feed returned ${response.status}`)
  }

  const xml = await response.text()

  const rssBlocks = [
    ...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi),
  ].map((match) => match[1])

  const atomBlocks = [
    ...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi),
  ].map((match) => match[1])

  const blocks = rssBlocks.length ? rssBlocks : atomBlocks

  return blocks
    .map((block) => {
      const title = stripHtml(tag(block, ['title']))
      const link = linkFromBlock(block)

      const rawDescription = tag(block, [
        'content:encoded',
        'description',
        'summary',
        'content',
      ])

      const description = stripHtml(rawDescription).slice(0, 600)

      const rawDate = stripHtml(
        tag(block, [
          'pubDate',
          'published',
          'updated',
          'dc:date',
        ]),
      )

      const parsedDate = rawDate
        ? new Date(rawDate)
        : new Date()

      return {
        title,
        link,
        description,
        publishedAt: Number.isNaN(parsedDate.valueOf())
          ? new Date().toISOString()
          : parsedDate.toISOString(),
        imageUrl: imageFromBlock(block),
      }
    })
    .filter((item) => item.title && item.link)
}

export function classifyCategory(
  title: string,
  description: string,
  fallback: CategorySlug,
) {
  const haystack = `${title} ${description}`.toLowerCase()

  const rules: Array<[CategorySlug, RegExp]> = [
    [
      'sports',
      /sport|rugby|cricket|football|soccer|netball|league|afl|olympic/,
    ],
    [
      'business',
      /business|economy|company|jobs|employment|bank|interest rate|inflation|trade/,
    ],
    [
      'politics',
      /government|parliament|minister|election|policy|council|politic/,
    ],
    [
      'community',
      /community|volunteer|charity|school|family|health|housing|local/,
    ],
    [
      'australia',
      /australia|australian|sydney|melbourne|perth|brisbane|canberra/,
    ],
    [
      'nz-pacific',
      /new zealand|aotearoa|auckland|wellington|pacific|fiji|tonga|samoa/,
    ],
  ]

  return (
    rules.find(([, rule]) => rule.test(haystack))?.[0] ??
    fallback
  )
}
