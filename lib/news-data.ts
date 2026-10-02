// Downunder Voices fallback content.
// Used when database content is unavailable.

export type CategorySlug =
  // Current categories
  | 'australia'
  | 'new-zealand'
  | 'world'
  | 'social-issues'
  | 'small-business'
  | 'trade-logistics'
  | 'community'
  | 'sports'
  | 'entertainment'
  | 'editorial-view'

  // Legacy categories kept temporarily for compatibility
  | 'nz-pacific'
  | 'politics'
  | 'business'

export interface Category {
  slug: CategorySlug
  name: string
  description: string
}

export interface Story {
  id: string
  slug?: string
  title: string
  category: CategorySlug
  date: string
  summary: string
  sourceName: string
  sourceUrl: string
  image: string
  communityAngle: string
  author?: string
  status?: 'draft' | 'published' | 'archived'
  publishedAt?: string
  importedAt?: string
}

// -----------------------------------------------------------------------------
// Main public categories
// -----------------------------------------------------------------------------

export const categories: Category[] = [
  {
    slug: 'australia',
    name: 'Australia',
    description:
      'National news, government decisions and stories affecting communities across Australia.',
  },
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    description:
      'News, public policy and community stories from across Aotearoa New Zealand.',
  },
  {
    slug: 'world',
    name: 'World',
    description:
      'Important international developments and what they mean for our readers.',
  },
  {
    slug: 'social-issues',
    name: 'Social Issues',
    description:
      'Housing, cost of living, health, education and the issues affecting everyday people.',
  },
  {
    slug: 'small-business',
    name: 'Business',
    description:
      'Business, entrepreneurship, the economy, innovation, employment and the issues affecting companies and business owners across Australia and New Zealand.',
  },
  {
    slug: 'trade-logistics',
    name: 'Trade & Logistics',
    description:
      'Customs, biosecurity, freight forwarding, shipping, ports, supply chains and international trade.',
  },
  {
    slug: 'community',
    name: 'Community',
    description:
      'The people, volunteers and local organisations strengthening our communities.',
  },
  {
    slug: 'sports',
    name: 'Sports',
    description:
      'Professional, grassroots and community sport across Australia and New Zealand.',
  },
  {
    slug: 'entertainment',
    name: 'Entertainment',
    description:
      'Entertainment, celebrities, film, television, music, culture and the stories people are talking about.',
  },
  {
    slug: 'editorial-view',
    name: 'Opinion',
    description:
      'Independent commentary and perspectives on the issues shaping our communities.',
  },
]

// -----------------------------------------------------------------------------
// Legacy category mapping
//
// Existing database stories and RSS sources may still contain the old category
// names. This lets the site recognise them while we migrate the importer.
// -----------------------------------------------------------------------------

export function normaliseCategorySlug(
  slug: CategorySlug | string,
): CategorySlug {
  switch (slug) {
    case 'nz-pacific':
      return 'new-zealand'

    case 'business':
      return 'small-business'

    case 'politics':
      return 'social-issues'

    default:
      return slug as CategorySlug
  }
}

// -----------------------------------------------------------------------------
// Fallback stories
// -----------------------------------------------------------------------------
//
// IMPORTANT: Do not put dated fallback stories on the live homepage.
// When the database/RSS feed is unavailable, an empty fallback prevents stale
// June/July stories from being presented as current news.

export const stories: Story[] = []

// -----------------------------------------------------------------------------
// Helpers used across the site
// -----------------------------------------------------------------------------

export function getCategory(
  slug: string,
): Category | undefined {
  const normalised = normaliseCategorySlug(slug)

  return categories.find(
    (category) => category.slug === normalised,
  )
}

export function getStoriesByCategory(
  slug: CategorySlug,
): Story[] {
  const normalised = normaliseCategorySlug(slug)

  return stories
    .filter(
      (story) =>
        normaliseCategorySlug(story.category) ===
        normalised,
    )
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getAllStoriesSorted(): Story[] {
  return [...stories].sort((a, b) =>
    b.date.localeCompare(a.date),
  )
}

export function getMixedLatest(
  limit?: number,
): Story[] {
  const sorted = getAllStoriesSorted()

  const seenFirstPass = new Set<CategorySlug>()
  const primary: Story[] = []
  const rest: Story[] = []

  for (const story of sorted) {
    const normalisedCategory =
      normaliseCategorySlug(story.category)

    if (!seenFirstPass.has(normalisedCategory)) {
      seenFirstPass.add(normalisedCategory)
      primary.push(story)
    } else {
      rest.push(story)
    }
  }

  const mixed = [...primary, ...rest]

  return typeof limit === 'number'
    ? mixed.slice(0, limit)
    : mixed
}

export function getCategoryName(
  slug: CategorySlug,
): string {
  return getCategory(slug)?.name ?? slug
}

export function formatDate(
  iso: string,
): string {
  const date = new Date(`${iso}T00:00:00`)

  return date.toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
