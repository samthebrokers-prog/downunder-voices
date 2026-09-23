import type { Metadata } from 'next'
import { StoryCard } from '@/components/story-card'
import { getStoriesByCategory } from '@/lib/story-service'

export const metadata: Metadata = {
  title: 'Sports',
  description: 'Professional, grassroots and community sport across Australia and New Zealand.',
}

export const revalidate = 300

const aflGrandFinalGuide = 'https://www.afl.com.au/news/1616906/what-time-does-the-2026-toyota-afl-grand-final-start'
const aflGrandFinalPreview = 'https://www.afl.com.au/news/1619354/grand-final-mega-preview-fremantle-dockers-v-brisbane-lions-stats-that-matter-who-wins-and-why'
const freoGrandFinalWeek = 'https://www.fremantlefc.com.au/news/2138000/freos-grand-final-week-all-the-events'

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

      <section className="mb-8 overflow-hidden rounded-xl border border-purple-300 bg-gradient-to-br from-purple-950 via-purple-900 to-slate-950 text-white shadow-lg">
        <div className="px-5 py-7 sm:px-8 sm:py-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            AFL Grand Final 2026 • Saturday 26 September
          </p>
          <h2 className="mt-3 max-w-4xl font-serif text-3xl font-black leading-tight sm:text-5xl">
            Fremantle chasing history against Brisbane at the MCG
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100">
            Fremantle are one win from the club&apos;s first AFL premiership, while Brisbane arrive at a fourth consecutive Grand Final seeking a third straight flag.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
            <span className="rounded-full bg-white/10 px-4 py-2">MCG • Melbourne</span>
            <span className="rounded-full bg-white/10 px-4 py-2">12:30 pm AWST</span>
            <span className="rounded-full bg-white/10 px-4 py-2">2:30 pm AEST</span>
            <span className="rounded-full bg-white/10 px-4 py-2">5:30 pm NZST</span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={aflGrandFinalGuide}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-white px-4 py-2.5 text-sm font-black text-purple-950 transition hover:bg-purple-100"
            >
              Official AFL Grand Final guide
            </a>
            <a
              href={aflGrandFinalPreview}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-white/40 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10"
            >
              Official AFL match preview &amp; videos
            </a>
            <a
              href={freoGrandFinalWeek}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-white/40 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10"
            >
              Fremantle Grand Final week
            </a>
          </div>
        </div>
      </section>

      <section className="mb-12 rounded-xl border border-border bg-card px-5 py-5 shadow-sm sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
          Grand Final watch
        </p>
        <h2 className="mt-2 font-serif text-2xl font-black sm:text-3xl">
          Perth turns purple as Dockers prepare for the biggest Saturday of the season
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
          Downunder Voices will keep this page focused on Fremantle–Brisbane team news, supporter events, match-day information and the latest Grand Final developments through the weekend.
        </p>
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
