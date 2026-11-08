import type { Metadata } from 'next'
import Link from 'next/link'

import { ElectionCountdown } from '@/components/election-countdown'
import { closeSeats, electionInfo, parties, updates } from '@/lib/nz-election-2026'

export const revalidate = 300

const pageUrl = 'https://www.downundervoices.com/nz-election-live'
const description =
  'Live: NZ Election 2026 is too close to call. Seats, party vote, the tightest electorates and why special votes from Kiwis overseas could decide it. Official result 27 November.'

export const metadata: Metadata = {
  title: 'LIVE: NZ Election 2026 Results — Too Close to Call',
  description,
  alternates: { canonical: '/nz-election-live' },
  openGraph: {
    title: 'LIVE: NZ Election 2026 — too close to call',
    description,
    url: pageUrl,
    type: 'article',
    images: [{ url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1200', alt: 'The Beehive and Parliament House, Wellington' }],
  },
  twitter: { card: 'summary_large_image', title: 'LIVE: NZ Election 2026 — too close to call', description },
}

const share = encodeURIComponent(pageUrl)
const shareText = encodeURIComponent('NZ Election 2026 is too close to call — live seats and countdown:')
const shareLinks = [
  { label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${share}` },
  { label: 'WhatsApp', href: `https://wa.me/?text=${shareText}%20${share}` },
  { label: 'X', href: `https://twitter.com/intent/tweet?url=${share}&text=${shareText}` },
]

export default function NzElectionLivePage() {
  const seats = (p: (typeof parties)[number]) => p.electorate + p.list
  const blocSeats = (b: 'right' | 'left' | 'other') => parties.filter((p) => p.bloc === b).reduce((n, p) => n + seats(p), 0)
  const right = blocSeats('right')
  const left = blocSeats('left')
  const other = blocSeats('other')
  const ordered = [...parties.filter((p) => p.bloc === 'right'), ...parties.filter((p) => p.bloc === 'other'), ...parties.filter((p) => p.bloc === 'left').reverse()]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LiveBlogPosting',
    headline: 'NZ Election 2026 live: too close to call',
    description,
    url: pageUrl,
    coverageStartTime: '2026-11-07T19:00:00+13:00',
    coverageEndTime: electionInfo.officialResultIso,
    publisher: { '@type': 'Organization', name: 'Downunder Voices' },
    liveBlogUpdate: updates.map((u) => ({ '@type': 'BlogPosting', headline: u.headline, articleBody: u.body })),
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-700 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white">
          <span className="size-2 animate-pulse rounded-full bg-white" /> Live
        </span>
        <span className="text-sm font-semibold text-slate-500">Last updated {electionInfo.lastUpdated}</span>
      </div>

      <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
        NZ Election 2026: too close to call
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Labour and National finished almost level on the party vote. The governing coalition has a one-seat majority on election-night figures, but around {electionInfo.specialVotesExpected} special votes, including votes from Kiwis in Australia and around the world, are still being counted.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {shareLinks.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:border-neutral-900">
            {s.label}
          </a>
        ))}
      </div>

      {/* Seat bar */}
      <section className="mt-8 rounded-xl border border-slate-200 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Seats on preliminary count</p>
            <p className="mt-1 text-sm text-slate-600">{electionInfo.totalSeats} seats ({electionInfo.overhang} overhang) · {electionInfo.majority} needed to govern</p>
          </div>
        </div>
        <div className="relative mt-4 flex h-10 w-full overflow-hidden rounded-md">
          {ordered.map((p) => (
            <div key={p.short} title={`${p.name}: ${seats(p)}`} style={{ width: `${(seats(p) / electionInfo.totalSeats) * 100}%`, background: p.color }} className="flex items-center justify-center text-[11px] font-black text-white">
              {seats(p) >= 7 ? seats(p) : ''}
            </div>
          ))}
          <div className="absolute inset-y-0 border-l-2 border-dashed border-white" style={{ left: `${(electionInfo.majority / electionInfo.totalSeats) * 100}%` }} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">National · ACT · NZ First</p>
            <p className="font-serif text-3xl font-black">{right}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Opportunity</p>
            <p className="font-serif text-3xl font-black">{other}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Labour · Greens · Te Pāti Māori</p>
            <p className="font-serif text-3xl font-black">{left}</p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Party table */}
          <section>
            <h2 className="font-serif text-2xl font-black text-slate-950">Party results</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-slate-900 text-xs uppercase text-slate-500">
                  <tr><th className="py-2">Party</th><th>Party vote</th><th className="text-right">Electorate</th><th className="text-right">List</th><th className="text-right">Total</th></tr>
                </thead>
                <tbody>
                  {[...parties].sort((a, b) => seats(b) - seats(a)).map((p) => (
                    <tr key={p.short} className="border-b border-slate-200">
                      <td className="py-2.5 font-bold"><span className="mr-2 inline-block size-3 rounded-sm align-middle" style={{ background: p.color }} />{p.name}</td>
                      <td>{p.votePct}</td>
                      <td className="text-right tabular-nums">{p.electorate}</td>
                      <td className="text-right tabular-nums">{p.list}</td>
                      <td className="text-right font-black tabular-nums">{seats(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">Preliminary count, excluding special votes. ≈ = rounded figure. Source: <a href={electionInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">NZ Electoral Commission</a>.</p>
          </section>

          {/* Live updates */}
          <section className="mt-10">
            <h2 className="font-serif text-2xl font-black text-slate-950">Live updates</h2>
            <ol className="mt-4 border-l-2 border-slate-200">
              {updates.map((u, i) => (
                <li key={i} className="relative pb-6 pl-6">
                  <span className={`absolute -left-[7px] top-1.5 size-3 rounded-full ${i === 0 ? 'bg-red-700' : 'bg-slate-400'}`} />
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">{u.time}</p>
                  <h3 className="mt-1 text-lg font-black text-slate-950">{u.headline}</h3>
                  <p className="mt-1 leading-7 text-slate-700">{u.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <ElectionCountdown targetIso={electionInfo.officialResultIso} label={`The Electoral Commission aims to declare the official result on ${electionInfo.officialResultLabel}.`} />

          <section className="rounded-xl border border-slate-200 p-5">
            <h2 className="font-serif text-xl font-black">Seats on a knife-edge</h2>
            <p className="mt-1 text-xs text-slate-500">Electorate leads on the night. Special votes could flip these.</p>
            <ul className="mt-3 divide-y divide-slate-200">
              {closeSeats.map((s) => (
                <li key={s.seat} className="py-2.5 text-sm">
                  <div className="flex justify-between gap-2"><span className="font-black">{s.seat}</span><span className="font-bold tabular-nums text-red-700">{s.margin.toLocaleString('en-NZ')} votes</span></div>
                  <div className="text-slate-600">{s.leader} leads {s.chaser}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-amber-50 p-5">
            <h2 className="font-serif text-xl font-black">Voted from overseas?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Votes from New Zealanders in Australia and elsewhere are <strong>special votes</strong>. They were not part of the election-night count. In past elections special votes have moved one or two seats, so the overseas Kiwi vote really can make the difference this time.
            </p>
          </section>
        </aside>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500">
        Downunder Voices reports these results neutrally and will update this page as news comes in. Figures are preliminary until the Electoral Commission declares the official result.
        <div className="mt-3 flex flex-wrap gap-4">
          <Link href="/story/nz-election-2026-too-close-to-call-national-labour-level" className="font-bold text-neutral-900 hover:underline">Read our full report →</Link>
          <Link href="/category/new-zealand" className="font-bold text-neutral-900 hover:underline">More New Zealand news →</Link>
        </div>
      </div>
    </div>
  )
}
