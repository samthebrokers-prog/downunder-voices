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

export const stories: Story[] = [
  {
    id: 'nz-housing-first-home',
    title:
      'Housing Pressure Continues to Challenge First-Home Buyers',
    category: 'new-zealand',
    date: '2026-07-02',
    summary:
      'Housing affordability remains a major concern for younger households and first-home buyers across New Zealand.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/nz-housing.png',
    communityAngle:
      'Housing policy matters because secure and affordable homes are fundamental to strong communities.',
  },

  {
    id: 'pacific-community-voices',
    title:
      'Pacific Communities Continue to Strengthen New Zealand',
    category: 'community',
    date: '2026-07-01',
    summary:
      'Community organisations continue to celebrate language, culture and the contribution of Pacific communities.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/pacific-language.png',
    communityAngle:
      'Strong communities are built when people feel their identity, language and contribution are recognised.',
  },

  {
    id: 'au-small-business-pressure',
    title:
      'Small Businesses Face Growing Cost Pressures',
    category: 'small-business',
    date: '2026-07-02',
    summary:
      'Australian small businesses continue to manage higher operating costs, rents and household spending pressures.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/au-smallbiz.png',
    communityAngle:
      'Small and family-owned businesses provide jobs and help keep local communities economically strong.',
  },

  {
    id: 'au-community-recovery',
    title:
      'Communities Show Their Strength During Difficult Times',
    category: 'australia',
    date: '2026-06-30',
    summary:
      'Volunteers and local organisations continue to play an important role when communities face emergencies and hardship.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/au-floods.png',
    communityAngle:
      'Community resilience often depends on ordinary people helping one another when it matters most.',
  },

  {
    id: 'government-decisions-explained',
    title:
      'Government Decisions Must Be Explained in Plain English',
    category: 'social-issues',
    date: '2026-07-01',
    summary:
      'Public policy decisions can have direct consequences for households, businesses and communities.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/politics-leaders.png',
    communityAngle:
      'People should be able to understand how government decisions affect their everyday lives.',
  },

  {
    id: 'cost-of-living-public-scrutiny',
    title:
      'Cost-of-Living Policies Remain Under Public Scrutiny',
    category: 'social-issues',
    date: '2026-06-29',
    summary:
      'Housing, food, energy and household expenses remain central issues for governments and communities.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/sams-view-costofliving.png',
    communityAngle:
      'Behind economic statistics are households making difficult decisions about everyday expenses.',
  },

  {
    id: 'business-community-enterprise',
    title:
      'Small Businesses Continue to Drive Local Communities',
    category: 'small-business',
    date: '2026-07-02',
    summary:
      'Independent businesses, entrepreneurs and family enterprises remain important sources of employment and innovation.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/business-cafe.png',
    communityAngle:
      'Supporting small businesses helps retain jobs, skills and investment within local communities.',
  },

  {
    id: 'business-interest-rates',
    title:
      'Interest Rates Continue to Shape Household and Business Decisions',
    category: 'small-business',
    date: '2026-06-28',
    summary:
      'Borrowing costs influence mortgages, rents, investment and the ability of small businesses to grow.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/business-rates.png',
    communityAngle:
      'Economic policy becomes real when it reaches the family mortgage or a small business loan.',
  },

  {
    id: 'trade-shipping-community',
    title:
      'Why Shipping and Trade Matter to Everyday Households',
    category: 'trade-logistics',
    date: '2026-07-01',
    summary:
      'Freight costs, port delays and global supply chains can influence the prices businesses and households ultimately pay.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/pacific-shipping-monopoly.png',
    communityAngle:
      'Trade and logistics may happen behind the scenes, but their effects can reach supermarket shelves and small businesses.',
  },

  {
    id: 'world-global-events',
    title:
      'Global Events Continue to Have Local Consequences',
    category: 'world',
    date: '2026-07-01',
    summary:
      'Economic, political and humanitarian developments overseas can have direct consequences for Australia and New Zealand.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/default.svg',
    communityAngle:
      'World news matters when international events influence jobs, prices, security and communities at home.',
  },

  {
    id: 'community-food-support',
    title:
      'Community Organisations Respond to Rising Demand for Support',
    category: 'community',
    date: '2026-07-01',
    summary:
      'Food banks, charities and volunteers continue to assist households experiencing financial pressure.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/community-foodbank.png',
    communityAngle:
      'Community organisations often provide essential support to people facing difficult circumstances.',
  },

  {
    id: 'community-local-connections',
    title:
      'Local Community Hubs Help People Build Connections',
    category: 'community',
    date: '2026-06-27',
    summary:
      'Community centres and local organisations provide services, information and opportunities for people to connect.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/community-hub.png',
    communityAngle:
      'Strong local connections can reduce isolation and help people participate more fully in community life.',
  },

  {
    id: 'sports-community-rugby',
    title:
      'Grassroots Sport Continues to Bring Communities Together',
    category: 'sports',
    date: '2026-07-02',
    summary:
      'Local sporting clubs remain important places for young people, families and volunteers.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/sports-rugby.png',
    communityAngle:
      'Community sport provides friendship, mentoring and a sense of belonging beyond the scoreboard.',
  },

  {
    id: 'sports-community-netball',
    title:
      'Community Sport Depends on Players, Families and Volunteers',
    category: 'sports',
    date: '2026-06-29',
    summary:
      'Local competitions continue because of the commitment of athletes, coaches, families and volunteers.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/sports-netball.png',
    communityAngle:
      'Grassroots sport deserves recognition because it strengthens communities and creates opportunities for young people.',
  },

  {
    id: 'editorial-community-voices',
    title:
      'Why Community Voices Matter More Than Ever',
    category: 'editorial-view',
    date: '2026-07-02',
    summary:
      'Independent community journalism has an important role in ensuring ordinary people are part of public discussion.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/sams-view-voices.png',
    communityAngle:
      'Downunder Voices exists to provide space for stories and perspectives that deserve to be heard.',
    author: 'Downunder Voices Editorial Team',
  },

  {
    id: 'editorial-cost-of-living',
    title:
      "The Real Cost of Living Isn't Just About Money",
    category: 'editorial-view',
    date: '2026-06-28',
    summary:
      'The cost of living affects more than household finances. It can also affect family time, wellbeing and participation in community life.',
    sourceName: 'Downunder Voices',
    sourceUrl: 'https://downundervoices.com/',
    image: '/sams-view-costofliving.png',
    communityAngle:
      'Public discussion should recognise the human consequences behind economic statistics.',
    author: 'Downunder Voices Editorial Team',
  },
]

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
