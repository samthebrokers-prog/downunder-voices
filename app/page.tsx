import Link from 'next/link'
import { ArrowRight, Clock3, Globe2 } from 'lucide-react'

import { BreakingNewsTicker } from '@/components/breaking-news-ticker'
import { SetupBanner } from '@/components/setup-banner'
import { StoryCard } from '@/components/story-card'
import { isDatabaseConfigured } from '@/lib/db'
import { currentCartoon } from '@/lib/editorial-cartoons'
import {
  categories,
  normaliseCategorySlug,
  type CategorySlug,
} from '@/lib/news-data'
import { sortStoriesByScore } from '@/lib/story-score'
import { getPublishedStories } from '@/lib/story-service'

export const revalidate = 300

type HomeStory = Awaited<
  ReturnType<typeof getPublishedStories>
>[number]

const homepageCategories: CategorySlug[] = [
  'australia',
  'new-zealand',
  'world',
  'entertainment',
  'social-issues',
  'small-business',
  'trade-logistics',
  'community',
  'sports',
]

const topics = [
  'Housing',
  'Cost of Living',
  'Politics',
  'Crime & Courts',
  'Entertainment',
  'Celebrity',
  'Sport',
  'Technology',
  'Artificial Intelligence',
  'Health',
  'Education',
  'Small Business',
  'Customs',
  'Biosecurity',
  'Freight Forwarding',
  'Shipping',
  'Ports',
  'Supply Chains',
  'International Trade',
  'Community',
  'World Affairs',
]

const ninetySecondInterestTerms = [
  'breaking',
  'exclusive',
  'scandal',
  'corruption',
  'corrupt',
  'resign',
  'resignation',
  'minister',
  'prime minister',
  'president',
  'election',
  'court',
  'trial',
  'charged',
  'arrested',
  'police',
  'crime',
  'murder',
  'fraud',
  'scam',
  'celebrity',
  'actor',
  'actress',
  'singer',
  'movie',
  'film',
  'music',
  'hollywood',
  'viral',
  'social media',
  'earthquake',
  'tsunami',
  'cyclone',
  'flood',
  'wildfire',
  'war',
  'attack',
  'trump',
  'housing',
  'mortgage',
  'interest rate',
  'cost of living',
  'petrol',
  'jobs',
  'artificial intelligence',
  'ai',
  'rugby',
  'cricket',
  'football',
  'tennis',
]

const duplicateStopWords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'into',
  'is',
  'it',
  'of',
  'on',
  'or',
  'says',
  'the',
  'their',
  'this',
  'to',
  'with',
  'after',
  'amid',
  'over',
  'new',
  'live',
  'latest',
  'breaking',
])

export default async function HomePage() {
  const configured = isDatabaseConfigured()
  const allStories = await getPublishedStories(160)

  const visibleStories = allStories.filter(
    (story) => !isEditorialStory(story),
  )

  const rankedStories =
    rankForHomepage(visibleStories)

  const mixed = mixedLatest(rankedStories)
  const [lead, ...others] = mixed

  const breakingStories = rankedStories.slice(0, 6)
  const topStories = others.slice(0, 4)
  const latest = others.slice(4, 10)

  const ninetySeconds =
    buildNinetySecondBriefing(visibleStories)

  const opinionStories = allStories
    .filter((story) => isEditorialStory(story))
    .slice(0, 3)

  return (
    <>
      {!configured && <SetupBanner />}

      <main>
        <h1 className="sr-only">
          Downunder Voices — independent news from Australia,
          New Zealand, the Pacific and the world
        </h1>

        <BreakingNewsTicker stories={breakingStories} />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {lead && (
            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-red-700 pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-sm bg-red-700 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white">
                    Top Story
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    News that matters
                  </span>
                </div>

                <Link
                  href="/latest"
                  className="inline-flex items-center gap-1 text-sm font-bold text-red-700 hover:underline"
                >
                  View latest
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <StoryCard story={lead} variant="feature" />
              </div>
            </section>
          )}

          <section className="mt-12 overflow-hidden rounded-xl border border-amber-300 bg-amber-50 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-300 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
                  Original Downunder Voices satire
                </p>
                <h2 className="mt-1 font-serif text-3xl font-black text-slate-950">
                  Cartoon of the Day
                </h2>
              </div>

              <Link
                href="/cartoon-of-the-day"
                className="inline-flex items-center gap-1 text-sm font-black text-red-700 hover:underline"
              >
                Open today&apos;s cartoon
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <Link href="/cartoon-of-the-day" className="block">
              <img
                src={currentCartoon.image}
                alt={currentCartoon.alt}
                className="h-auto w-full"
              />
            </Link>
          </section>

          {ninetySeconds.length > 0 && (
            <section className="mt-12 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-white shadow-lg">
              <div className="border-b border-slate-800 px-6 py-6 sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-red-400">
                      <Globe2 className="size-5" />

                      <p className="text-xs font-black uppercase tracking-[0.2em]">
                        Fast Global Briefing
                      </p>
                    </div>

                    <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">
                      Around the World in 90 Seconds
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                      The stories people are talking about —
                      3 from Australia, 3 from New Zealand and
                      the Pacific, and 4 from around the world.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200">
                    <Clock3 className="size-4 text-red-400" />
                    90 sec read
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2">
                {ninetySeconds.map((item, index) => (
                  <Link
                    key={item.story.id}
                    href={`/story/${
                      item.story.slug ?? item.story.id
                    }`}
                    className="group border-b border-slate-800 px-6 py-5 transition hover:bg-slate-900 md:px-8 md:[&:nth-child(odd)]:border-r"
                  >
                    <div className="flex gap-4">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-700 text-xs font-black text-white">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-red-400">
                            {item.label}
                          </span>

                          <span className="text-xs text-slate-500">
                            •
                          </span>

                          <span className="text-xs font-semibold text-slate-400">
                            {formatBriefingDate(
                              item.story.publishedAt ??
                                item.story.date,
                            )}
                          </span>
                        </div>

                        <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-white transition group-hover:text-red-300">
                          {item.story.title}
                        </h3>

                        {item.story.summary && (
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {shortSummary(
                              item.story.summary,
                              155,
                            )}
                          </p>
                        )}

                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-red-400">
                          Read story
                          <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-6 py-4 text-xs sm:px-8">
                <span className="font-semibold text-slate-400">
                  Australia 3 · New Zealand &amp; Pacific 3 · World 4
                </span>

                <Link
                  href="/latest"
                  className="inline-flex items-center gap-1 font-bold text-red-400 hover:text-red-300"
                >
                  More news
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </section>
          )}

          {topStories.length > 0 && (
            <section className="mt-12">
              <SectionHeading
                title="Top Stories"
                href="/latest"
                linkText="View latest"
              />

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                {topStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                  />
                ))}
              </div>
            </section>
          )}

          {latest.length > 0 && (
            <section className="mt-16">
              <SectionHeading
                title="Latest News"
                href="/latest"
                linkText="View all"
              />

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {latest.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                  />
                ))}
              </div>
            </section>
          )}

          {homepageCategories.map((categorySlug) => {
            const category = categories.find(
              (item) =>
                item.slug === categorySlug,
            )

            if (!category) return null

            const sectionStories = visibleStories
              .filter(
                (story) =>
                  normaliseCategorySlug(
                    story.category,
                  ) === categorySlug,
              )
              .slice(0, 4)

            if (!sectionStories.length) {
              return null
            }

            return (
              <section
                key={category.slug}
                className="mt-16"
              >
                <SectionHeading
                  title={category.name}
                  description={category.description}
                  href={`/category/${category.slug}`}
                  linkText="View all"
                />

                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                  {sectionStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                    />
                  ))}
                </div>
              </section>
            )
          })}

          {opinionStories.length > 0 && (
            <section className="mt-16">
              <SectionHeading
                title="From the Editor"
                description="Independent Downunder Voices commentary on poverty, migration, wages, discrimination and fairness."
                href="/category/editorial-view"
                linkText="View all"
              />

              <div className="grid gap-7 md:grid-cols-3">
                {opinionStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 rounded-lg border border-border bg-secondary/60 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
              Explore
            </p>

            <h2 className="mt-2 font-serif text-2xl font-black sm:text-3xl">
              Topics We Cover
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              News, public-interest reporting and stories people
              are talking about across Australia, New Zealand
              and the world.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-16 overflow-hidden rounded-lg bg-slate-950 text-white">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                  Downunder Voices
                </p>

                <h2 className="mt-3 font-serif text-3xl font-black sm:text-4xl">
                  Australia. New Zealand. The Pacific. The World.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Breaking news, politics, entertainment,
                  community, business, sport and the stories
                  people are talking about — without the noise.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/latest"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                >
                  Latest News
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  About Downunder Voices
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>

          <section className="my-16 overflow-hidden rounded-lg border border-border bg-secondary/70">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Promote your business
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold">
                  Reach readers across Australia and New Zealand
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Downunder Voices offers advertising
                  opportunities for businesses, community
                  organisations, events and professional
                  services.
                </p>
              </div>

              <div className="flex lg:justify-end">
                <Link
                  href="/advertise"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Advertise with us
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

type SectionHeadingProps = {
  title: string
  description?: string
  href: string
  linkText: string
}

function SectionHeading({
  title,
  description,
  href,
  linkText,
}: SectionHeadingProps) {
  return (
    <div className="mb-7">
      <div className="h-1 w-16 bg-red-700" />

      <div className="flex items-end justify-between gap-4 border-b border-border py-3">
        <div>
          <h2 className="font-serif text-2xl font-black sm:text-3xl">
            {title}
          </h2>

          {description && (
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-red-700 hover:underline"
        >
          {linkText}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}

function isEditorialStory(
  story: HomeStory,
): boolean {
  if (
    normaliseCategorySlug(story.category) ===
    'editorial-view'
  ) {
    return true
  }

  const author =
    story.author?.trim().toLowerCase() ?? ''

  return (
    author.includes(
      'downunder voices editorial',
    ) ||
    author.includes(
      'from the editor',
    )
  )
}

function mixedLatest(
  stories: HomeStory[],
): HomeStory[] {
  const seen = new Set<string>()
  const primary: HomeStory[] = []
  const rest: HomeStory[] = []

  for (const story of stories) {
    const category = normaliseCategorySlug(
      story.category,
    )

    if (!seen.has(category)) {
      seen.add(category)
      primary.push(story)
    } else {
      rest.push(story)
    }
  }

  return [...primary, ...rest]
}

function rankForHomepage(
  stories: HomeStory[],
): HomeStory[] {
  return sortStoriesByScore(stories)
}

type BriefingItem = {
  story: HomeStory
  label: 'Australia' | 'New Zealand & Pacific' | 'World'
}

function buildNinetySecondBriefing(
  stories: HomeStory[],
): BriefingItem[] {
  const ranked = stories
    .filter((story) => !isEditorialStory(story))
    .sort(
      (a, b) =>
        ninetySecondScore(b) -
        ninetySecondScore(a),
    )

  const selected: HomeStory[] = []

  const australia = selectRegionalBriefingStories(
    ranked,
    'australia',
    3,
    selected,
  )

  selected.push(...australia)

  const newZealand = selectRegionalBriefingStories(
    ranked,
    'new-zealand',
    3,
    selected,
  )

  selected.push(...newZealand)

  const world = selectRegionalBriefingStories(
    ranked,
    'world',
    4,
    selected,
  )

  return [
    ...australia.map((story) => ({
      story,
      label: 'Australia' as const,
    })),
    ...newZealand.map((story) => ({
      story,
      label: 'New Zealand & Pacific' as const,
    })),
    ...world.map((story) => ({
      story,
      label: 'World' as const,
    })),
  ]
}

function selectRegionalBriefingStories(
  rankedStories: HomeStory[],
  categorySlug: 'australia' | 'new-zealand' | 'world',
  limit: number,
  alreadySelected: HomeStory[],
): HomeStory[] {
  const regionalStories = rankedStories.filter(
    (story) =>
      normaliseCategorySlug(story.category) ===
      categorySlug,
  )

  const freshStories = regionalStories.filter(
    (story) => storyAgeHours(story) <= 24,
  )

  const picked = selectBriefingStories(
    freshStories,
    limit,
    alreadySelected,
  )

  if (picked.length >= limit) {
    return picked
  }

  const fallbackStories = regionalStories.filter(
    (story) => {
      const age = storyAgeHours(story)

      return (
        age > 24 &&
        age <= 48 &&
        !picked.some(
          (pickedStory) =>
            pickedStory.id === story.id,
        )
      )
    },
  )

  const fallback = selectBriefingStories(
    fallbackStories,
    limit - picked.length,
    [...alreadySelected, ...picked],
  )

  return [...picked, ...fallback]
}

function selectBriefingStories(
  candidates: HomeStory[],
  limit: number,
  alreadySelected: HomeStory[],
): HomeStory[] {
  const picked: HomeStory[] = []

  for (const candidate of candidates) {
    if (isEditorialStory(candidate)) {
      continue
    }

    const comparisonPool = [
      ...alreadySelected,
      ...picked,
    ]

    const duplicate = comparisonPool.some(
      (existing) =>
        likelySameStory(
          existing.title,
          candidate.title,
        ),
    )

    if (duplicate) {
      continue
    }

    picked.push(candidate)

    if (picked.length >= limit) {
      break
    }
  }

  return picked
}

function storyAgeHours(
  story: HomeStory,
): number {
  const published = story.publishedAt
    ? new Date(story.publishedAt)
    : new Date(`${story.date}T00:00:00`)

  if (Number.isNaN(published.valueOf())) {
    return Number.POSITIVE_INFINITY
  }

  return Math.max(
    0,
    (Date.now() - published.getTime()) /
      (1000 * 60 * 60),
  )
}

function ninetySecondScore(
  story: HomeStory,
): number {
  const text =
    `${story.title} ${story.summary}`.toLowerCase()

  let score = 0

  for (const term of ninetySecondInterestTerms) {
    if (text.includes(term)) {
      score += 8
    }
  }

  const ageHours = storyAgeHours(story)

  if (ageHours <= 3) {
    score += 40
  } else if (ageHours <= 8) {
    score += 32
  } else if (ageHours <= 16) {
    score += 24
  } else if (ageHours <= 24) {
    score += 16
  } else if (ageHours <= 36) {
    score -= 4
  } else if (ageHours <= 48) {
    score -= 10
  } else {
    score -= 100
  }

  if (story.title.length >= 30) {
    score += 3
  }

  if (story.summary.length >= 80) {
    score += 2
  }

  return score
}

function likelySameStory(
  firstTitle: string,
  secondTitle: string,
): boolean {
  const first = headlineTokens(firstTitle)
  const second = headlineTokens(secondTitle)

  if (!first.length || !second.length) {
    return false
  }

  const firstSet = new Set(first)
  const secondSet = new Set(second)

  let shared = 0

  for (const word of firstSet) {
    if (secondSet.has(word)) {
      shared += 1
    }
  }

  const smallerSize = Math.min(
    firstSet.size,
    secondSet.size,
  )

  if (!smallerSize) {
    return false
  }

  return shared / smallerSize >= 0.62
}

function headlineTokens(
  title: string,
): string[] {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(
      (word) =>
        word.length >= 3 &&
        !duplicateStopWords.has(word),
    )
}

function shortSummary(
  value: string,
  maximumLength: number,
): string {
  const cleaned = value
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= maximumLength) {
    return cleaned
  }

  return `${cleaned
    .slice(0, maximumLength - 1)
    .trim()}…`
}

function formatBriefingDate(
  value: string,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.valueOf())) {
    return 'Latest'
  }

  return date.toLocaleDateString(
    'en-NZ',
    {
      day: 'numeric',
      month: 'short',
    },
  )
}
