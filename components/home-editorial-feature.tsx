'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HomeEditorialFeature() {
  const pathname = usePathname()
  if (pathname !== '/') return null

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
