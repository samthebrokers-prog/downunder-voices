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

  const stories = await getStoriesByCategory(
    category.slug as CategorySlug,
    60,
  )

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
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-border bg-secondary/50 px-6 py-12 text-center">
          <h2 className="font-serif text-2xl font-bold">
            More stories are coming
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            We are expanding our coverage of {category.name}.
            Check back shortly for the latest reporting and
            analysis.
          </p>
        </section>
      )}
    </main>
  )
}
