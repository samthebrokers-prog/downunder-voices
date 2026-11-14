import type { Metadata } from 'next'
import { StoryCard } from '@/components/story-card'
import { getStoriesByCategory } from '@/lib/story-service'

export const metadata: Metadata = {
  title: 'Sports',
  description: 'Professional, grassroots and community sport across Australia and New Zealand.',
}

export const revalidate = 300

export default async function SportsPage() {
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000
  const stories = (await getStoriesByCategory('sports', 60))
    .filter((story) => {
      const publishedAt = story.publishedAt ?? story.date
      if (!publishedAt) return false
      const publishedTime = new Date(publishedAt).getTime()
      return Number.isFinite(publishedTime) && publishedTime >= cutoff
    })
    .sort((a, b) =>
      new Date(b.publishedAt ?? b.date ?? 0).getTime() -
      new Date(a.publishedAt ?? a.date ?? 0).getTime(),
    )

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 border-b-4 border-neutral-900 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-900">
          Section
        </p>
        <h1 className="mt-2 font-serif text-4xl font-black tracking-tight sm:text-5xl">
          Sports
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          Professional, grassroots and community sport across Australia and New Zealand.
        </p>
      </header>

      <section className="mb-10 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          <div className="bg-black">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/XtfgwJani0E"
                title="Wales v New Zealand | Match Highlights | Nations Championship"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="px-5 py-3 text-xs text-zinc-300">
              Sports Video of the Day: Wales v New Zealand match highlights, Nations Championship. Video: SuperSport via YouTube.
            </p>
          </div>

          <div className="flex flex-col justify-center p-7">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-900">
              Current AU/NZ sport
            </p>
            <h2 className="mt-2 font-serif text-2xl font-black">
              Wales 35, All Blacks 28
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Wales beat New Zealand for the first time since 1953. Watch the highlights, then read our full story.
            </p>
            <a href="/story/wales-beat-all-blacks-73-year-drought-ends-cardiff-2026" className="mt-4 inline-block font-black underline">
              Read: History in Cardiff →
            </a>
          </div>
        </div>
      </section>

      {stories.length > 0 && (
        <section>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                imageIndex={index}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
