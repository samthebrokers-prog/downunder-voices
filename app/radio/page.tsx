import type { Metadata } from 'next'
import Link from 'next/link'
import { Headphones, Mic2, Radio, ShieldCheck } from 'lucide-react'
import RadioLatestBulletin from '@/components/radio-latest-bulletin'

export const metadata: Metadata = {
  title: 'Live Radio — Hourly Australia, New Zealand & World News',
  description:
    'Listen to Downunder Voices Radio for an hourly news bulletin covering Australia, New Zealand and major world stories.',
}

export default function RadioPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm font-bold text-red-200">
            <Radio className="size-4" />
            DOWNUNDER VOICES RADIO
          </div>

          <h1 className="max-w-4xl font-serif text-4xl font-black tracking-tight sm:text-6xl">
            Live news, updated every hour.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Listen to the latest headlines from Australia, New Zealand and around the world. Each bulletin is prepared from the newest Downunder Voices stories.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-md bg-red-700 px-5 py-3 font-black uppercase tracking-wide text-white">
            <span className="size-2.5 animate-pulse rounded-full bg-white" />
            News-only radio is live
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        <RadioLatestBulletin />
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Mic2 className="size-7 text-red-700" />
          <h2 className="mt-4 text-xl font-black">Fresh every hour</h2>
          <p className="mt-2 leading-7 text-slate-600">The bulletin follows the hourly Downunder Voices news update.</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Headphones className="size-7 text-red-700" />
          <h2 className="mt-4 text-xl font-black">News that matters</h2>
          <p className="mt-2 leading-7 text-slate-600">Australia and New Zealand come first, followed by major world stories.</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <ShieldCheck className="size-7 text-red-700" />
          <h2 className="mt-4 text-xl font-black">News only for now</h2>
          <p className="mt-2 leading-7 text-slate-600">Music will only be added after the required licensing approval is received.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-white p-7 sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">Downunder Voices Radio</p>
          <h2 className="mt-3 font-serif text-3xl font-black">Australia · New Zealand · World</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Press Play for the current bulletin, or read the full stories and original sources on Downunder Voices.
          </p>
          <Link href="/latest" className="mt-6 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700">
            Read the latest news
          </Link>
        </div>
      </section>
    </div>
  )
}
