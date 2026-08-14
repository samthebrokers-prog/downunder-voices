import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { StoryCard } from '@/components/story-card'
import {
  categories,
  getCategory,
  type CategorySlug,
} from '@/lib/news-data'
import { getStoriesByCategory } from '@/lib/story-service'

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
        <section>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map(
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
