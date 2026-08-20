import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { StoryCard } from '@/components/story-card'
import {
  categories,
  getCategory,
  type CategorySlug,
} from '@/lib/news-data'
import { getStoriesByCategory } from '@/lib/story-service'
import { fetchFeed } from '@/lib/rss'

export const revalidate = 300

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const category = getCategory(slug)

  if (!category) {
    return {
      title: 'Section Not Found',
    }
  }

  return {
    title: category.name,
    description: category.description,
  }
}

function normaliseText(
  value?: string | null,
) {
  return (value ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
}

function removeDuplicateStories<
  T extends {
    id?: string | number | null
    title?: string | null
    summary?: string | null
    sourceUrl?: string | null
  },
>(stories: T[]) {
  const seenIds = new Set<string>()
  const seenTitles = new Set<string>()
  const seenUrls = new Set<string>()

  return stories.filter((story) => {
    const id =
      story.id !== undefined &&
      story.id !== null
        ? String(story.id)
        : ''

    const title = normaliseText(
      story.title,
    )

    const sourceUrl = (
      story.sourceUrl ?? ''
    )
      .trim()
      .toLowerCase()
      .replace(/\/$/, '')

    if (id && seenIds.has(id)) {
      return false
    }

    if (
      title &&
      seenTitles.has(title)
    ) {
      return false
    }

    if (
      sourceUrl &&
      seenUrls.has(sourceUrl)
    ) {
      return false
    }

    if (id) {
      seenIds.add(id)
    }

    if (title) {
      seenTitles.add(title)
    }

    if (sourceUrl) {
      seenUrls.add(sourceUrl)
    }

    return true
  })
}

type LiveEntertainmentItem = {
  title: string
  link: string
  summary: string
  publishedAt: string
  imageUrl?: string
  sourceName: string
}

const LIVE_ENTERTAINMENT_FEEDS = [
  {
    sourceName: '7NEWS Entertainment',
    feedUrl:
      'https://7news.com.au/entertainment/rss',
  },
  {
    sourceName: 'BBC Entertainment & Arts',
    feedUrl:
      'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
  },
  {
    sourceName: 'The Guardian Culture',
    feedUrl:
      'https://www.theguardian.com/culture/rss',
  },
  {
    sourceName: 'TMZ',
    feedUrl:
      'https://www.tmz.com/rss.xml',
  },
]

function decodeDisplayText(value: string): string {
  let decoded = value

  for (let pass = 0; pass < 2; pass += 1) {
    decoded = decoded
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&#(\d+);/g, (_, code) =>
        String.fromCodePoint(Number(code)),
      )
      .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
        String.fromCodePoint(
          Number.parseInt(code, 16),
        ),
      )
  }

  return decoded
}

function isClearlyNotEntertainment(
  title: string,
  summary: string,
): boolean {
  const text = `${title} ${summary}`.toLowerCase()

  return /\b(senate|senator|congress|congressman|congresswoman|president|prime minister|election|politics|political|parliament|white house|amazon deal|shopping deal|discount code|activewear deal|finals experience|match tickets?|rugby|cricket|nrl|afl|nba|nfl)\b/i.test(
    text,
  )
}

async function getArticleImage(
  link: string,
): Promise<string | undefined> {
  try {
    const response = await fetch(link, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; DownunderVoicesBot/1.0)',
      },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })

    if (!response.ok) {
      return undefined
    }

    const html = await response.text()
    const metaPatterns = [
      /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i,
      /<meta[^>]+(?:property|name)=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']twitter:image(?::src)?["']/i,
    ]

    for (const pattern of metaPatterns) {
      const candidate = html.match(pattern)?.[1]

      if (candidate) {
        return new URL(
          candidate.replace(/&amp;/g, '&'),
          link,
        ).toString()
      }
    }
  } catch {
    // Keep the source-branded fallback if a publisher blocks access.
  }

  return undefined
}

async function getLiveEntertainmentItems():
  Promise<LiveEntertainmentItem[]> {
  const results =
    await Promise.allSettled(
      LIVE_ENTERTAINMENT_FEEDS.map(
        async (source) => {
          const items =
            await fetchFeed(
              source.feedUrl,
            )

          return Promise.all(
            items
              .slice(0, 10)
              .filter(
                (item) =>
                  !isClearlyNotEntertainment(
                    item.title,
                    item.description,
                  ),
              )
              .map(async (item) => ({
                title: decodeDisplayText(
                  item.title,
                ),
                link: item.link,
                summary: decodeDisplayText(
                  item.description,
                ),
                publishedAt:
                  item.publishedAt,
                imageUrl:
                  item.imageUrl ||
                  (await getArticleImage(
                    item.link,
                  )),
                sourceName:
                  source.sourceName,
              })),
          )
        },
      ),
    )

  const seenLinks = new Set<string>()

  return results
    .flatMap((result) =>
      result.status === 'fulfilled'
        ? result.value
        : [],
    )
    .filter((item) => {
      if (
        !item.title ||
        !item.link ||
        seenLinks.has(item.link)
      ) {
        return false
      }

      seenLinks.add(item.link)
      return true
    })
    .sort(
      (a, b) =>
        new Date(
          b.publishedAt,
        ).getTime() -
        new Date(
          a.publishedAt,
        ).getTime(),
    )
    .slice(0, 18)
}

function isRealSportsStory(
  title?: string | null,
  summary?: string | null,
) {
  const text =
    `${title ?? ''} ${summary ?? ''}`
      .toLowerCase()

  const strongSportsRule =
    /\b(rugby|cricket|football|soccer|netball|nrl|afl|olympic|olympics|tennis|golf|basketball|super rugby|all blacks|wallabies|matildas|socceroos|black caps|a-league|premier league|world cup|grand slam)\b/i

  const sportsContextRule =
    /\b(sport|sports|sporting|championship|tournament|final|semi-final|quarter-final|match|game|fixture|season|coach|player|athlete|team|club|league)\b/i

  const sportsCompetitionRule =
    /\b(won|wins|win|lost|loss|defeat|beat|beats|score|scored|goal|goals|try|tries|points|medal|medals|champion|champions|competition|stadium)\b/i

  if (strongSportsRule.test(text)) {
    return true
  }

  if (
    sportsContextRule.test(text) &&
    sportsCompetitionRule.test(text)
  ) {
    return true
  }

  return false
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const category = getCategory(slug)

  if (!category) {
    notFound()
  }

  const rawStories =
    await getStoriesByCategory(
      category.slug as CategorySlug,
      60,
    )

  const filteredStories =
    category.slug === 'sports'
      ? rawStories.filter((story) =>
          isRealSportsStory(
            story.title,
            story.summary,
          ),
        )
      : rawStories

  const stories =
    removeDuplicateStories(filteredStories)

  const freshEditorComments =
    category.slug === 'social-issues'
      ? stories
          .filter((story) => {
            const author =
              story.author
                ?.toLowerCase()
                .trim() ?? ''

            const publishedAt =
              story.publishedAt ??
              story.date

            const publishedTime =
              publishedAt
                ? new Date(
                    publishedAt,
                  ).getTime()
                : 0

            return (
              (
                author.includes(
                  'from the editor',
                ) ||
                author.includes(
                  'downunder voices editorial',
                )
              ) &&
              publishedTime > 0 &&
              Date.now() -
                publishedTime <=
                24 * 60 * 60 * 1000
            )
          })
          .slice(0, 2)
      : []

  const regularStories =
    freshEditorComments.length > 0
      ? stories.filter(
          (story) =>
            !freshEditorComments.some(
              (editorial) =>
                editorial.id ===
                story.id,
            ),
        )
      : stories

  /*
   * If the database importer has not populated Entertainment
   * yet, display current source-linked RSS stories directly.
   * The page therefore remains useful even between cron runs.
   */
  const liveEntertainmentItems =
    category.slug === 'entertainment' &&
    stories.length === 0
      ? await getLiveEntertainmentItems()
      : []

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 border-b-4 border-red-700 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
          Section
        </p>

        <h1 className="mt-2 font-serif text-4xl font-black tracking-tight sm:text-5xl">
          {category.name}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          {category.description}
        </p>
      </header>

      {stories.length > 0 ? (
        <>
          {freshEditorComments.length > 0 && (
            <section className="mb-12 rounded-xl border-2 border-red-700 bg-red-50/60 p-5 dark:bg-red-950/20 sm:p-7">
              <div className="mb-6 border-b border-red-200 pb-4 dark:border-red-900">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
                  From the Editor
                </p>
                <h2 className="mt-2 font-serif text-3xl font-black">
                  Today’s Social Issues Comment
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Independent Downunder Voices commentary,
                  prominently featured for 24 hours.
                </p>
              </div>

              <div className="grid gap-7 md:grid-cols-2">
                {freshEditorComments.map(
                  (story, index) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      imageIndex={index}
                    />
                  ),
                )}
              </div>
            </section>
          )}

          {regularStories.length > 0 && (
            <section>
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {regularStories.map(
                  (story, index) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      imageIndex={
                        index +
                        freshEditorComments.length
                      }
                    />
                  ),
                )}
              </div>
            </section>
          )}
        </>
      ) : liveEntertainmentItems.length > 0 ? (
        <section>
          <div className="mb-6 rounded-md border border-border bg-secondary/50 px-5 py-4 text-sm leading-6 text-muted-foreground">
            Live headlines from verified Entertainment feeds.
            Follow each source link for the complete original report.
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {liveEntertainmentItems.map(
              (item) => (
                <article
                  key={item.link}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                >
                  {item.imageUrl ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-[16/10] overflow-hidden bg-muted"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-red-950 to-rose-700 px-6 text-center font-serif text-2xl font-black text-white">
                      Entertainment
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                      {item.sourceName}
                    </p>
                    <h2 className="mt-2 font-serif text-xl font-bold leading-snug">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-700"
                      >
                        {item.title}
                      </a>
                    </h2>
                    {item.summary && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {item.summary}
                      </p>
                    )}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-5 text-sm font-black text-red-700 hover:underline"
                    >
                      Read original story ↗
                    </a>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-border bg-secondary/50 px-6 py-12 text-center">
          <h2 className="font-serif text-2xl font-bold">
            More stories are coming
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            We are expanding our coverage
            of {category.name}. Check back
            shortly for the latest reporting
            and analysis.
          </p>
        </section>
      )}
    </main>
  )
}
