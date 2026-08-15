import type { CategorySlug } from '@/lib/news-data'

type StoryScoreInput = {
  title: string
  summary?: string
  category: CategorySlug
  sourceName?: string
  publishedAt?: string
}

const VERY_HIGH_INTEREST_TERMS = [
  'protest',
  'protests',
  'demonstration',
  'demonstrations',
  'public anger',
  'outrage',
  'backlash',
  'controversy',
  'scandal',
  'corruption',
  'corrupt',
  'misconduct',
  'abuse of power',
  'conflict of interest',
  'resign',
  'resignation',
  'racism',
  'racist',
  'racial discrimination',
  'discrimination',
  'hate speech',
  'migrant exploitation',
  'worker exploitation',
  'labour exploitation',
  'labor exploitation',
  'underpaid',
  'underpayment',
  'wage theft',
  'unpaid wages',
  'minimum wage',
  'migrant workers',
  'temporary workers',
  'visa workers',
  'foreign workers',
  'human trafficking',
  'modern slavery',
  'cost of living',
  'housing crisis',
  'rent crisis',
  'homelessness',
  'mortgage stress',
  'poverty',
  'food bank',
  'food insecurity',
  'inequality',
  'court',
  'trial',
  'charged',
  'arrested',
  'investigation',
  'fraud',
  'scam',
  'murder',
  'assault',
  'sexual assault',
  'celebrity',
  'hollywood',
  'viral',
]

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
  'minister',
  'parliament',
  'opposition',
  'policy',
  'immigration',
  'refugee',
  'deportation',
  'visa',
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
  'housing',
  'mortgage',
  'rent',
  'petrol',
  'supermarket',
  'jobs',
  'unemployment',
  'tax',
  'artificial intelligence',
  'openai',
  'social media',
  'technology',
  'china',
  'trump',
  'ukraine',
  'russia',
  'israel',
  'gaza',
  'iran',
  'actor',
  'actress',
  'singer',
  'movie',
  'film',
  'music',
  'rugby',
  'cricket',
  'football',
  'tennis',
  'olympics',
]

const COMMUNITY_IMPACT_TERMS = [
  'family',
  'families',
  'children',
  'students',
  'workers',
  'employees',
  'community',
  'communities',
  'migrants',
  'immigrants',
  'asian',
  'pacific',
  'maori',
  'aboriginal',
  'indigenous',
  'young people',
  'elderly',
  'disabled',
  'small business',
  'small businesses',
  'households',
  'tenants',
  'homeowners',
]

const POLITICAL_ACCOUNTABILITY_TERMS = [
  'government decision',
  'government policy',
  'minister',
  'prime minister',
  'parliament',
  'senate',
  'mp',
  'politician',
  'public money',
  'taxpayer',
  'inquiry',
  'royal commission',
  'ombudsman',
  'watchdog',
  'audit',
  'investigation',
  'conflict of interest',
  'misconduct',
  'corruption',
  'scandal',
  'resignation',
]

const HUMAN_INTEREST_TERMS = [
  'survivor',
  'family',
  'community',
  'hero',
  'volunteer',
  'rescue',
  'missing',
  'found',
  'reunited',
  'heartbreaking',
  'emotional',
  'inspiring',
  'extraordinary',
  'remarkable',
  'viral',
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
  'corporate announcement',
  'market update',
  'investor presentation',
  'annual general meeting',
  'agm',
  'results presentation',
  'broker recommendation',
]

const VERY_LOW_VALUE_TERMS = [
  'promotional offer',
  'product launch',
  'brand partnership',
  'advertorial',
  'sponsored content',
  'marketing campaign',
]

const CATEGORY_BASE_SCORE: Record<CategorySlug, number> = {
  world: 70,
  australia: 78,
  'new-zealand': 78,
  'trade-logistics': 68,
  'social-issues': 80,
  'small-business': 66,
  community: 65,
  sports: 63,
  entertainment: 74,

  // Legacy compatibility
  politics: 76,
  business: 60,
  'nz-pacific': 72,
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

function countMatches(
  text: string,
  terms: string[],
): number {
  return terms.reduce(
    (count, term) =>
      text.includes(term)
        ? count + 1
        : count,
    0,
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

  if (ageHours <= 2) return 18
  if (ageHours <= 6) return 15
  if (ageHours <= 12) return 12
  if (ageHours <= 24) return 9
  if (ageHours <= 48) return 5
  if (ageHours <= 72) return 2

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

  const veryHighMatches =
    countMatches(
      text,
      VERY_HIGH_INTEREST_TERMS,
    )

  const highMatches =
    countMatches(
      text,
      HIGH_INTEREST_TERMS,
    )

  const communityMatches =
    countMatches(
      text,
      COMMUNITY_IMPACT_TERMS,
    )

  const accountabilityMatches =
    countMatches(
      text,
      POLITICAL_ACCOUNTABILITY_TERMS,
    )

  const humanInterestMatches =
    countMatches(
      text,
      HUMAN_INTEREST_TERMS,
    )

  if (veryHighMatches > 0) {
    score += Math.min(
      28,
      veryHighMatches * 8,
    )
  }

  if (highMatches > 0) {
    score += Math.min(
      18,
      highMatches * 4,
    )
  }

  if (communityMatches >= 2) {
    score += 8
  } else if (communityMatches === 1) {
    score += 4
  }

  if (accountabilityMatches >= 2) {
    score += 12
  } else if (
    accountabilityMatches === 1
  ) {
    score += 6
  }

  if (humanInterestMatches >= 2) {
    score += 8
  } else if (
    humanInterestMatches === 1
  ) {
    score += 4
  }

  if (
    category === 'social-issues' &&
    veryHighMatches > 0
  ) {
    score += 8
  }

  if (
    (category === 'australia' ||
      category === 'new-zealand') &&
    (
      accountabilityMatches > 0 ||
      communityMatches > 0 ||
      veryHighMatches > 0
    )
  ) {
    score += 6
  }

  if (
    category === 'trade-logistics' &&
    containsAny(text, TRADE_TERMS)
  ) {
    score += 8
  }

  if (
    containsAny(
      text,
      LOW_VALUE_TERMS,
    )
  ) {
    score -= 35
  }

  if (
    containsAny(
      text,
      VERY_LOW_VALUE_TERMS,
    )
  ) {
    score -= 50
  }

  score += freshnessScore(publishedAt)

  if (title.length >= 35) {
    score += 3
  }

  if (summary.length >= 120) {
    score += 3
  }

  if (
    veryHighMatches >= 2 &&
    communityMatches >= 1
  ) {
    score += 6
  }

  if (
    accountabilityMatches >= 1 &&
    communityMatches >= 1
  ) {
    score += 6
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
