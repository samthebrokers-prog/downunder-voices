import type { Metadata } from 'next'
import { StoryCard } from '@/components/story-card'
import { getStoriesByCategory } from '@/lib/story-service'

export const metadata: Metadata = {
  title: 'Sports',
  description: 'Professional, grassroots and community sport across Australia and New Zealand.',
}

export const revalidate = 300

export default async function SportsPage() {
  const stories = await getStoriesByCategory('sports', 60)

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

      <section className="mb-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
            Today’s match highlights
          </p>
          <h2 className="mt-2 font-serif text-2xl font-black sm:text-3xl">
            Springboks 29–24 All Blacks — Johannesburg
          </h2>
        </div>

        <div className="aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/zS-CyVtIYu8"
            title="Springboks 29–24 All Blacks highlights"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <div className="px-5 py-4 text-sm text-muted-foreground sm:px-6">
          Match highlights via YouTube.
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
