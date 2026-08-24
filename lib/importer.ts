import {
  dbRequest,
  isDatabaseConfigured,
} from '@/lib/db'
import { writeArticle } from '@/lib/ai-writer'
import { publishStoryToFacebook } from '@/lib/facebook'
import { shouldImportStory } from '@/lib/news-filter'
import {
  classifyCategory,
  fetchFeed,
} from '@/lib/rss'
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
  facebookPublished: number
  facebookFailed: number
  facebookError: string | null
}

type ArticleMetadata = {
  description: string
  imageUrl?: string
}

type ExistingStoryRow = {
  id: string
  title: string | null
  source_url: string | null
  published_at?: string | null
}

type StoryRegion =
  | 'australia'
  | 'new-zealand'
  | 'pacific'
  | 'world'
  | null

const MAX_AI_ARTICLES_PER_RUN = 10
const MAX_AI_ARTICLES_PER_SOURCE_PER_RUN = 2
const MAX_ITEMS_PER_SOURCE = 20

type NewsSourceSeed = {
  name: string
  feed_url: string
  site_url: string
  default_category: CategorySlug
  source_type: 'official' | 'commercial'
  auto_publish: boolean
}

const GLOBAL_ENTERTAINMENT_SOURCES:
  NewsSourceSeed[] = [
    {
      name: '7NEWS Entertainment',
      feed_url:
        'https://7news.com.au/entertainment/rss',
      site_url:
        'https://7news.com.au/entertainment',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'BBC Entertainment & Arts',
      feed_url:
        'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
      site_url:
        'https://www.bbc.com/news/entertainment_and_arts',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'The Guardian Culture',
      feed_url:
        'https://www.theguardian.com/culture/rss',
      site_url:
        'https://www.theguardian.com/culture',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'NPR Culture',
      feed_url:
        'https://feeds.npr.org/1008/rss.xml',
      site_url:
        'https://www.npr.org/sections/culture/',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'Variety',
      feed_url:
        'https://variety.com/feed/',
      site_url:
        'https://variety.com/',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'Rolling Stone',
      feed_url:
        'https://www.rollingstone.com/feed/',
      site_url:
        'https://www.rollingstone.com/',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'People',
      feed_url:
        'https://people.com/feed/',
      site_url:
        'https://people.com/',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'E! News',
      feed_url:
        'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml',
      site_url:
        'https://www.eonline.com/news',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'TMZ',
      feed_url:
        'https://www.tmz.com/rss.xml',
      site_url:
        'https://www.tmz.com/',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
    {
      name: 'Entertainment Weekly',
      feed_url:
        'https://ew.com/feed/',
      site_url:
        'https://ew.com/',
      default_category: 'entertainment',
      source_type: 'commercial',
      auto_publish: true,
    },
  ]

const CORE_NEWS_SOURCES: NewsSourceSeed[] = [
  {
    name: 'ABC News Top Stories',
    feed_url:
      'https://www.abc.net.au/news/feed/45910/rss.xml',
    site_url: 'https://www.abc.net.au/news/',
    default_category: 'australia',
    source_type: 'commercial',
    auto_publish: true,
  },
  {
    name: 'ABC News Just In',
    feed_url:
      'https://www.abc.net.au/news/feed/51120/rss.xml',
    site_url: 'https://www.abc.net.au/news/justin/',
    default_category: 'australia',
    source_type: 'commercial',
    auto_publish: true,
  },
  {
    name: 'ABC News Business',
    feed_url:
      'https://www.abc.net.au/news/feed/51892/rss.xml',
    site_url: 'https://www.abc.net.au/news/business/',
    default_category: 'small-business',
    source_type: 'commercial',
    auto_publish: true,
  },
  {
    name: 'RNZ National',
    feed_url: 'https://www.rnz.co.nz/rss/national.xml',
    site_url: 'https://www.rnz.co.nz/news/national',
    default_category: 'new-zealand',
    source_type: 'commercial',
    auto_publish: true,
  },
  {
    name: 'RNZ Pacific',
    feed_url: 'https://www.rnz.co.nz/rss/pacific.xml',
    site_url: 'https://www.rnz.co.nz/international/pacific-news',
    default_category: 'new-zealand',
    source_type: 'commercial',
    auto_publish: true,
  },
  {
    name: 'RNZ World',
    feed_url: 'https://www.rnz.co.nz/rss/world.xml',
    site_url: 'https://www.rnz.co.nz/news/world',
    default_category: 'world',
    source_type: 'commercial',
    auto_publish: true,
  },
  {
    name: 'New Zealand Government — Beehive',
    feed_url: 'https://www.beehive.govt.nz/rss.xml',
    site_url: 'https://www.beehive.govt.nz/',
    default_category: 'new-zealand',
    source_type: 'official',
    auto_publish: true,
  },
]


/*
 * Reject normal RSS news older than 72 hours.
 */
const MAX_STORY_AGE_HOURS = 72

/*
 * Near-duplicate headline threshold.
 *
 * 0.82 is deliberately fairly strict so genuinely
 * different stories on the same subject are not removed.
 */
const DUPLICATE_TITLE_THRESHOLD = 0.82

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'been',
  'being',
  'but',
  'by',
  'for',
  'from',
  'has',
  'have',
  'he',
  'her',
  'his',
  'how',
  'in',
  'into',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'our',
  'she',
  'that',
  'the',
  'their',
  'this',
  'to',
  'was',
  'were',
  'what',
  'when',
  'where',
  'which',
  'who',
  'will',
  'with',
])

function isFreshStory(
  publishedAt: string | null | undefined,
): boolean {
  if (!publishedAt) {
    return false
  }

  const publishedTime =
    new Date(publishedAt).getTime()

  if (!Number.isFinite(publishedTime)) {
    return false
  }

  const now = Date.now()

  const ageMs =
    now - publishedTime

  const maxAgeMs =
    MAX_STORY_AGE_HOURS *
    60 *
    60 *
    1000

  /*
   * Allow a little clock skew where a publisher's
   * timestamp is slightly ahead of the server.
   */
  const futureToleranceMs =
    2 * 60 * 60 * 1000

  return (
    ageMs <= maxAgeMs &&
    ageMs >= -futureToleranceMs
  )
}

function cleanText(
  value: string | null | undefined,
): string {
  if (!value) {
    return ''
  }

  return value
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      ' ',
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      ' ',
    )
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(
      /&#39;|&apos;/gi,
      "'",
    )
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function removeFeedNoise(
  value: string,
): string {
  return value
    .replace(
      /Get our breaking news email[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Continue reading\.{0,3}/gi,
      ' ',
    )
    .replace(
      /Read more\.{0,3}/gi,
      ' ',
    )
    .replace(
      /Follow this section[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Follow this topic[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Follow this story[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /personalize your feed[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /personalise your feed[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Update your preferences[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Manage your preferences[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Sign in to personalize[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Sign in to personalise[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /Add this topic to your feed[^.]*\.?/gi,
      ' ',
    )
    .replace(
      /The information currently available was supplied through[\s\S]*$/i,
      ' ',
    )
    .replace(/\s+/g, ' ')
    .trim()
}

function containsFeedJunk(
  value: string,
): boolean {
  const text =
    cleanText(value).toLowerCase()

  const junkSignals = [
    'follow this section',
    'follow this topic',
    'personalize your feed',
    'personalise your feed',
    'update your preferences',
    'manage your preferences',
    'sign in to personalize',
    'sign in to personalise',
    'add this topic to your feed',
    'customize your feed',
    'customise your feed',
  ]

  return junkSignals.some(
    (signal) =>
      text.includes(signal),
  )
}

function firstFiveSentences(
  value: string,
): string {
  const text =
    removeFeedNoise(
      cleanText(value),
    )

  if (!text) {
    return ''
  }

  const sentences =
    text.match(
      /[^.!?]+[.!?]+(?:["'’”)]*)|[^.!?]+$/g,
    ) ?? [text]

  return sentences
    .map((sentence) =>
      sentence.trim(),
    )
    .filter(Boolean)
    .slice(0, 5)
    .join(' ')
    .slice(0, 1200)
    .trim()
}

function sourceFacts(
  value: string,
): string {
  const text =
    removeFeedNoise(
      cleanText(value),
    )

  if (!text) {
    return ''
  }

  const sentences =
    text.match(
      /[^.!?]+[.!?]+(?:["'’”)]*)|[^.!?]+$/g,
    ) ?? [text]

  return sentences
    .map((sentence) =>
      sentence.trim(),
    )
    .filter(Boolean)
    .slice(0, 12)
    .join(' ')
    .slice(0, 5000)
    .trim()
}

function cleanWrittenArticle(
  value: string,
): string {
  return value
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((paragraph) =>
      removeFeedNoise(
        cleanText(paragraph),
      ),
    )
    .filter(Boolean)
    .join('\n\n')
    .slice(0, 7000)
    .trim()
}

function normaliseTitle(
  value: string,
): string {
  return cleanText(value)
    .toLowerCase()
    .replace(
      /https?:\/\/\S+/g,
      ' ',
    )
    .replace(
      /[^\p{L}\p{N}\s]/gu,
      ' ',
    )
    .replace(/\s+/g, ' ')
    .trim()
}

function titleTokens(
  value: string,
): string[] {
  return normaliseTitle(value)
    .split(' ')
    .map((word) =>
      word.trim(),
    )
    .filter(
      (word) =>
        word.length > 2 &&
        !STOP_WORDS.has(word),
    )
}

function titleSimilarity(
  first: string,
  second: string,
): number {
  const left =
    normaliseTitle(first)

  const right =
    normaliseTitle(second)

  if (!left || !right) {
    return 0
  }

  if (left === right) {
    return 1
  }

  /*
   * A headline may have a short publisher suffix or
   * introductory phrase while still being the same story.
   */
  if (
    left.length >= 28 &&
    right.length >= 28 &&
    (
      left.includes(right) ||
      right.includes(left)
    )
  ) {
    return 0.98
  }

  const leftTokens =
    new Set(
      titleTokens(left),
    )

  const rightTokens =
    new Set(
      titleTokens(right),
    )

  if (
    leftTokens.size < 3 ||
    rightTokens.size < 3
  ) {
    return 0
  }

  let intersection = 0

  for (
    const token of leftTokens
  ) {
    if (
      rightTokens.has(token)
    ) {
      intersection += 1
    }
  }

  const union =
    new Set([
      ...leftTokens,
      ...rightTokens,
    ]).size

  if (!union) {
    return 0
  }

  const jaccard =
    intersection / union

  /*
   * Also compare how much of the shorter headline
   * is contained in the longer one.
   */
  const shorterSize =
    Math.min(
      leftTokens.size,
      rightTokens.size,
    )

  const containment =
    shorterSize > 0
      ? intersection /
        shorterSize
      : 0

  return Math.max(
    jaccard,
    containment * 0.92,
  )
}

function isNearDuplicateTitle(
  title: string,
  existingTitles: string[],
): boolean {
  if (!title.trim()) {
    return false
  }

  return existingTitles.some(
    (existingTitle) =>
      titleSimilarity(
        title,
        existingTitle,
      ) >=
      DUPLICATE_TITLE_THRESHOLD,
  )
}

function sourceRegion(
  source: SourceRow,
): StoryRegion {
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

  const newZealandSignals = [
    '.govt.nz',
    '.co.nz',
    '.org.nz',
    'rnz.co.nz',
    'beehive.govt.nz',
    'new zealand',
    'aotearoa',
  ]

  const pacificSignals = [
    'rnz pacific',
    '/rss/pacific',
    'pacific news',
    'pacific islands',
  ]

  if (
    pacificSignals.some(
      (signal) =>
        sourceText.includes(signal),
    )
  ) {
    return 'pacific'
  }

  if (
    australianSignals.some(
      (signal) =>
        sourceText.includes(
          signal,
        ),
    )
  ) {
    return 'australia'
  }

  if (
    newZealandSignals.some(
      (signal) =>
        sourceText.includes(
          signal,
        ),
    )
  ) {
    return 'new-zealand'
  }

  return null
}

function contentRegion(
  title: string,
  summary: string,
): StoryRegion {
  const text =
    `${title} ${summary}`
      .toLowerCase()
      .replace(/\s+/g, ' ')

  const australianSignals = [
    'australia',
    'australian',
    'canberra',
    'sydney',
    'melbourne',
    'brisbane',
    'perth',
    'adelaide',
    'hobart',
    'darwin',
    'western australia',
    'new south wales',
    'queensland',
    'south australia',
    'tasmania',
    'northern territory',
    'victoria government',
    'australian government',
    'federal government of australia',
  ]

  const newZealandSignals = [
    'new zealand',
    'new zealander',
    'new zealanders',
    'aotearoa',
    'auckland',
    'wellington',
    'christchurch',
    'hamilton nz',
    'tauranga',
    'dunedin',
    'queenstown nz',
    'nz government',
    'new zealand government',
    'beehive',
  ]

  const pacificSignals = [
    'pacific islands',
    'pacific island',
    'fiji',
    'fijian',
    'samoa',
    'samoan',
    'tonga',
    'tongan',
    'vanuatu',
    'solomon islands',
    'papua new guinea',
    'cook islands',
    'niue',
    'kiribati',
    'tuvalu',
    'new caledonia',
    'bougainville',
  ]

  const worldSignals = [
    'united states',
    'u.s.',
    'u.s ',
    'us government',
    'white house',
    'washington dc',
    'washington, d.c.',
    'donald trump',
    'joe biden',
    'federal appeals court',
    'supreme court of the united states',
    'united kingdom',
    'britain',
    'british government',
    'london',
    'european union',
    'european commission',
    'france',
    'germany',
    'italy',
    'spain',
    'china',
    'chinese government',
    'beijing',
    'japan',
    'tokyo',
    'india',
    'new delhi',
    'russia',
    'moscow',
    'ukraine',
    'kyiv',
    'israel',
    'gaza',
    'iran',
    'tehran',
    'south korea',
    'north korea',
    'africa',
    'united nations',
    'world health organization',
    'world trade organization',
  ]

  const australiaScore =
    australianSignals.filter(
      (signal) =>
        text.includes(signal),
    ).length

  const newZealandScore =
    newZealandSignals.filter(
      (signal) =>
        text.includes(signal),
    ).length

  const worldScore =
    worldSignals.filter(
      (signal) =>
        text.includes(signal),
    ).length

  const pacificScore =
    pacificSignals.filter(
      (signal) =>
        text.includes(signal),
    ).length

  if (
    australiaScore >
      newZealandScore &&
    australiaScore >
      worldScore &&
    australiaScore >
      pacificScore
  ) {
    return 'australia'
  }

  if (
    newZealandScore >
      australiaScore &&
    newZealandScore >
      worldScore &&
    newZealandScore >
      pacificScore
  ) {
    return 'new-zealand'
  }

  if (
    worldScore >
      australiaScore &&
    worldScore >
      newZealandScore &&
    worldScore >
      pacificScore
  ) {
    return 'world'
  }

  if (
    pacificScore >
      australiaScore &&
    pacificScore >
      newZealandScore &&
    pacificScore >
      worldScore
  ) {
    return 'pacific'
  }

  /*
   * If tied, prefer strong explicit country references.
   */
  if (
    pacificSignals.some(
      (signal) =>
        text.includes(signal),
    )
  ) {
    return 'pacific'
  }

  if (
    text.includes(
      'new zealand',
    ) ||
    text.includes(
      'aotearoa',
    )
  ) {
    return 'new-zealand'
  }

  if (
    text.includes(
      'australia',
    ) ||
    text.includes(
      'australian',
    )
  ) {
    return 'australia'
  }

  return null
}

function categoryForRegion(
  region: StoryRegion,
  existingCategory: CategorySlug,
): CategorySlug {
  if (
    region === 'australia'
  ) {
    return 'australia' as CategorySlug
  }

  if (
    region === 'world'
  ) {
    return 'world' as CategorySlug
  }

  if (
    region === 'new-zealand' ||
    region === 'pacific'
  ) {
    /*
     * The project has historically used nz-pacific as
     * the NZ section slug. Keep it for compatibility.
     */
    return 'nz-pacific' as CategorySlug
  }

  return existingCategory
}

function writerCountry(
  source: SourceRow,
  title: string,
  summary: string,
): 'Australia' | 'New Zealand' | 'Pacific' | 'World' {
  const region =
    contentRegion(title, summary) ||
    sourceRegion(source)

  if (region === 'australia') {
    return 'Australia'
  }

  if (region === 'new-zealand') {
    return 'New Zealand'
  }

  if (region === 'pacific') {
    return 'Pacific'
  }

  return 'World'
}

function protectRegionalCategory(
  category: CategorySlug,
  source: SourceRow,
  title: string,
  summary: string,
): CategorySlug {
  /*
   * Regional detection must only adjust regional sections.
   * Topic sections such as Business, Community, Social Issues,
   * Trade & Logistics, Sports and Entertainment must retain
   * their topic category even when the story is clearly from
   * Australia, New Zealand or overseas.
   */
  const regionalCategories =
    new Set<CategorySlug>([
      'australia',
      'new-zealand',
      'nz-pacific',
      'world',
    ])

  if (!regionalCategories.has(category)) {
    return category
  }

  /*
   * Article content is stronger evidence than the feed's
   * default category. This prevents an overseas story
   * arriving through an NZ feed from being labelled NZ.
   */
  const detectedFromContent =
    contentRegion(
      title,
      summary,
    )

  if (detectedFromContent) {
    return categoryForRegion(
      detectedFromContent,
      category,
    )
  }

  /*
   * If the article itself contains no strong geographic
   * signal, use the known region of the publisher/feed.
   */
  const detectedFromSource =
    sourceRegion(source)

  if (
    detectedFromSource ===
      'australia' &&
    category ===
      ('nz-pacific' as CategorySlug)
  ) {
    return 'australia' as CategorySlug
  }

  if (
    detectedFromSource ===
      'new-zealand' &&
    category ===
      ('australia' as CategorySlug)
  ) {
    return 'nz-pacific' as CategorySlug
  }

  return category
}

function metaContent(
  html: string,
  key: string,
): string {
  const escaped =
    key.replace(
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

  for (
    const pattern of patterns
  ) {
    const match =
      html.match(pattern)

    if (match?.[1]) {
      return cleanText(
        match[1],
      )
    }
  }

  return ''
}

async function fetchArticleMetadata(
  url: string,
): Promise<ArticleMetadata> {
  try {
    const response =
      await fetch(url, {
        headers: {
          'User-Agent':
            'DownunderVoicesBot/1.0 (+https://downundervoices.com)',
        },
        signal:
          AbortSignal.timeout(
            8000,
          ),
        cache: 'no-store',
        redirect: 'follow',
      })

    if (!response.ok) {
      return {
        description: '',
      }
    }

    const contentType =
      response.headers.get(
        'content-type',
      ) || ''

    if (
      !contentType.includes(
        'text/html',
      )
    ) {
      return {
        description: '',
      }
    }

    const html =
      (
        await response.text()
      ).slice(
        0,
        400_000,
      )

    const description =
      metaContent(
        html,
        'og:description',
      ) ||
      metaContent(
        html,
        'twitter:description',
      ) ||
      metaContent(
        html,
        'description',
      )

    const imageUrl =
      metaContent(
        html,
        'og:image:secure_url',
      ) ||
      metaContent(
        html,
        'og:image',
      ) ||
      metaContent(
        html,
        'twitter:image',
      ) ||
      undefined

    return {
      description:
        firstFiveSentences(
          description,
        ),
      imageUrl:
        imageUrl &&
        /^https?:\/\//i.test(
          imageUrl,
        )
          ? imageUrl
          : undefined,
    }
  } catch (error) {
    console.error(
      'Article metadata fetch failed:',
      error,
    )

    return {
      description: '',
    }
  }
}

async function getRecentPublishedTitles(): Promise<
  string[]
> {
  try {
    const cutoff =
      new Date(
        Date.now() -
          MAX_STORY_AGE_HOURS *
            60 *
            60 *
            1000,
      ).toISOString()

    const rows =
      await dbRequest<
        ExistingStoryRow[]
      >('stories', {
        query:
          `?select=id,title,source_url,published_at` +
          `&published_at=gte.${encodeURIComponent(
            cutoff,
          )}` +
          `&limit=500`,
      })

    return rows
      .map(
        (row) =>
          cleanText(
            row.title,
          ),
      )
      .filter(Boolean)
  } catch (error) {
    /*
     * Duplicate protection should never stop the
     * whole news import if this helper query fails.
     */
    console.error(
      'Could not load recent story titles:',
      error,
    )

    return []
  }
}

async function ensureNewsSources(
  sourceSeeds: NewsSourceSeed[],
  sourceGroup: string,
): Promise<void> {
  for (
    const source of sourceSeeds
  ) {
    try {
      const existing =
        await dbRequest<
          Array<{ id: string }>
        >('news_sources', {
          query:
            '?select=id' +
            `&feed_url=eq.${encodeURIComponent(
              source.feed_url,
            )}` +
            '&limit=1',
        })

      if (existing.length > 0) {
        await dbRequest(
          'news_sources',
          {
            method: 'PATCH',
            query:
              `?id=eq.${encodeURIComponent(
                existing[0].id,
              )}`,
            body: {
              name: source.name,
              site_url:
                source.site_url,
              default_category:
                source.default_category,
              source_type:
                source.source_type,
              auto_publish:
                source.auto_publish,
              active: true,
            },
          },
        )

        continue
      }

      /*
       * Do not save a dead or blocked feed. A source is
       * enrolled only after the importer can read at least
       * one real RSS item from it.
       */
      const items =
        await fetchFeed(
          source.feed_url,
        )

      if (items.length === 0) {
        throw new Error(
          'Feed returned no stories',
        )
      }

      await dbRequest(
        'news_sources',
        {
          method: 'POST',
          body: {
            name: source.name,
            feed_url:
              source.feed_url,
            site_url:
              source.site_url,
            default_category:
              source.default_category,
            source_type:
              source.source_type,
            auto_publish:
              source.auto_publish,
            active: true,
          },
        },
      )

      console.log(
        `${sourceGroup} source added: ${source.name}`,
      )
    } catch (error) {
      /*
       * One publisher blocking or changing its RSS feed
       * must not prevent the remaining global sources from
       * being enrolled or imported.
       */
      console.error(
        `${sourceGroup} source setup failed for ${source.name}:`,
        error,
      )
    }
  }
}

function rotateSourcesHourly(
  sources: SourceRow[],
): SourceRow[] {
  if (sources.length < 2) {
    return sources
  }

  const hourNumber =
    Math.floor(
      Date.now() /
        (60 * 60 * 1000),
    )

  const startIndex =
    hourNumber % sources.length

  return [
    ...sources.slice(startIndex),
    ...sources.slice(0, startIndex),
  ]
}

export async function runNewsImport(): Promise<
  ImportResult[]
> {
  if (
    !isDatabaseConfigured()
  ) {
    throw new Error(
      'Database is not configured',
    )
  }

  await ensureNewsSources(
    CORE_NEWS_SOURCES,
    'Core news',
  )

  await ensureNewsSources(
    GLOBAL_ENTERTAINMENT_SOURCES,
    'Entertainment',
  )

  const loadedSources =
    await dbRequest<
      SourceRow[]
    >('news_sources', {
      query:
        '?select=*&active=eq.true&order=name.asc',
    })

  const sources =
    rotateSourcesHourly(
      loadedSources,
    )

  const results:
    ImportResult[] = []

  let aiArticlesCreated = 0

  /*
   * Keep a list of recent headlines from the database,
   * then add newly imported headlines to the same list.
   * This catches duplicates both across runs and within
   * the current run.
   */
  const knownTitles =
    await getRecentPublishedTitles()

  for (
    const source of sources
  ) {
    const started =
      Date.now()

    let imported = 0
    let skipped = 0
    let facebookPublished = 0
    let facebookFailed = 0
    let facebookError: string | null = null
    let aiArticlesForSource = 0

    let errorMessage:
      | string
      | null = null

    try {
      const items = (
        await fetchFeed(
          source.feed_url,
        )
      ).slice(
        0,
        MAX_ITEMS_PER_SOURCE,
      )

      for (
        const item of items
      ) {
        /*
         * 1. Freshness gate.
         */
        if (
          !isFreshStory(
            item.publishedAt,
          )
        ) {
          skipped += 1

          console.log(
            `Freshness filter skipped: ${cleanText(
              item.title,
            )} (${
              item.publishedAt ||
              'no date'
            })`,
          )

          continue
        }

        const originalTitle =
          cleanText(
            item.title,
          )

        /*
         * Reject obvious feed-navigation junk before
         * doing article metadata or AI work.
         */
        if (
          !originalTitle ||
          containsFeedJunk(
            originalTitle,
          )
        ) {
          skipped += 1

          console.log(
            `Feed junk title skipped: ${originalTitle}`,
          )

          continue
        }

        /*
         * 2. Exact source URL duplicate check.
         */
        const existing =
          await dbRequest<
            Array<{
              id: string
            }>
          >('stories', {
            query:
              `?select=id&source_url=eq.${encodeURIComponent(
                item.link,
              )}&limit=1`,
          })

        if (
          existing.length > 0
        ) {
          skipped += 1
          continue
        }

        /*
         * 3. Near-duplicate headline check.
         *
         * This catches the same underlying story arriving
         * through slightly different feed URLs/headlines.
         */
        if (
          isNearDuplicateTitle(
            originalTitle,
            knownTitles,
          )
        ) {
          skipped += 1

          console.log(
            `Near-duplicate skipped: ${originalTitle}`,
          )

          continue
        }

        let originalSummary =
          sourceFacts(
            item.description,
          )

        let imageUrl =
          item.imageUrl

        if (
          originalSummary.length <
            90 ||
          (
            source.source_type ===
              'official' &&
            !imageUrl
          )
        ) {
          const metadata =
            await fetchArticleMetadata(
              item.link,
            )

          if (
            originalSummary.length <
              90 &&
            metadata.description
          ) {
            originalSummary =
              sourceFacts(
                metadata.description,
              )
          }

          if (
            !imageUrl &&
            metadata.imageUrl
          ) {
            imageUrl =
              metadata.imageUrl
          }
        }

        /*
         * Clean feed navigation/promotional text from
         * article metadata as well as the RSS description.
         */
        originalSummary =
          sourceFacts(
            removeFeedNoise(
              originalSummary,
            ),
          )

        if (
          containsFeedJunk(
            originalSummary,
          )
        ) {
          originalSummary =
            sourceFacts(
              removeFeedNoise(
                originalSummary,
              ),
            )
        }

        if (!originalSummary) {
          originalSummary =
            sourceFacts(
              originalTitle,
            )
        }

        /*
         * A summary containing nothing useful after noise
         * removal is not worth publishing.
         */
        if (
          originalSummary.length <
            20
        ) {
          skipped += 1

          console.log(
            `Low-quality summary skipped: ${originalTitle}`,
          )

          continue
        }

        /*
         * 4. Existing project quality filter.
         */
        const allowed =
          shouldImportStory(
            originalTitle,
            originalSummary,
            source.name,
            source.feed_url,
          )

        if (!allowed) {
          skipped += 1

          console.log(
            `Quality filter skipped: ${originalTitle}`,
          )

          continue
        }

        /*
         * Entertainment feeds must stay in Entertainment.
         * Geographic words in celebrity, film or television
         * stories must not move them into World/Australia/NZ.
         */
        const isEntertainmentSource =
          source.default_category ===
            ('entertainment' as CategorySlug)

        const classifiedInitialCategory =
          isEntertainmentSource
            ? ('entertainment' as CategorySlug)
            : classifyCategory(
                originalTitle,
                originalSummary,
                source.default_category,
              )

        /*
         * Entertainment can arrive through a general news
         * feed as well as a dedicated Entertainment feed.
         * Treat classifier-confirmed Entertainment stories
         * exactly like dedicated Entertainment-source items.
         */
        const isEntertainmentStory =
          isEntertainmentSource ||
          classifiedInitialCategory ===
            ('entertainment' as CategorySlug)

        const initialCategory =
          isEntertainmentStory
            ? ('entertainment' as CategorySlug)
            : protectRegionalCategory(
                classifiedInitialCategory,
                source,
                originalTitle,
                originalSummary,
              )

        const eligibleForEditorialRewrite =
          isEntertainmentStory ||
          source.auto_publish

        const canUseAi =
          eligibleForEditorialRewrite &&
          aiArticlesCreated <
            MAX_AI_ARTICLES_PER_RUN &&
          aiArticlesForSource <
            MAX_AI_ARTICLES_PER_SOURCE_PER_RUN

        /*
         * Do not save an eligible story as a draft merely
         * because this run has used its rewriting allowance.
         * Leaving it out lets a later hourly run rewrite and
         * publish it safely instead of permanently blocking
         * it through the source-URL duplicate check.
         */
        if (
          eligibleForEditorialRewrite &&
          !canUseAi
        ) {
          skipped += 1
          continue
        }

        let finalTitle =
          originalTitle

        let finalSummary =
          originalSummary

        let communityAngle = ''

        let finalCategory =
          initialCategory

        let status:
          | 'published'
          | 'draft' =
          'draft'

        let importMethod =
          'rss'

        if (canUseAi) {
          console.log(
            `Preparing article: ${originalTitle}`,
          )

          const writtenArticle =
            await writeArticle({
              title:
                originalTitle,
              summary:
                originalSummary,
              sourceName:
                source.name,
              sourceUrl:
                item.link,
              category:
                initialCategory,
              country:
                writerCountry(
                  source,
                  originalTitle,
                  originalSummary,
                ),
            })

          /*
           * A failed or unavailable writer returns the source
           * material with rewritten=false. Never publish that
           * fallback as an original Downunder Voices report.
           * The item remains eligible for the next hourly run.
           */
          if (
            !writtenArticle.rewritten
          ) {
            skipped += 1

            console.error(
              `Rewrite unavailable; source copy not published: ${originalTitle}`,
            )

            continue
          }

          finalTitle =
            cleanText(
              writtenArticle.title,
            ) ||
            originalTitle

          finalSummary =
            cleanWrittenArticle(
              writtenArticle.summary,
            ) ||
            originalSummary

          communityAngle =
            cleanText(
              writtenArticle.communityAngle,
            )

          /*
           * Do not allow AI rewriting to turn a clean
           * article into navigation/feed rubbish.
           */
          if (
            containsFeedJunk(
              finalTitle,
            ) ||
            containsFeedJunk(
              finalSummary,
            )
          ) {
            skipped += 1

            console.log(
              `Feed junk after processing skipped: ${finalTitle}`,
            )

            continue
          }

          /*
           * Run the quality filter again after rewriting.
           */
          const finalAllowed =
            shouldImportStory(
              finalTitle,
              finalSummary,
              source.name,
              source.feed_url,
            )

          if (
            !finalAllowed
          ) {
            skipped += 1

            console.log(
              `Final quality filter skipped: ${finalTitle}`,
            )

            continue
          }

          /*
           * AI may change the headline, so run duplicate
           * protection again using the finished title.
           */
          if (
            finalTitle !==
              originalTitle &&
            isNearDuplicateTitle(
              finalTitle,
              knownTitles,
            )
          ) {
            skipped += 1

            console.log(
              `Final near-duplicate skipped: ${finalTitle}`,
            )

            continue
          }

          const classifiedFinalCategory =
            isEntertainmentStory
              ? ('entertainment' as CategorySlug)
              : classifyCategory(
                  finalTitle,
                  finalSummary,
                  initialCategory,
                )

          finalCategory =
            protectRegionalCategory(
              classifiedFinalCategory,
              source,
              finalTitle,
              finalSummary,
            )

          status =
            'published'

          importMethod =
            'rss'

          aiArticlesCreated += 1
          aiArticlesForSource += 1

          console.log(
            `Article prepared: ${finalTitle}`,
          )
        }

        /*
         * Final safety check immediately before insert.
         */
        if (
          isNearDuplicateTitle(
            finalTitle,
            knownTitles,
          )
        ) {
          skipped += 1

          console.log(
            `Pre-insert duplicate skipped: ${finalTitle}`,
          )

          continue
        }

        const storySlug =
          uniqueSlug(
            finalTitle,
            item.link,
          )

        /*
         * Commercial publishers often retain copyright in
         * their feed photographs. Use our licensed thematic
         * fallback artwork for those reports; retain a source
         * image only for official public-information feeds.
         */
        const publishImageUrl =
          source.source_type ===
            'official'
            ? imageUrl
            : undefined

        await dbRequest(
          'stories',
          {
            method: 'POST',
            body: {
              slug:
                storySlug,

              title:
                finalTitle,

              category:
                finalCategory,

              summary:
                finalSummary,

              source_name:
                source.name,

              source_url:
                item.link,

              image_url:
                publishImageUrl || null,

              community_angle:
                communityAngle,

              author:
                status === 'published'
                  ? 'Downunder Voices Newsroom'
                  : null,

              status,

              published_at:
                status ===
                'published'
                  ? item.publishedAt
                  : null,

              import_method:
                importMethod,

              source_id:
                source.id,
            },
          },
        )

        if (
          status ===
          'published'
        ) {
          const facebookResult =
            await publishStoryToFacebook({
              title: finalTitle,
              slug: storySlug,
              summary: finalSummary,
              imageUrl:
                publishImageUrl,
            })

          if (facebookResult.ok) {
            facebookPublished += 1
          } else {
            facebookFailed += 1
            facebookError =
              facebookResult.error ||
              (facebookResult.skipped
                ? 'Facebook credentials are not configured.'
                : 'Unknown Facebook error.')

            console.error(
              `Story published but Facebook delivery failed: ${finalTitle} — ${facebookError}`,
            )
          }
        }

        /*
         * Add immediately so another feed in this same
         * cron run cannot import the same story again.
         */
        knownTitles.push(
          finalTitle,
        )

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
      await dbRequest(
        'import_logs',
        {
          method: 'POST',
          body: {
            source_id:
              source.id,

            source_name:
              source.name,

            imported_count:
              imported,

            skipped_count:
              skipped,

            error_message:
              errorMessage,

            duration_ms:
              Date.now() -
              started,
          },
        },
      )
    } catch (logError) {
      console.error(
        `Import log failed for ${source.name}:`,
        logError,
      )
    }

    results.push({
      source:
        source.name,
      imported,
      skipped,
      error:
        errorMessage,
      facebookPublished,
      facebookFailed,
      facebookError,
    })
  }

  console.log(
    `News import completed. Processed articles created: ${aiArticlesCreated}`,
  )

  return results
}
