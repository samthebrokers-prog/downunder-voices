'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Editorial = { title: string; summary: string | null; slug: string; image_url: string | null; published_at: string; isToday: boolean }

// Homepage banner: today's editorial with its picture. A new editorial
// takes over each day (see /api/editorial/today).
export function HomeEditorialFeature() {
  const pathname = usePathname()
  const [ed, setEd] = useState<Editorial | null | undefined>(undefined)

  useEffect(() => {
    if (pathname !== '/') return
    fetch('/api/editorial/today')
      .then((r) => r.json())
      .then((d: { editorial: Editorial | null }) => setEd(d.editorial))
      .catch(() => setEd(null))
  }, [pathname])

  if (pathname !== '/') return null

  // While loading, or if nothing is available, keep the original feature.
  if (!ed) {
    return (
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/when-nations-walk-away" className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm">
          <div className="flex min-h-[180px] items-center justify-center px-6 py-10 text-center sm:min-h-[240px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">From the Editor</p>
              <h2 className="mt-3 font-serif text-3xl font-black leading-tight text-white sm:text-5xl">When Nations Walk Away</h2>
              <p className="mt-3 text-base font-semibold text-slate-300 sm:text-xl">Global Institutions Under Strain</p>
            </div>
          </div>
        </Link>
      </section>
    )
  }

  const date = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ed.published_at))
  const summary = (ed.summary || '').replace(/\s+/g, ' ').slice(0, 170)

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link href={`/story/${ed.slug}`} className="group grid overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm md:grid-cols-[2fr_3fr]">
        {ed.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ed.image_url} alt={ed.title} className="h-52 w-full object-cover object-top sm:h-64 md:h-full md:max-h-[340px]" />
        ) : (
          <div className="hidden bg-gradient-to-br from-red-900 to-slate-950 md:block" />
        )}
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 md:py-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
            From the Editor · {ed.isToday ? 'Editorial of the Day' : 'Latest editorial'} · {date}
          </p>
          <h2 className="mt-3 font-serif text-2xl font-black leading-snug text-white group-hover:underline sm:text-3xl">{ed.title}</h2>
          {summary && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{summary}{(ed.summary || '').length > 170 ? '…' : ''}</p>}
          <span className="mt-6 inline-block text-sm font-black uppercase tracking-wider text-red-400">Read the editorial →</span>
        </div>
      </Link>
    </section>
  )
}
