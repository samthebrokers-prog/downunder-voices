import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock3, Headphones, Mic2, Radio, ShieldCheck } from 'lucide-react'
import RadioLatestBulletin from '@/components/radio-latest-bulletin'

export const metadata: Metadata = {
  title: 'Downunder Voices Radio — Live Australia & New Zealand News',
  description: 'Listen to Downunder Voices Radio for rolling Australia, New Zealand and world news, sport, mysteries, technology, entertainment and original talk programmes.',
}

export default function RadioPage() {
  const programmes = [
    ['Unsolved', 'Unsolved mysteries and carefully sourced cold cases.'],
    ['Crime Files', 'Historic crimes and the cases that changed communities or the law.'],
    ['Missing', 'Responsible coverage of established missing-person cases.'],
    ['History in 15', 'One important person, place or event in fifteen minutes.'],
    ['Strange Australia', 'Remarkable Australian events, places and true stories.'],
    ['Mysteries of New Zealand', 'New Zealand mysteries, legends and unexplained events.'],
    ['Disaster & Survival', 'Disasters, rescues and accounts of human survival.'],
    ['Science & Space', 'Discovery, exploration and the ideas changing our world.'],
    ['Tech & Tomorrow', 'Technology, AI, cybersecurity and innovations changing everyday life.'],
    ['Entertainment Now', 'Entertainment, culture and the lighter stories people are talking about.'],
    ['Sport Downunder', 'AFL, NRL, rugby, cricket, football and major sporting stories from Australia and New Zealand.'],
  ]

  const hour = [
    [':00', 'Australia, New Zealand & world news'],
    [':05', 'Unsolved / Crime Files / Missing'],
    [':20', 'History in 15 / Strange Australia / Mysteries of New Zealand'],
    [':35', 'Australia or New Zealand feature / Sport Downunder'],
    [':50', 'Science, tech, survival, entertainment or public-interest talk'],
  ]

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm font-bold text-red-200"><Radio className="size-4" /> DOWNUNDER VOICES RADIO · LIVE</div>
          <h1 className="max-w-4xl font-serif text-4xl font-black tracking-tight sm:text-6xl">News first. Stories all day.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">A 24/7 digital station for Australia and New Zealand — fresh news, sport, mysteries, history, crime, technology, entertainment, science, survival and public-interest talk.</p>
          <a href="#listen-live" className="mt-8 inline-flex items-center gap-3 rounded-md bg-red-700 px-5 py-3 font-black uppercase tracking-wide text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white"><span className="size-2.5 animate-pulse rounded-full bg-white" /> Listen live</a>
        </div>
      </section>

      <section id="listen-live" className="mx-auto max-w-5xl scroll-mt-44 px-4 pt-8 sm:px-6 lg:px-8"><RadioLatestBulletin /></section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 pt-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-xl bg-slate-950 p-7 text-white">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-red-300"><Clock3 className="size-4" /> The hourly clock</div>
          <div className="mt-6 space-y-4">{hour.map(([time, title]) => <div key={time} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-slate-800 pb-4 last:border-0 last:pb-0"><span className="font-mono font-black text-red-300">{time}</span><span className="font-semibold text-slate-200">{title}</span></div>)}</div>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">Programme library</p>
          <h2 className="mt-2 font-serif text-3xl font-black text-slate-950">News-led programmes, all day</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">{programmes.map(([title, description]) => <article key={title} className="rounded-lg border bg-white p-5 shadow-sm"><h3 className="font-serif text-xl font-black text-slate-950">{title}</h3><p className="mt-2 leading-6 text-slate-600">{description}</p></article>)}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="rounded-lg border bg-white p-6 shadow-sm"><Mic2 className="size-7 text-red-700" /><h2 className="mt-4 text-xl font-black">Hourly newsroom</h2><p className="mt-2 leading-7 text-slate-600">Fresh bulletins are prepared from current Downunder Voices reporting, with Australia and New Zealand at the centre.</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><Headphones className="size-7 text-red-700" /><h2 className="mt-4 text-xl font-black">Easy to join anytime</h2><p className="mt-2 leading-7 text-slate-600">Short programmes and regular headlines mean listeners can tune in at any point in the day.</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><ShieldCheck className="size-7 text-red-700" /><h2 className="mt-4 text-xl font-black">Copyright-safe launch</h2><p className="mt-2 leading-7 text-slate-600">Launch programming uses original spoken content. Music will be added only from properly cleared or licensed sources.</p></div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8"><div className="rounded-xl border bg-white p-7 sm:p-9"><p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">Downunder Voices Radio</p><h2 className="mt-3 font-serif text-3xl font-black">Australia · New Zealand · World</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">Press Play for the current bulletin, switch on continuous radio, or read the full stories and original sources on Downunder Voices.</p><Link href="/latest" className="mt-6 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700">Read the latest news</Link></div></section>
    </div>
  )
}
