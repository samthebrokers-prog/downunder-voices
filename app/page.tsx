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

  const secondary = others.slice(0, 4)
  const latest = others.slice(4, 10)

  const visibleCategories = categories.filter(
    (category) => category.slug !== 'editorial-view',
  )

  return (
    <>
      {!configured && <SetupBanner />}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="sr-only">
          Downunder Voices — news from New Zealand, Australia and the Pacific
        </h1>

        <section
          aria-label="Advertising"
          className="mb-8 flex min-h-24 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-4 text-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Advertisement
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Advertising space available
            </p>
          </div>
        </section>

        {lead && (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-sm bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                  Top Story
                </span>

                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Latest news
                </span>
              </div>

              <StoryCard story={lead} variant="feature" />
            </div>

            <aside className="lg:border-l lg:border-border lg:pl-7">
              <div className="mb-5 flex items-center justify-between border-b-2 border-primary pb-2">
                <h2 className="font-serif text-xl font-bold">
                  More Headlines
                </h2>

                <Link
                  href="/latest"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
                >
                  Latest
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              <div className="flex flex-col gap-5">
                {secondary.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    variant="compact"
                  />
                ))}
              </div>
            </aside>
          </section>
        )}

        {latest.length > 0 && (
          <section className="mt-14">
            <SectionHeading
              title="Latest Across the Region"
              href="/latest"
              linkText="View latest"
            />

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>
        )}

        <section
          aria-label="Advertising"
          className="my-14 flex min-h-28 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-4 text-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Advertisement
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Promote your business across Australia, New Zealand and the
              Pacific
            </p>

            <Link
              href="/advertise"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Advertise with us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {visibleCategories.map((category) => {
          const stories = visibleStories
            .filter((story) => story.category === category.slug)
            .slice(0, 4)

          if (!stories.length) {
            return null
          }

          return (
            <section key={category.slug} className="mt-14">
              <SectionHeading
                title={category.name}
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

        <section className="mt-16 grid gap-8 rounded-lg border border-border bg-secondary/60 p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Stay informed
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold">
              News from across our region
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Follow independent coverage of New Zealand, Australia and Pacific
              communities, politics, business, sport and local developments.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/submit-your-story"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Submit your story
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/advertise"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Advertise with us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
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
    <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-primary pb-2">
      <h2 className="font-serif text-2xl font-bold sm:text-3xl">
        {title}
      </h2>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {linkText}
        <ArrowRight className="size-4" />
      </Link>
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
