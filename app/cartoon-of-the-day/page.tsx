import type { Metadata } from 'next'
import {
  archivedCartoons,
  currentCartoon,
} from '@/lib/editorial-cartoons'

export const metadata: Metadata = {
  title: 'Cartoon of the Day',
  description:
    'Original daily Australian news satire from Downunder Voices.',
  openGraph: {
    title: 'Downunder Voices — Cartoon of the Day',
    description: currentCartoon.headline,
    images: [currentCartoon.image],
  },
}

export default function CartoonOfTheDayPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b-4 border-red-700 pb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
          Independent Australian satire
        </p>
        <h1 className="mt-2 font-serif text-4xl font-black text-slate-950 sm:text-5xl">
          Cartoon of the Day
        </h1>
        <p className="mt-3 text-sm font-bold text-muted-foreground">
          {currentCartoon.date} · Original Downunder Voices cartoon
        </p>
      </header>

      <article className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <img
          src={currentCartoon.image}
          alt={currentCartoon.alt}
          className="h-auto w-full"
        />

        <div className="space-y-4 p-6 sm:p-8">
          <h2 className="font-serif text-3xl font-black text-slate-950">
            {currentCartoon.headline}
          </h2>

          <p className="leading-7 text-slate-700">
            {currentCartoon.summary}
          </p>

          <p className="rounded-md border-l-4 border-red-700 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            This is satire based on a reported public event. The characters and dialogue are fictional. Artwork is original to Downunder Voices.
          </p>

          <a
            href={currentCartoon.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-bold text-red-700 hover:underline"
          >
            Source: {currentCartoon.sourceLabel} ↗
          </a>
        </div>
      </article>

      {archivedCartoons.length > 0 && (
        <section className="mt-12 border-t-4 border-slate-950 pt-6">
          <h2 className="font-serif text-3xl font-black text-slate-950">
            Cartoon Archive
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Previous original Downunder Voices cartoons.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {archivedCartoons.map((cartoon) => (
              <article
                key={cartoon.image}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <img
                  src={cartoon.image}
                  alt={cartoon.alt}
                  className="h-auto w-full"
                />
                <div className="space-y-2 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-red-700">
                    {cartoon.date}
                  </p>
                  <h3 className="font-serif text-xl font-black text-slate-950">
                    {cartoon.headline}
                  </h3>
                  <a
                    href={cartoon.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-sm font-bold text-red-700 hover:underline"
                  >
                    Source ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
