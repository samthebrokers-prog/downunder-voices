import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The All Blacks Belong to New Zealand — Not Behind a Paywall | Downunder Voices',
  description: 'After defeats to Wales and England, New Zealand Rugby must protect live free-to-air access to the national team.',
  alternates: { canonical: 'https://www.downundervoices.com/all-blacks-paywall' },
}

export default function AllBlacksEditorial() {
  const paragraphs = [
    'Wales 35–28 New Zealand. England 37–12 New Zealand. Two painful defeats have put the All Blacks under scrutiny. But beyond team selection and coaching, New Zealand rugby faces another question: are ordinary supporters being priced out of watching their own national team?',
    'For generations the All Blacks were part of the national identity. From small towns to city suburbs, families gathered to watch the silver fern. Yet watching a live Test in New Zealand now often means paying for a sports subscription.',
    'We are not demanding that every rugby match be free.',
    'Sky is a commercial broadcaster, and nobody is arguing that every Super Rugby fixture, provincial competition or overseas club game should be shown free of charge. Broadcasting rights generate money that helps fund professional rugby and its wider development.',
    'But when the All Blacks represent New Zealand, the public interest is different. A pensioner who followed the team for 50 years, a family juggling household bills, and a child discovering the game should all have a realistic opportunity to watch their national team live.',
    'Australia offers a useful comparison. Wallabies Tests receive significant free-to-air coverage, although not every international rugby fixture is free. The principle matters: a national team is not simply another subscription entertainment product.',
    'The All Blacks wear the silver fern for the country, not for a television company. New Zealand Rugby should negotiate future rights with public access in mind, including live free-to-air or free streaming coverage of All Blacks Tests in New Zealand. Sky could still offer premium commentary, additional coverage, replays and other subscription benefits.',
    'It would be wrong to claim that a paywall caused the defeats against Wales and England, or to assert without evidence that subscriptions alone have reduced rugby interest. But restricting live access risks weakening the bond between the national team and its next generation of supporters. That risk deserves serious attention.',
    'Wales ended a 73-year wait with its 35–28 victory on 14 November. England followed with a 37–12 win on 21 November. Those results demand reflection on the field. The future of the sport also demands reflection off it.',
    'New Zealand Rugby should be asking a simple question: what is the long-term value of a national team if too many people cannot afford to watch it?',
    'The answer is not to abolish paid sport. It is to draw a clear line around the national team.',
    'We do not need every match for free. But when the All Blacks represent New Zealand, New Zealanders deserve to watch.',
    'The silver fern belongs to the nation. It should not be hidden behind a paywall.',
  ]
  return <main className="mx-auto max-w-4xl px-5 py-12">
    <Link href="/" className="text-sm font-semibold underline">Downunder Voices</Link>
    <p className="mt-8 text-sm font-bold uppercase tracking-widest text-red-700">Editorial / Opinion · 22 November 2026</p>
    <h1 className="mt-4 font-serif text-4xl font-black leading-tight sm:text-5xl">The All Blacks Belong to New Zealand — Not Behind a Paywall</h1>
    <p className="mt-5 text-xl leading-relaxed">We are not asking for every rugby match to be free. We are asking for the national team to be accessible to the nation it represents.</p>
    <div className="my-8 overflow-hidden rounded-xl bg-zinc-900 p-8 text-center text-white">
      <p className="text-xs font-bold tracking-widest text-amber-300">DOWNUNDER VOICES EDITORIAL</p>
      <p className="mt-4 font-serif text-3xl font-black">THE SILVER FERN BELONGS TO THE PEOPLE</p>
      <p className="mt-3 text-lg">National pride should not be locked behind a paywall.</p>
    </div>
    <div className="space-y-6 text-lg leading-8">{paragraphs.map((p,i)=><p key={i} className={i===2||i===11||i===12?'font-bold':''}>{p}</p>)}</div>
    <p className="mt-10 text-sm text-muted-foreground">Downunder Voices editorial opinion. Match results: All Blacks official fixtures and Six Nations Rugby reports.</p>
  </main>
}
