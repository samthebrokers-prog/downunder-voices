import Link from 'next/link'

export const metadata = {
  title: 'LIVE: Secret Harbour By-election Results | Downunder Voices',
  description:
    'Follow the 2026 Secret Harbour by-election count with official WA Electoral Commission results and Downunder Voices coverage.',
}

const waecResultsUrl =
  'https://www.elections.wa.gov.au/elections/state/sgelection#/sg2026/Secret%20Harbour'

export default function SecretHarbourLivePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-700 px-4 py-2 text-sm font-black uppercase tracking-wide text-white">
        <span className="size-2 animate-pulse rounded-full bg-white" />
        Live count
      </div>

      <h1 className="font-serif text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
        Secret Harbour By-election Results
      </h1>

      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Follow the latest official count from the Western Australian Electoral Commission. Election-night figures are indicative and may change as counting continues.
      </p>

      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-black text-slate-950">Official live results</h2>
        <p className="mt-2 text-slate-700">
          The WA Electoral Commission publishes the authoritative count. Its election results service is the source to use for the latest candidate totals and preferences.
        </p>
        <a
          href={waecResultsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-md bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800"
        >
          View WAEC live results →
        </a>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500">
        Downunder Voices will continue following the count and will replace this live page with results and analysis once the outcome is settled.
      </div>

      <Link href="/" className="mt-8 inline-block font-bold text-red-700 hover:underline">
        ← Back to Downunder Voices
      </Link>
    </main>
  )
}
