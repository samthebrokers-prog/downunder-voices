'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { globalInstitutionsEditorialImage } from '@/lib/global-institutions-editorial-image'

export function HomeEditorialFeature() {
  const pathname = usePathname()
  if (pathname !== '/') return null

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link href="/when-nations-walk-away" className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <img
          src={globalInstitutionsEditorialImage}
          alt="When Nations Walk Away — Global Institutions Under Strain"
          className="h-auto w-full"
        />
      </Link>
    </section>
  )
}
