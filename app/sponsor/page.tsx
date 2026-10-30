import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock3, Mic2, Newspaper, Radio } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sponsor Downunder Voices Radio',
  description: 'Support an independent Australia and New Zealand radio station by sponsoring a Downunder Voices Radio programme or the hourly news.',
}

const slots = [
  {
    icon: Mic2,
    title: 'Programme sponsorship',
    text: 'Your business is named at the start of every airing of one programme — for example “Travel Downunder is brought to you by…”. One sponsor per programme.',
  },
  {
    icon: Clock3,
    title: 'Hourly news sponsorship',
    text: 'A short sponsor line after the opening of Downunder Voices News, heard every hour, 24 hours a day.',
  },
  {
    icon: Newspaper,
    title: 'Radio and website together',
    text: 'Pair your on-air sponsorship with recognition on downundervoices.com alongside the programme you support.',
  },
]

const programmes = [
  'Mysteries Downunder',
  'Strange Australia',
  'Mysteries of New Zealand',
  'History Downunder',
  'Travel Downunder',
  'Sport Downunder',
  'Business and Cost of Living',
  'Science and Discovery',
  'Tech and Tomorrow',
  'Pacific Stories',
  'Remarkable Lives',
  'Political Hiccups',
]

export default function SponsorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="border-b-2 border-primary pb-8">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <Radio className="size-4" /> Sponsor Downunder Voices Radio
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Support independent radio for Australia and New Zealand.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          Downunder Voices Radio broadcasts 24 hours a day: news every hour, then original programmes on mysteries, history,
          travel, sport, science, our Pacific neighbours and the stories people talk about. Sponsorship keeps it independent and on air.
        </p>
      </section>

      <section className="grid gap-6 py-10 md:grid-cols-3">
        {slots.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-border p-6">
            <Icon className="size-6 text-primary" />
            <h2 className="mt-4 font-serif text-xl font-bold">{title}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-secondary/60 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">Programmes available for sponsorship</h2>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((p) => (
            <li key={p} className="rounded-md bg-background px-4 py-3 font-semibold">{p}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 py-10 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold">Tasteful, clearly identified</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Sponsor messages are short, clearly identified and never part of the news itself. Sponsors do not influence our
            editorial decisions, and we accept sponsors that suit a general audience in Australia and New Zealand.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">Founding sponsors</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Downunder Voices Radio is new and growing. Our first sponsors receive a founding-sponsor rate and are recognised as
            founding supporters of the station.
          </p>
        </div>
      </section>

      <section className="rounded-lg bg-slate-950 p-6 text-white sm:p-8">
        <h2 className="font-serif text-2xl font-bold">Talk to us</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-300">Tell us about your business and the programme you would like to support, and we’ll come back to you.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-600">
            Contact us <ArrowRight className="size-4" />
          </Link>
          <Link href="/radio" className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900">
            Listen live
          </Link>
        </div>
      </section>
    </main>
  )
}
