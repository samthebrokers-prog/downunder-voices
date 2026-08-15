import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import {
  stories as seedStories,
  normaliseCategorySlug,
  type Story,
  type CategorySlug,
} from '@/lib/news-data'

type StoryRow = {
  id: string
  slug: string
  title: string
  category: CategorySlug
  published_at: string | null
  summary: string
  source_name: string
  source_url: string
  image_url: string | null
  community_angle: string | null
  author: string | null
  import_method: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
}

type CategoryDesign = {
  label: string
  startColour: string
  endColour: string
  accentColour: string
  symbol: string
}

const categoryDesigns: Record<
  CategorySlug,
  CategoryDesign
> = {
  politics: {
    label: 'POLITICS',
    startColour: '#111827',
    endColour: '#374151',
    accentColour: '#dc2626',
    symbol: '◆',
  },

  'nz-pacific': {
    label: 'NEW ZEALAND',
    startColour: '#075985',
    endColour: '#0f766e',
    accentColour: '#f59e0b',
    symbol: 'NZ',
  },

  australia: {
    label: 'AUSTRALIA',
    startColour: '#7c2d12',
    endColour: '#b45309',
    accentColour: '#facc15',
    symbol: 'AU',
  },

  business: {
    label: 'BUSINESS',
    startColour: '#1e3a8a',
    endColour: '#0369a1',
    accentColour: '#22c55e',
    symbol: 'B',
  },

  community: {
    label: 'COMMUNITY',
    startColour: '#581c87',
    endColour: '#9333ea',
    accentColour: '#f9a8d4',
    symbol: '●',
  },

  sports: {
    label: 'SPORT',
    startColour: '#14532d',
    endColour: '#15803d',
    accentColour: '#facc15',
    symbol: '◆',
  },

  entertainment: {
    label: 'ENTERTAINMENT',
    startColour: '#7c2d12',
    endColour: '#be123c',
    accentColour: '#fbbf24',
    symbol: '★',
  },

  'editorial-view': {
    label: 'OPINION',
    startColour: '#292524',
    endColour: '#57534e',
    accentColour: '#f97316',
    symbol: '✦',
  },

  'new-zealand': {
    label: 'NEW ZEALAND',
    startColour: '#075985',
    endColour: '#0f766e',
    accentColour: '#f59e0b',
    symbol: 'NZ',
  },

  world: {
    label: 'WORLD',
    startColour: '#312e81',
    endColour: '#4338ca',
    accentColour: '#a78bfa',
    symbol: 'W',
  },

  'social-issues': {
    label: 'SOCIAL ISSUES',
    startColour: '#7f1d1d',
    endColour: '#991b1b',
    accentColour: '#fca5a5',
    symbol: 'SI',
  },

  'small-business': {
    label: 'SMALL BUSINESS',
    startColour: '#1e3a8a',
    endColour: '#0369a1',
    accentColour: '#22c55e',
    symbol: 'SB',
  },

  'trade-logistics': {
    label: 'TRADE & LOGISTICS',
    startColour: '#164e63',
    endColour: '#0e7490',
    accentColour: '#67e8f9',
    symbol: 'TL',
  },
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function shortenTitle(
  title: string,
  maximumLength = 72,
): string {
  const cleaned = title
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= maximumLength) {
    return cleaned
  }

  return `${cleaned
    .slice(0, maximumLength - 1)
    .trim()}…`
}

function splitTitle(
  title: string,
): [string, string] {
  const shortened = shortenTitle(title)
  const words = shortened.split(' ')

  if (words.length <= 6) {
    return [shortened, '']
  }

  const midpoint = Math.ceil(
    words.length / 2,
  )

  return [
    words.slice(0, midpoint).join(' '),
    words.slice(midpoint).join(' '),
  ]
}

function createFallbackImage(
  category: CategorySlug,
  title: string,
): string {
  const normalisedCategory =
    normaliseCategorySlug(category)

  const design =
    categoryDesigns[normalisedCategory] ??
    categoryDesigns['new-zealand']

  const [titleLineOne, titleLineTwo] =
    splitTitle(title)

  const svg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="1200"
  height="675"
  viewBox="0 0 1200 675"
>
  <defs>
    <linearGradient
      id="background"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0%"
        stop-color="${design.startColour}"
      />
      <stop
        offset="100%"
        stop-color="${design.endColour}"
      />
    </linearGradient>

    <pattern
      id="newsPattern"
      width="56"
      height="56"
      patternUnits="userSpaceOnUse"
    >
      <circle
        cx="8"
        cy="8"
        r="2"
        fill="#ffffff"
        opacity="0.10"
      />
      <circle
        cx="36"
        cy="36"
        r="1.5"
        fill="#ffffff"
        opacity="0.08"
      />
    </pattern>
  </defs>

  <rect
    width="1200"
    height="675"
    fill="url(#background)"
  />

  <rect
    width="1200"
    height="675"
    fill="url(#newsPattern)"
  />

  <circle
    cx="1050"
    cy="80"
    r="210"
    fill="${design.accentColour}"
    opacity="0.12"
  />

  <circle
    cx="80"
    cy="650"
    r="220"
    fill="#000000"
    opacity="0.18"
  />

  <rect
    x="60"
    y="58"
    width="360"
    height="54"
    rx="4"
    fill="${design.accentColour}"
  />

  <text
    x="82"
    y="94"
    fill="#ffffff"
    font-family="Arial, Helvetica, sans-serif"
    font-size="25"
    font-weight="700"
    letter-spacing="1"
  >
    ${escapeXml(design.label)}
  </text>

  <text
    x="1060"
    y="150"
    text-anchor="middle"
    fill="#ffffff"
    opacity="0.14"
    font-family="Georgia, serif"
    font-size="130"
  >
    ${escapeXml(design.symbol)}
  </text>

  <text
    x="60"
    y="255"
    fill="#ffffff"
    font-family="Georgia, Times New Roman, serif"
    font-size="56"
    font-weight="700"
  >
    ${escapeXml(titleLineOne)}
  </text>

  ${
    titleLineTwo
      ? `
        <text
          x="60"
          y="325"
          fill="#ffffff"
          font-family="Georgia, Times New Roman, serif"
          font-size="56"
          font-weight="700"
        >
          ${escapeXml(titleLineTwo)}
        </text>
      `
      : ''
  }

  <rect
    x="60"
    y="410"
    width="260"
    height="6"
    fill="${design.accentColour}"
  />

  <text
    x="60"
    y="480"
    fill="#ffffff"
    opacity="0.92"
    font-family="Arial, Helvetica, sans-serif"
    font-size="30"
    font-weight="700"
    letter-spacing="1"
  >
    DOWNUNDER VOICES
  </text>

  <text
    x="60"
    y="525"
    fill="#ffffff"
    opacity="0.72"
    font-family="Arial, Helvetica, sans-serif"
    font-size="22"
  >
    News, views and community perspectives
  </text>

  <text
    x="1140"
    y="620"
    text-anchor="end"
    fill="#ffffff"
    opacity="0.65"
    font-family="Arial, Helvetica, sans-serif"
    font-size="19"
  >
    Topic illustration
  </text>
</svg>
`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    svg,
  )}`
}

function rowToStory(row: StoryRow): Story {
  const category =
    normaliseCategorySlug(row.category)

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category,
    date: (
      row.published_at ??
      row.created_at
    ).slice(0, 10),
    summary: row.summary,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    image:
      row.image_url?.trim() ||
      createFallbackImage(
        category,
        row.title,
      ),
    communityAngle:
      row.community_angle || '',
    author: row.author || undefined,
    status: row.status,
    publishedAt:
      row.published_at || undefined,
  }
}

function seedSorted(): Story[] {
  return [...seedStories]
    .map((story) => ({
      ...story,
      category:
        normaliseCategorySlug(
          story.category,
        ),
      slug: story.slug ?? story.id,
      status: 'published' as const,
    }))
    .sort((a, b) =>
      b.date.localeCompare(a.date),
    )
}

export async function getPublishedStories(
  limit = 60,
): Promise<Story[]> {
  if (!isDatabaseConfigured()) {
    return seedSorted().slice(0, limit)
  }

  try {
    const rows =
      await dbRequest<StoryRow[]>(
        'stories',
        {
          query:
            '?select=*' +
            '&status=eq.published' +
            '&order=published_at.desc.nullslast,created_at.desc' +
            `&limit=${limit}`,
        },
      )

    return rows.map(rowToStory)
  } catch (error) {
    console.error(
      'Falling back to seed stories:',
      error,
    )

    return seedSorted().slice(
      0,
      limit,
    )
  }
}

export async function getStoriesByCategory(
  category: CategorySlug,
  limit = 30,
): Promise<Story[]> {
  const normalisedCategory =
    normaliseCategorySlug(category)

  if (!isDatabaseConfigured()) {
    return seedSorted()
      .filter(
        (story) =>
          normaliseCategorySlug(
            story.category,
          ) === normalisedCategory,
      )
      .slice(0, limit)
  }

  const categoryMap: Record<
    string,
    string[]
  > = {
    'new-zealand': [
      'new-zealand',
      'nz-pacific',
    ],

    'small-business': [
      'small-business',
      'business',
    ],

    'social-issues': [
      'social-issues',
      'politics',
    ],

    australia: ['australia'],

    world: ['world'],

    'trade-logistics': [
      'trade-logistics',
    ],

    community: ['community'],

    sports: ['sports'],

    entertainment: ['entertainment'],

    'editorial-view': [
      'editorial-view',
    ],
  }

  const acceptedCategories =
    categoryMap[normalisedCategory] ?? [
      normalisedCategory,
    ]

  try {
    /*
     * Opinion is a special section.
     *
     * Older Opinion stories are stored with
     * category = editorial-view.
     *
     * New automated Opinion stories retain
     * their geographic/topic category in the
     * database, while import_method identifies
     * them as automated editorials.
     *
     * This lets the same article remain an
     * Australian, New Zealand or World story
     * while also appearing automatically on
     * the Opinion page.
     */
    if (
      normalisedCategory ===
      'editorial-view'
    ) {
      const rows =
        await dbRequest<StoryRow[]>(
          'stories',
          {
            query:
              '?select=*' +
              '&status=eq.published' +
              '&or=(category.eq.editorial-view,import_method.eq.automated-editorial)' +
              '&order=published_at.desc.nullslast,created_at.desc' +
              `&limit=${limit}`,
          },
        )

      return rows.map((row) => ({
        ...rowToStory(row),
        category:
          'editorial-view' as CategorySlug,
      }))
    }

    const encodedCategories =
      acceptedCategories
        .map((value) => `"${value}"`)
        .join(',')

    const rows =
      await dbRequest<StoryRow[]>(
        'stories',
        {
          query:
            '?select=*' +
            '&status=eq.published' +
            `&category=in.(${encodedCategories})` +
            '&order=published_at.desc.nullslast,created_at.desc' +
            `&limit=${limit}`,
        },
      )

    return rows.map(rowToStory)
  } catch (error) {
    console.error(
      `Category lookup failed for ${normalisedCategory}:`,
      error,
    )

    return seedSorted()
      .filter(
        (story) =>
          normaliseCategorySlug(
            story.category,
          ) === normalisedCategory,
      )
      .slice(0, limit)
  }
}

export async function getStoryBySlug(
  slug: string,
): Promise<Story | undefined> {
  if (!isDatabaseConfigured()) {
    return seedSorted().find(
      (story) =>
        (story.slug ?? story.id) ===
        slug,
    )
  }

  try {
    const rows =
      await dbRequest<StoryRow[]>(
        'stories',
        {
          query:
            '?select=*' +
            `&slug=eq.${encodeURIComponent(
              slug,
            )}` +
            '&status=eq.published' +
            '&limit=1',
        },
      )

    return rows[0]
      ? rowToStory(rows[0])
      : undefined
  } catch (error) {
    console.error(
      'Story lookup failed:',
      error,
    )

    return seedSorted().find(
      (story) =>
        (story.slug ?? story.id) ===
        slug,
    )
  }
}

export async function getAllStoriesForAdmin(): Promise<
  StoryRow[]
> {
  if (!isDatabaseConfigured()) {
    return []
  }

  return dbRequest<StoryRow[]>(
    'stories',
    {
      query:
        '?select=*&order=created_at.desc&limit=200',
    },
  )
}
