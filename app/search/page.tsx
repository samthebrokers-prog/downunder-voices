import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

import { SetupBanner } from '@/components/setup-banner'
import { StoryCard } from '@/components/story-card'
import { isDatabaseConfigured } from '@/lib/db'
import { getPublishedStories } from '@/lib/story-service'

export const revalidate = 300

export const metadata = {
  title: 'Search News',
  description:
    'Search news and community stories from New Zealand, Australia and the Pacific.',
}

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string | string[]
  }>
}

function getSearchText(story: unknown) {
  try {
    return JSON.stringify(story).toLowerCase()
  } catch {
    return ''
  }
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const parameters = await searchParams
  const rawQuery = parameters?.q

  const query = (
    Array.isArray(rawQuery) ? rawQuery[0] : rawQuery || ''
  ).trim()

  const configured = isDatabaseConfigured()
  const allStories = await getPublishedStories(200)

  const publishedStories = allStories.filter(
    (story) => story.category !== 'editorial-view',
  )

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  const matchingStories =
    searchTerms.length > 0
      ? publishedStories.filter((story) => {
          const searchableText = getSearchText(story)

          return searchTerms.every((term) =>
            searchableText.includes(term),
          )
        })
      : []

  return (
    <>
      {!configured && <SetupBanner />}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b-2 border-red-700 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
            Downunder Voices
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Search News
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
            Search stories, headlines, topics and community news from New
            Zealand, Australia and across the Pacific.
          </p>

          <form
            action="/search"
            method="get"
            className="mt-6 flex max-w-3xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="news-search" className="sr-only">
              Search Downunder Voices
            </label>

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

              <input
                id="news-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search news, topics, countries or keywords..."
                className="h-12 w-full rounded-md border border-slate-300 bg-white pl-12 pr-4 text-base outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-700/20"
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-md bg-red-700 px-7 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Search
            </button>
          </form>
        </div>

        {!query ? (
          <section className="rounded-lg border border-border bg-secondary/40 px-6 py-14 text-center">
            <Search className="mx-auto size-10 text-muted-foreground" />

            <h2 className="mt-4 font-serif text-2xl font-bold">
              What are you looking for?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Enter a person, place, topic or keyword above to search all
              published Downunder Voices stories.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'Immigration',
                'Cost of living',
                'Housing',
                'Australia',
                'New Zealand',
                'Pacific',
                'Business',
                'Artificial intelligence',
              ].map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-700 hover:text-red-700"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </section>
        ) : matchingStories.length > 0 ? (
          <section>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Search results for
                </p>

                <h2 className="font-serif text-2xl font-bold">
                  “{query}”
                </h2>
              </div>

              <p className="text-sm font-semibold text-muted-foreground">
                {matchingStories.length}{' '}
                {matchingStories.length === 1 ? 'story' : 'stories'} found
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {matchingStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-lg border border-border bg-secondary/40 px-6 py-14 text-center">
            <Search className="mx-auto size-10 text-muted-foreground" />

            <h2 className="mt-4 font-serif text-2xl font-bold">
              No stories found
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              We could not find any published stories matching “{query}”.
              Try a shorter keyword, another spelling or a broader topic.
            </p>

            <Link
              href="/latest"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              <ArrowLeft className="size-4" />
              Browse latest news
            </Link>
          </section>
        )}
      </main>
    </>
  )
}
