'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

const editorialImage =
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025_G20_Johannesburg_summit_Family_Photo.jpg'

export function HomeEditorialFeature() {
  const pathname = usePathname()

  if (pathname !== '/') return null

  return (
    <section className="mx-auto mt-4 max-w-7xl px-3 sm:mt-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <Link href="/when-nations-walk-away" className="relative block overflow-hidden bg-slate-950">
          <img
            src={editorialImage}
            alt="World leaders at the G20 Leaders' Summit in Johannesburg"
            className="h-[210px] w-full object-cover object-center sm:h-[300px] lg:h-[360px]"
          />
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
            Editorial photo · G20 Leaders' Summit
          </span>
        </Link>
        <div className="border-b-4 border-red-700 px-4 py-4 sm:px-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">From the Editor</p>
          <h2 className="mt-2 font-serif text-xl font-black leading-tight text-slate-950 sm:text-3xl">
            When Nations Walk Away: Is the Global System Starting to Fracture?
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-6">
            The United States has moved to withdraw from the World Health Organization while governments are again questioning the value, cost and influence of international institutions. What happens when powerful nations decide the global system no longer serves their interests — and could others follow?
          </p>
          <Link
            href="/when-nations-walk-away"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-800 sm:mt-4 sm:px-5 sm:py-3"
          >
            Read the editorial
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
