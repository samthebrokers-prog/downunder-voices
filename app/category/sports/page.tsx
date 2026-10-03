import type { Metadata } from 'next'
import { StoryCard } from '@/components/story-card'
import { getStoriesByCategory } from '@/lib/story-service'

export const metadata: Metadata = {
  title: 'Sports',
  description: 'Professional, grassroots and community sport across Australia and New Zealand.',
}

export const revalidate = 300

const sportsVideoUrl = 'https://www.nrl.com/news/topic/match-highlights/'

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
      <header className="mb-10 border-b-4 border-red-700 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
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
          <a
            href={sportsVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-64 items-center justify-center bg-black px-8 py-12 text-center text-white"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
                Sports Video of the Day
              </p>
              <p className="mt-4 font-serif text-3xl font-black">
                Australia PM&apos;s XIII v PNG PM&apos;s XIII
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                Latest official NRL match highlights
              </p>
              <span className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-sm font-black text-black">
                Watch official highlights ↗
              </span>
            </div>
          </a>

          <div className="flex flex-col justify-center p-7">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
              Current AU/NZ sport
            </p>
            <h2 className="mt-2 font-serif text-2xl font-black">
              Fresh sport, not expired match previews
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This position highlights current official Australian and New Zealand sports video. Older event promotions are removed after the event.
            </p>
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
