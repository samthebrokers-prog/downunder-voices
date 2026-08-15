import type { CategorySlug } from '@/lib/news-data'

type StoryScoreInput = {
  title: string
  summary?: string
  category: CategorySlug
  sourceName?: string
  publishedAt?: string
}

const HIGH_INTEREST_TERMS = [
  'breaking',
  'exclusive',
  'emergency',
  'crisis',
  'major',
  'historic',
  'record',
  'warning',
  'alert',
  'election',
  'prime minister',
  'president',
  'government',
  'war',
  'attack',
  'earthquake',
  'tsunami',
  'cyclone',
  'flood',
  'fire',
  'wildfire',
  'plane crash',
  'aviation',
  'interest rate',
  'inflation',
  'cost of living',
  'housing',
  'immigration',
  'artificial intelligence',
  'openai',
  'china',
  'trump',
  'ukraine',
  'russia',
  'israel',
  'gaza',
  'iran',
]

const TRADE_TERMS = [
  'customs',
  'border force',
  'biosecurity',
  'freight',
  'shipping',
  'container',
  'cargo',
  'port',
  'supply chain',
  'import',
  'export',
  'tariff',
  'trade agreement',
  'air cargo',
  'sea freight',
]

const LOW_VALUE_TERMS = [
  'earnings call',
  'quarterly earnings',
  'stock price',
  'share price',
  'analyst rating',
  'price target',
  'dividend',
  'investor relations',
  'sponsored',
  'press release only',
]

const CATEGORY_BASE_SCORE: Record<CategorySlug, number> = {
  world: 70,
  australia: 75,
  'new-zealand': 75,
  'trade-logistics': 72,
  'social-issues': 70,
  'small-business': 65,
  community: 55,
  sports: 60,
  entertainment: 72,

  // Legacy compatibility
  politics: 65,
  business: 60,
  'nz-pacific': 65,
  'editorial-view': 50,
}

function containsAny(
  text: string,
  terms: string[],
): boolean {
  return terms.some((term) =>
    text.includes(term),
  )
}

function freshnessScore(
  publishedAt?: string,
): number {
  if (!publishedAt) return 0

  const published = new Date(publishedAt)

  if (Number.isNaN(published.valueOf())) {
    return 0
  }

  const ageMs =
    Date.now() - published.getTime()

  const ageHours =
    ageMs / (1000 * 60 * 60)

  if (ageHours <= 2) return 15
  if (ageHours <= 6) return 12
  if (ageHours <= 12) return 9
  if (ageHours <= 24) return 6
  if (ageHours <= 48) return 3

  return 0
}

export function scoreStory({
  title,
  summary = '',
  category,
  sourceName = '',
  publishedAt,
}: StoryScoreInput): number {
  const text =
    `${title} ${summary} ${sourceName}`.toLowerCase()

  let score =
    CATEGORY_BASE_SCORE[category] ?? 50

  if (
    containsAny(
      text,
      HIGH_INTEREST_TERMS,
    )
  ) {
    score += 15
  }

  if (
    category === 'trade-logistics' &&
    containsAny(text, TRADE_TERMS)
  ) {
    score += 10
  }

  if (
    containsAny(
      text,
      LOW_VALUE_TERMS,
    )
  ) {
    score -= 35
  }

  score += freshnessScore(publishedAt)

  if (title.length >= 35) {
    score += 3
  }

  if (summary.length >= 120) {
    score += 3
  }

  return Math.max(
    0,
    Math.min(100, score),
  )
}

export function sortStoriesByScore<
  T extends StoryScoreInput,
>(
  stories: T[],
): T[] {
  return [...stories].sort(
    (a, b) =>
      scoreStory(b) - scoreStory(a),
  )
}
