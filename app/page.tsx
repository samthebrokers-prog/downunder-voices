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
  const allStories = await getPublishedStories(80)
  const mixed = mixedLatest(allStories)
  const [lead, ...others] = mixed
  const secondary = others.slice(0, 4)
  const remaining = others.slice(4, 10)

  return (
    <>
      {!configured && <SetupBanner />}

      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="sr-only">
              Downunder Voices — community news from New Zealand, Australia and
              the Pacific
            </h1>

            {lead && <StoryCard story={lead} variant="feature" />}
          </div>

          <aside>
            <h2 className="mb-4 border-b-2 border-primary pb-2 font-serif text-lg font-bold">
              More Headlines
            </h2>

            <div className="flex flex-col gap-4">
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

        {remaining.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 border-b-2 border-primary pb-2 font-serif text-2xl font-bold">
              Latest Across the Region
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {remaining.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>
        )}

        {categories
          .filter((category) => category.slug !== 'editorial-view')
          .map((category) => {
            const stories = allStories
              .filter((story) => story.category === category.slug)
              .slice(0, 3)

            if (!stories.length) {
              return null
            }

            return (
              <section key={category.slug} className="mt-14">
                <div className="mb-6 flex items-end justify-between border-b-2 border-primary pb-2">
                  <h2 className="font-serif text-2xl font-bold">
                    {category.name}
                  </h2>

                  <Link
                    href={`/category/${category.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    View all
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {stories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </section>
            )
          })}

        <section className="mt-16 rounded-lg border border-border bg-secondary p-6 sm:p-8">
          <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Opinion & Commentary
              </p>

              <h2 className="font-serif text-2xl font-bold">
                Editorial View
              </h2>
            </div>

            <Link
              href="/category/editorial-view"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              All editorials
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {allStories
              .filter((story) => story.category === 'editorial-view')
              .slice(0, 2)
              .map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  variant="compact"
                />
              ))}
          </div>
        </section>
      </div>
    </>
  )
}

function mixedLatest(
  stories: Awaited<ReturnType<typeof getPublishedStories>>
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
