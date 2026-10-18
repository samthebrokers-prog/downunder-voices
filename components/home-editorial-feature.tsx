'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function HomeEditorialFeature() {
  const pathname = usePathname()

  if (pathname !== '/') return null

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <div className="border-b-4 border-red-700 px-5 py-4 sm:px-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">From the Editor</p>
          <h2 className="mt-2 font-serif text-2xl font-black text-slate-950 sm:text-3xl">
            The Telethon Question: When Billionaire Generosity Comes With a Tax Deduction
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
            Australians give generously to help sick children. But should a multimillion-dollar, tax-deductible corporate donation be treated exactly like the $20 given by an ordinary family? We look at the tax benefit, the publicity and the bigger question of fair taxation.
          </p>
          <Link
            href="/telethon-tax-deductions"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800"
          >
            Read the editorial
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
