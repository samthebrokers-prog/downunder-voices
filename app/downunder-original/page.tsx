import Link from 'next/link'

export const metadata = {
  title: 'Downunder Original | Downunder Voices',
  description: 'Original stories, analysis and everyday issues from Australia and New Zealand.',
}

export default function DownunderOriginalPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">Downunder Voices</p>
        <h1 className="mt-2 font-serif text-4xl font-black text-slate-950">Downunder Original</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Original stories, analysis and everyday issues from Australia and New Zealand.
        </p>
      </header>

      <section className="py-8">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
            <div className="flex min-h-32 items-center justify-center rounded-lg bg-slate-100 px-5 text-center">
              <div>
                <div className="text-4xl font-black tracking-tight text-slate-900">WORDLE</div>
                <div className="mt-2 text-sm font-bold text-red-700">AU + NZ DAILY PUZZLES</div>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-700">Digital Culture</p>
              <h2 className="mt-2 font-serif text-2xl font-black leading-tight text-slate-950">
                Wordle, Quordle and the Daily Routine: Why Australia and New Zealand Are Hooked on Word Puzzles
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                From the morning coffee to the commute, daily word puzzles have become a small but remarkably persistent digital ritual. We look at why the habit has lasted and what it says about everyday online life in Australia and New Zealand.
              </p>
              <Link href="/downunder-original/wordle-puzzles-trends-au-nz" className="mt-4 inline-flex font-bold text-red-700 hover:text-red-800">
                Read the original analysis →
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
