import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { BreakingNewsTicker } from '@/components/breaking-news-ticker'
import { SetupBanner } from '@/components/setup-banner'
import { StoryCard } from '@/components/story-card'
import { isDatabaseConfigured } from '@/lib/db'
import {
  categories,
  normaliseCategorySlug,
  type CategorySlug,
} from '@/lib/news-data'
import { getPublishedStories } from '@/lib/story-service'

export const revalidate = 300

const homepageCategories: CategorySlug[] = [
  'australia',
  'new-zealand',
  'world',
  'social-issues',
  'small-business',
  'trade-logistics',
  'community',
  'sports',
]

const topics = [
  'Housing',
  'Cost of Living',
  'International Students',
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

export default async function HomePage() {
  const configured = isDatabaseConfigured()
  const allStories = await getPublishedStories(120)

  const visibleStories = allStories.filter(
    (story) =>
      normaliseCategorySlug(story.category) !==
      'editorial-view',
  )

  const mixed = mixedLatest(visibleStories)
  const [lead, ...others] = mixed

  const breakingStories = mixed.slice(0, 6)
  const topStories = others.slice(0, 4)
  const latest = others.slice(4, 10)

  const opinionStories = allStories
    .filter(
      (story) =>
        normaliseCategorySlug(story.category) ===
        'editorial-view',
    )
    .slice(0, 3)

  return (
    <>
      {!configured && <SetupBanner />}

      <main>
        <h1 className="sr-only">
          Downunder Voices — independent news from Australia,
          New Zealand and the world
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

          {topStories.length > 0 && (
            <section className="mt-12">
              <SectionHeading
                title="Top Stories"
                href="/latest"
                linkText="View latest"
              />

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                {topStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
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
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </section>
          )}

          {homepageCategories.map((categorySlug) => {
            const category = categories.find(
              (item) => item.slug === categorySlug,
            )

            if (!category) return null

            const sectionStories = visibleStories
              .filter(
                (story) =>
                  normaliseCategorySlug(story.category) ===
                  categorySlug,
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
                title="Opinion"
                description="Independent perspectives on the issues shaping our communities."
                href="/category/editorial-view"
                linkText="View all"
              />

              <div className="grid gap-7 md:grid-cols-3">
                {opinionStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
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
              Public-interest reporting, practical information
              and stories affecting everyday people and small
              businesses.
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
                  Giving Communities a Voice. Holding Power
                  Accountable.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Independent journalism covering Australia,
                  New Zealand and the world, with a focus on
                  social issues, small business, community
                  voices and the stories that affect everyday
                  people.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                >
                  Submit your story
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

          <section className="my-16 overflow-hidden rounded-lg border border-border bg-secondary">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Featured Partner
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                  Importing or exporting across New Zealand
                  and Australia?
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Cusmode Customs provides professional customs
                  clearance, freight support and import-export
                  assistance for businesses and individuals
                  across New Zealand and Australia.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://cusmode.co.nz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Visit Cusmode NZ
                  </a>

                  <a
                    href="https://cusmode.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Visit Cusmode Australia
                  </a>
                </div>
              </div>

              <div className="rounded-md border border-border bg-background p-5">
                <p className="text-sm font-semibold">
                  Customs clearance support
                </p>

                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    New Zealand and Australian customs clearance
                  </li>
                  <li>Commercial and personal imports</li>
                  <li>Vehicle and machinery imports</li>
                  <li>
                    Freight and border compliance support
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-lg border border-border bg-secondary/70">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Promote your business
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold">
                  Reach readers across Australia and New
                  Zealand
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Downunder Voices offers advertising
                  opportunities for small businesses,
                  community organisations, events and
                  professional services.
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

function mixedLatest(
  stories: Awaited<
    ReturnType<typeof getPublishedStories>
  >,
) {
  const seen = new Set<string>()
  const primary = []
  const rest = []

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
