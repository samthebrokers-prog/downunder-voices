import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cartoon of the Day',
  description:
    'Original daily Australian news satire from Downunder Voices.',
  openGraph: {
    title: 'Downunder Voices — Cartoon of the Day',
    description:
      'Sydney Marathon medal takes a wrong turn to Munich.',
    images: [
      '/editorial-cartoons/2026-08-23-sydney-marathon.png',
    ],
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
          23 August 2026 · Original Downunder Voices cartoon
        </p>
      </header>

      <article className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <img
          src="/editorial-cartoons/2026-08-23-sydney-marathon.png"
          alt="Editorial cartoon showing a Sydney Marathon runner surprised that the participation medal depicts Munich's Allianz Arena"
          className="h-auto w-full"
        />

        <div className="space-y-4 p-6 sm:p-8">
          <h2 className="font-serif text-3xl font-black text-slate-950">
            Sydney Marathon medal takes a wrong turn to Munich
          </h2>

          <p className="leading-7 text-slate-700">
            Sydney Marathon organisers acknowledged an embarrassing medal-design error: Munich&apos;s Allianz Arena appeared where runners expected a symbol of Sydney. Our runner may have crossed the finish line, but the medal apparently kept going.
          </p>

          <p className="rounded-md border-l-4 border-red-700 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            This is satire based on a reported public event. The characters and dialogue are fictional. Artwork is original to Downunder Voices.
          </p>

          <a
            href="https://www.theguardian.com/australia-news/live/2026/aug/23/australia-news-live-anthony-albanese-sydney-swans-police-investigation-alan-jones-antisemitism-inquiry-icac-nsw-liberals-ntwnfb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-bold text-red-700 hover:underline"
          >
            Read the reported event ↗
          </a>
        </div>
      </article>
    </main>
  )
}
