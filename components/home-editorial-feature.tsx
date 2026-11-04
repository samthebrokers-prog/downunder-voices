'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Editorial = { title: string; summary: string | null; slug: string; image_url: string | null; published_at: string; isToday: boolean }

const SLIDE_MS = 8000

// Homepage banner: a slider of the latest editorials. The first slide is the
// Editorial of the Day (see /api/editorial/today).
export function HomeEditorialFeature() {
  const pathname = usePathname()
  const [eds, setEds] = useState<Editorial[] | null | undefined>(undefined)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (pathname !== '/') return
    fetch('/api/editorial/today')
      .then((r) => r.json())
      .then((d: { editorial: Editorial | null; editorials?: Editorial[] }) =>
        setEds(d.editorials?.length ? d.editorials : d.editorial ? [d.editorial] : null),
      )
      .catch(() => setEds(null))
  }, [pathname])

  const count = eds?.length ?? 0
  useEffect(() => {
    if (count < 2 || paused) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS)
    return () => clearInterval(timer)
  }, [count, paused])

  if (pathname !== '/') return null

  // While loading, or if nothing is available, keep the original feature.
  if (!eds || !eds.length) {
    return (
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/when-nations-walk-away" className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm">
          <div className="flex min-h-[180px] items-center justify-center px-6 py-10 text-center sm:min-h-[240px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">From the Editor</p>
              <h2 className="mt-3 font-serif text-3xl font-black leading-tight text-white sm:text-5xl">When Nations Walk Away</h2>
              <p className="mt-3 text-base font-semibold text-slate-300 sm:text-xl">Global Institutions Under Strain</p>
            </div>
          </div>
        </Link>
      </section>
    )
  }

  const go = (n: number) => setIndex((n + count) % count)

  return (
    <section
      className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Editorials"
    >
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm">
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {eds.map((ed, i) => {
            const date = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ed.published_at))
            const summary = (ed.summary || '').replace(/\s+/g, ' ').slice(0, 170)
            return (
              <Link
                key={ed.slug}
                href={`/story/${ed.slug}`}
                className="group grid w-full shrink-0 md:grid-cols-[2fr_3fr]"
                aria-hidden={i !== index}
                tabIndex={i === index ? 0 : -1}
              >
                {ed.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ed.image_url} alt={ed.title} className="h-52 w-full object-cover object-top sm:h-64 md:h-[340px]" loading={i === 0 ? 'eager' : 'lazy'} />
                ) : (
                  <div className="hidden bg-gradient-to-br from-neutral-950 to-slate-950 md:block" />
                )}
                <div className="flex flex-col justify-center px-6 pb-12 pt-8 sm:px-10 md:min-h-[340px] md:py-10">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                    From the Editor · {i === 0 && ed.isToday ? 'Editorial of the Day' : 'Editorial'} · {date}
                  </p>
                  <h2 className="mt-3 font-serif text-2xl font-black leading-snug text-white group-hover:underline sm:text-3xl">{ed.title}</h2>
                  {summary && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{summary}{(ed.summary || '').length > 170 ? '…' : ''}</p>}
                  <span className="mt-6 inline-block text-sm font-black uppercase tracking-wider text-neutral-400">Read the editorial →</span>
                </div>
              </Link>
            )
          })}
        </div>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous editorial" className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/70 md:flex">‹</button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next editorial" className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/70 md:flex">›</button>
            <div className="absolute bottom-4 right-6 flex gap-2">
              {eds.map((ed, i) => (
                <button
                  key={ed.slug}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show editorial ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all ${i === index ? 'w-6 bg-neutral-500' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
