import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { StoryCard } from '@/components/story-card'
import { categories } from '@/lib/news-data'
import { getPublishedStories } from '@/lib/story-service'
import { isDatabaseConfigured } from '@/lib/db'
import { SetupBanner } from '@/components/setup-banner'

export const revalidate = 300

export default async function HomePage() {
  const configured = isDatabaseConfigured()
  const allStories = await getPublishedStories(100)

  const visibleStories = allStories.filter(
    (story) => story.category !== 'editorial-view',
  )

  const mixed = mixedLatest(visibleStories)
  const [lead, ...others] = mixed

  const breakingStories = mixed.slice(0, 4)
  const liveHeadlines = others.slice(0, 5)
  const latest = others.slice(5, 11)

  const visibleCategories = categories.filter(
    (category) => category.slug !== 'editorial-view',
  )

  return (
    <>
      {!configured && <SetupBanner />}

      <main>
        <h1 className="sr-only">
          Downunder Voices — news from New Zealand, Australia and the Pacific
        </h1>

        {breakingStories.length > 0 && (
          <section className="border-b border-red-900 bg-red-700 text-white">
            <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
              <div className="shrink-0 border-r border-red-500 bg-red-800 px-4 py-3 text-xs font-black uppercase tracking-[0.16em]">
                Breaking
              </div>

              <div className="min-w-0 flex-1 overflow-hidden px-4 py-3">
                <div className="flex min-w-max items-center gap-8">
                  {breakingStories.map((story, index) => (
                    <span
                      key={story.id}
                      className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold"
                    >
                      <span className="inline-block size-1.5 rounded-full bg-white" />

                      <span className="text-red-100">
                        {index === 0 ? 'Latest:' : ''}
                      </span>

                      <span>{story.title}</span>
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/latest"
                className="hidden shrink-0 items-center gap-1 border-l border-red-500 px-4 py-3 text-xs font-bold uppercase tracking-wide hover:bg-red-800 sm:inline-flex"
              >
                All News
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </section>
        )}

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-8 overflow-hidden rounded-lg border border-border bg-secondary">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Featured Partner
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                  Importing or exporting across New Zealand and Australia?
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Cusmode Customs provides professional customs clearance,
                  freight support and import-export assistance for businesses
                  and individuals across New Zealand and Australia.
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
                  <li>New Zealand and Australian customs clearance</li>
                  <li>Commercial and personal imports</li>
                  <li>Vehicle and machinery imports</li>
                  <li>Freight and border compliance support</li>
                </ul>
              </div>
            </div>
          </section>

          {lead && (
            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-red-700 pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-sm bg-red-700 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white">
                    Top Story
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Across the region
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

              <div className="grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(310px,0.9fr)]">
                <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                  <StoryCard story={lead} variant="feature" />
                </div>

                <aside className="overflow-hidden rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border bg-slate-950 px-5 py-4 text-white">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                        Newsroom
                      </p>

                      <h2 className="mt-1 font-serif text-xl font-bold">
                        Live Headlines
                      </h2>
                    </div>

                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-400">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                      </span>
                      Live
                    </span>
                  </div>

                  <div className="divide-y divide-border">
                    {liveHeadlines.map((story, index) => (
                      <div
                        key={story.id}
                        className="group grid grid-cols-[34px_1fr] gap-3 px-5 py-4 transition hover:bg-muted/50"
                      >
                        <span className="font-serif text-2xl font-black text-red-700">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <StoryCard story={story} variant="compact" />
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/latest"
                    className="flex items-center justify-center gap-2 border-t border-border px-5 py-4 text-sm font-bold text-red-700 transition hover:bg-muted"
                  >
                    See all latest stories
                    <ArrowRight className="size-4" />
                  </Link>
                </aside>
              </div>
            </section>
          )}

          {latest.length > 0 && (
            <section className="mt-16">
              <SectionHeading
                title="Latest Across the Region"
                href="/latest"
                linkText="View latest"
              />

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {latest.map((story, index) => (
                  <div
                    key={story.id}
                    className={
                      index === 0
                        ? 'sm:col-span-2 lg:col-span-1'
                        : undefined
                    }
                  >
                    <StoryCard story={story} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="my-16 overflow-hidden rounded-lg border border-border bg-secondary/70">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Promote your business
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold">
                  Reach readers across Australia, New Zealand and the Pacific
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Downunder Voices offers advertising opportunities for
                  businesses, community organisations, events and professional
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

          {visibleCategories.map((category) => {
            const stories = visibleStories
              .filter((story) => story.category === category.slug)
              .slice(0, 4)

            if (!stories.length) {
              return null
            }

            const sectionTitle =
              category.name === "Sam's View" ? 'Opinion' : category.name

            return (
              <section key={category.slug} className="mt-16">
                <SectionHeading
                  title={sectionTitle}
                  href={`/category/${category.slug}`}
                  linkText="View all"
                />

                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                  {stories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </section>
            )
          })}

          <section className="mt-16 overflow-hidden rounded-lg bg-slate-950 text-white">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                  Your community. Your voice.
                </p>

                <h2 className="mt-3 font-serif text-3xl font-black sm:text-4xl">
                  News from across our region
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Follow independent coverage of New Zealand, Australia and
                  Pacific communities, politics, business, sport and local
                  developments.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                >
                  Submit your story
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/advertise"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
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
  href: string
  linkText: string
}

function SectionHeading({
  title,
  href,
  linkText,
}: SectionHeadingProps) {
  return (
    <div className="mb-7">
      <div className="h-1 w-16 bg-red-700" />

      <div className="flex items-end justify-between gap-4 border-b border-border py-3">
        <h2 className="font-serif text-2xl font-black sm:text-3xl">
          {title}
        </h2>

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
  stories: Awaited<ReturnType<typeof getPublishedStories>>,
) {
  const seen = new Set<string>()
  const primary = []
  const rest = []

  for (const story of stories) {
    if (!seen.has(story.category)) {
      seen.add(story.category)
      primary.push(story)
    } else {
      rest.push(story)
    }
  }

  return [...primary, ...rest]
}
