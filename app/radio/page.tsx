import type { Metadata } from 'next'
import Link from 'next/link'
import { Headphones, Mic2, Radio, ShieldCheck } from 'lucide-react'
import RadioLatestBulletin from '@/components/radio-latest-bulletin'

export const metadata: Metadata = {
  title: 'Radio — News from Australia, New Zealand & the World',
  description:
    'Downunder Voices Radio is being built as a news-first audio service covering Australia, New Zealand and the most important stories from around the world.',
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
            News you can read. Soon, news you can hear.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            We are building a news-first audio service covering Australia,
            New Zealand and the most important stories happening around the
            world right now. Our first broadcasts will focus on major news,
            business, community, sport and developing stories that matter.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-md bg-red-700 px-5 py-3 font-black uppercase tracking-wide text-white">
            <span className="size-2.5 rounded-full bg-white" />
            Hourly bulletins in development
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        <RadioLatestBulletin />
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Mic2 className="size-7 text-red-700" />
          <h2 className="mt-4 text-xl font-black">News first</h2>
          <p className="mt-2 leading-7 text-slate-600">
            Short, clear bulletins built from Downunder Voices reporting and
            verified sources.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Headphones className="size-7 text-red-700" />
          <h2 className="mt-4 text-xl font-black">What matters now</h2>
          <p className="mt-2 leading-7 text-slate-600">
            Australia and New Zealand come first, followed by the biggest world
            stories people need to know about now.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <ShieldCheck className="size-7 text-red-700" />
          <h2 className="mt-4 text-xl font-black">Music later</h2>
          <p className="mt-2 leading-7 text-slate-600">
            We are launching the news side first. Music programming will only
            be added after the appropriate licensing is in place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-white p-7 sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">
            Downunder Voices Radio
          </p>
          <h2 className="mt-3 font-serif text-3xl font-black">
            Australia · New Zealand · World
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            The radio service will sit alongside our independent news coverage,
            giving readers another way to stay informed. While we finish the
            broadcast system, keep following the latest stories on Downunder
            Voices.
          </p>
          <Link
            href="/latest"
            className="mt-6 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Read the latest news
          </Link>
        </div>
      </section>
    </div>
  )
}
