import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { StoryCard } from '@/components/story-card'
import { SetupBanner } from '@/components/setup-banner'
import { isDatabaseConfigured } from '@/lib/db'
import { getPublishedStories } from '@/lib/story-service'

export const revalidate = 300

export const metadata = {
  title: 'Latest News',
  description:
    'The latest news and community stories from New Zealand, Australia and the Pacific.',
}

export default async function LatestPage() {
  const configured = isDatabaseConfigured()
  const allStories = await getPublishedStories(100)

  const stories = allStories.filter(
    (story) => story.category !== 'editorial-view',
  )

  return (
    <>
      {!configured && <SetupBanner />}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b-2 border-primary pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Downunder Voices
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Latest News
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
            The newest stories, updates and community voices from New Zealand,
            Australia and across the Pacific.
          </p>
        </div>

        {stories.length > 0 ? (
          <section>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-lg border border-border bg-secondary/50 px-6 py-16 text-center">
            <h2 className="font-serif text-2xl font-bold">
              No stories are available yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              New stories are being prepared. Please check again shortly or
              return to the homepage for current coverage.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="size-4" />
              Return to homepage
            </Link>
          </section>
        )}
      </main>
    </>
  )
}
