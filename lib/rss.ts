import type { CategorySlug } from '@/lib/news-data'
import { normaliseCategorySlug } from '@/lib/news-data'

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

function tag(
  block: string,
  names: string[],
): string {
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

  return match?.[1]
    ? decodeEntities(match[1]).trim()
    : ''
}

function linkFromBlock(block: string): string {
  const direct = tag(block, ['link'])

  if (direct && !direct.includes('<')) {
    return direct
  }

  return (
    attribute(block, 'link', 'href') ||
    tag(block, ['guid'])
  )
}

function validImageUrl(
  value?: string,
): string | undefined {
  if (!value) return undefined

  const cleaned = decodeEntities(value).trim()

  if (!/^https?:\/\//i.test(cleaned)) {
    return undefined
  }

  if (
    /\.(mp3|mp4|m4a|wav|ogg|pdf)(\?|$)/i.test(
      cleaned,
    )
  ) {
    return undefined
  }

  return cleaned
}

function imageFromBlock(
  block: string,
): string | undefined {
  const rawDescription = tag(block, [
    'content:encoded',
    'description',
    'summary',
    'content',
  ])

  const enclosureType = attribute(
    block,
    'enclosure',
    'type',
  )

  const enclosureUrl = /image\//i.test(
    enclosureType,
  )
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
    throw new Error(
      `Feed returned ${response.status}`,
    )
  }

  const xml = await response.text()

  const rssBlocks = [
    ...xml.matchAll(
      /<item\b[^>]*>([\s\S]*?)<\/item>/gi,
    ),
  ].map((match) => match[1])

  const atomBlocks = [
    ...xml.matchAll(
      /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi,
    ),
  ].map((match) => match[1])

  const blocks = rssBlocks.length
    ? rssBlocks
    : atomBlocks

  return blocks
    .map((block) => {
      const title = stripHtml(
        tag(block, ['title']),
      )

      const link = linkFromBlock(block)

      const rawDescription = tag(block, [
        'content:encoded',
        'description',
        'summary',
        'content',
      ])

      const description = stripHtml(
        rawDescription,
      ).slice(0, 1200)

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
        publishedAt: Number.isNaN(
          parsedDate.valueOf(),
        )
          ? new Date().toISOString()
          : parsedDate.toISOString(),
        imageUrl: imageFromBlock(block),
      }
    })
    .filter(
      (item) => item.title && item.link,
    )
}

export function classifyCategory(
  title: string,
  description: string,
  fallback: CategorySlug,
): CategorySlug {
  const cleanTitle = title.toLowerCase()

  const haystack =
    `${title} ${description}`.toLowerCase()

  const sportsRule =
    /\b(sport|sports|rugby|cricket|football|soccer|netball|nrl|afl|league|olympic|olympics|tennis|golf|basketball|championship|tournament|match|coach|player|team|all blacks|wallabies)\b/i

  const tradeLogisticsRule =
    /\b(customs|customs clearance|border force|biosecurity|mpi|daff|freight|freight forwarding|freight forwarder|shipping|shipping line|container|containers|cargo|air cargo|sea freight|air freight|logistics|supply chain|port|ports|terminal|import|imports|importing|export|exports|exporting|tariff|customs duty|trade agreement|bill of lading|demurrage|detention|warehouse|warehousing)\b/i

  const smallBusinessRule =
    /\b(small business|small businesses|medium business|medium businesses|medium-sized business|sme|smes|startup|start-up|startups|start-ups|entrepreneur|entrepreneurs|entrepreneurship|family business|family businesses|sole trader|sole traders|business owner|business owners|business grant|business grants|local business|local businesses|microbusiness|microenterprise|micro-enterprise|e-commerce business|small retailer|small retailers|small employer|small employers)\b/i

  const corporateFinanceRule =
    /\b(earnings call|earnings report|quarterly earnings|q1 earnings|q2 earnings|q3 earnings|q4 earnings|share price|stock price|stock market|shares|shareholder|shareholders|dividend|dividends|market cap|market capitalisation|market capitalization|nasdaq|nyse|asx 200|s&p 500|dow jones|analyst rating|price target|insider sold|insider sale|board member sold|equity stake|securities filing|sec filing)\b/i

  const socialIssuesRule =
    /\b(cost of living|housing affordability|housing crisis|homeless|homelessness|rental crisis|rent crisis|mental health|domestic violence|family violence|disability|disabled|aged care|elderly|seniors|poverty|financial hardship|welfare|social services|healthcare|health care|hospital|hospitals|education|international student|international students|university fees|tuition fees|student housing|child protection|youth crime|food insecurity|community safety|consumer rights)\b/i

  const communityRule =
    /\b(community group|community groups|volunteer|volunteers|charity|charitable|fundraiser|fundraising|local event|community event|neighbourhood|neighborhood|non-profit|not-for-profit|community centre|community center|cultural festival|local club|community organisation|community organization)\b/i

  const australiaRule =
    /\b(australia|australian|new south wales|queensland|victoria|western australia|south australia|tasmania|northern territory|act government|sydney|melbourne|brisbane|perth|adelaide|canberra|darwin|hobart|gold coast)\b/i

  const newZealandRule =
    /\b(new zealand|aotearoa|new zealander|new zealanders|kiwi|kiwis|auckland|wellington|christchurch|hamilton|tauranga|dunedin|rotorua|palmerston north|napier|nelson|queenstown)\b/i

  const worldRule =
    /\b(united states|usa|u\.s\.|america|american|united kingdom|britain|british|england|europe|european union|china|chinese|india|indian|japan|japanese|canada|canadian|germany|france|ukraine|russia|russian|middle east|israel|gaza|iran|iraq|africa|south africa|asia|fiji|fijian|tonga|tongan|samoa|samoan|vanuatu|solomon islands|papua new guinea|cook islands|niue|kiribati|tuvalu|new caledonia|pacific islands)\b/i

  // Headline first

  if (sportsRule.test(cleanTitle)) {
    return 'sports'
  }

  if (tradeLogisticsRule.test(cleanTitle)) {
    return 'trade-logistics'
  }

  if (smallBusinessRule.test(cleanTitle)) {
    return 'small-business'
  }

  if (socialIssuesRule.test(cleanTitle)) {
    return 'social-issues'
  }

  if (communityRule.test(cleanTitle)) {
    return 'community'
  }

  if (australiaRule.test(cleanTitle)) {
    return 'australia'
  }

  if (newZealandRule.test(cleanTitle)) {
    return 'new-zealand'
  }

  if (worldRule.test(cleanTitle)) {
    return 'world'
  }

  // Headline + description

  if (sportsRule.test(haystack)) {
    return 'sports'
  }

  if (tradeLogisticsRule.test(haystack)) {
    return 'trade-logistics'
  }

  if (smallBusinessRule.test(haystack)) {
    return 'small-business'
  }

  if (socialIssuesRule.test(haystack)) {
    return 'social-issues'
  }

  if (communityRule.test(haystack)) {
    return 'community'
  }

  if (australiaRule.test(haystack)) {
    return 'australia'
  }

  if (newZealandRule.test(haystack)) {
    return 'new-zealand'
  }

  if (worldRule.test(haystack)) {
    return 'world'
  }

  // Generic listed-company and stock-market stories
  // should not become Small Business.

  if (corporateFinanceRule.test(haystack)) {
    return 'world'
  }

  // Old generic Business feeds should not automatically
  // become Small Business. Only explicit SME stories above
  // should enter Small Business.

  if (
    fallback === 'business' ||
    fallback === 'small-business'
  ) {
    return 'world'
  }

  return normaliseCategorySlug(fallback)
}
