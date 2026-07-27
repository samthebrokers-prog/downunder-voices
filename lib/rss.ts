import type { CategorySlug } from '@/lib/news-data'

export type FeedItem = {
  title: string
  link: string
  description: string
  publishedAt: string
  imageUrl?: string
}

function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function stripHtml(value: string): string {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tag(block: string, names: string[]): string {
  for (const name of names) {
    const escaped = name.replace(':', '\\:')

    const match = block.match(
      new RegExp(
        `<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`,
        'i',
      ),
    )

    if (match?.[1]) {
      return decodeEntities(match[1]).trim()
    }
  }

  return ''
}

function attribute(
  block: string,
  tagName: string,
  attributeName: string,
): string {
  const escaped = tagName.replace(':', '\\:')

  const match = block.match(
    new RegExp(
      `<${escaped}\\b[^>]*\\b${attributeName}=["']([^"']+)["'][^>]*>`,
      'i',
    ),
  )

  return match?.[1] ? decodeEntities(match[1]).trim() : ''
}

function linkFromBlock(block: string): string {
  const direct = tag(block, ['link'])

  if (direct && !direct.includes('<')) {
    return direct
  }

  return attribute(block, 'link', 'href') || tag(block, ['guid'])
}

function validImageUrl(value?: string): string | undefined {
  if (!value) return undefined

  const cleaned = decodeEntities(value).trim()

  if (!/^https?:\/\//i.test(cleaned)) {
    return undefined
  }

  if (/\.(mp3|mp4|m4a|wav|ogg|pdf)(\?|$)/i.test(cleaned)) {
    return undefined
  }

  return cleaned
}

function imageFromBlock(block: string): string | undefined {
  const rawDescription = tag(block, [
    'content:encoded',
    'description',
    'summary',
    'content',
  ])

  const enclosureType = attribute(block, 'enclosure', 'type')

  const enclosureUrl = /image\//i.test(enclosureType)
    ? attribute(block, 'enclosure', 'url')
    : ''

  const candidates = [
    attribute(block, 'media:content', 'url'),
    attribute(block, 'media:thumbnail', 'url'),
    enclosureUrl,
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

      const description = stripHtml(rawDescription).slice(0, 1200)

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
): CategorySlug {
  const cleanTitle = title.toLowerCase()
  const haystack = `${title} ${description}`.toLowerCase()

  const sportsRule =
    /\b(sport|sports|rugby|cricket|football|soccer|netball|nrl|afl|league|olympic|olympics|tennis|golf|basketball|championship|tournament|match|coach|player|team)\b/i

  const politicsRule =
    /\b(government|parliament|prime minister|premier|minister|mp|senator|election|electoral|coalition|opposition|cabinet|policy|political|politics|legislation|bill|referendum|mayor|councillor)\b/i

  const businessRule =
    /\b(business|economy|economic|company|companies|corporate|market|markets|bank|banking|interest rate|inflation|trade|investment|investor|shares|stock market|asx|nzx|profit|revenue|retail|industry|employment|unemployment)\b/i

  const communityRule =
    /\b(community group|volunteer|volunteers|charity|charitable|fundraiser|fundraising|school|schools|student|students|local event|community event|neighbourhood|non-profit|not-for-profit)\b/i

  const australiaRule =
    /\b(australia|australian|new south wales|queensland|victoria|western australia|south australia|tasmania|northern territory|sydney|melbourne|brisbane|perth|adelaide|canberra|darwin|hobart|gold coast)\b/i

  const nzPacificRule =
    /\b(new zealand|aotearoa|new zealander|kiwi|auckland|wellington|christchurch|hamilton|tauranga|dunedin|rotorua|palmerston north|napier|nelson|fiji|fijian|tonga|tongan|samoa|samoan|vanuatu|solomon islands|papua new guinea|cook islands|niue|kiribati|tuvalu|new caledonia)\b/i

  if (sportsRule.test(cleanTitle)) {
    return 'sports'
  }

  if (politicsRule.test(cleanTitle)) {
    return 'politics'
  }

  if (businessRule.test(cleanTitle)) {
    return 'business'
  }

  if (communityRule.test(cleanTitle)) {
    return 'community'
  }

  if (australiaRule.test(cleanTitle)) {
    return 'australia'
  }

  if (nzPacificRule.test(cleanTitle)) {
    return 'nz-pacific'
  }

  if (sportsRule.test(haystack)) {
    return 'sports'
  }

  if (politicsRule.test(haystack)) {
    return 'politics'
  }

  if (businessRule.test(haystack)) {
    return 'business'
  }

  if (australiaRule.test(haystack)) {
    return 'australia'
  }

  if (nzPacificRule.test(haystack)) {
    return 'nz-pacific'
  }

  if (communityRule.test(haystack)) {
    return 'community'
  }

  return fallback
}
