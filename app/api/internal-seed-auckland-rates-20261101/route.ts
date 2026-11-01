import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: publishes the 1 November 2026 Editorial of the Day on Auckland
// Council rates. Safe to call twice (it checks for the slug first).
const story = {
  slug: 'auckland-rates-keep-climbing-ratepayers-running-out-of-patience',
  title: "Auckland's rates keep climbing — and ratepayers are running out of patience",
  category: 'social-issues',
  image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Aucklandtownhall.jpg/960px-Aucklandtownhall.jpg',
  source_name: 'Downunder Voices Editorial',
  source_url: 'https://ourauckland.aucklandcouncil.govt.nz/news/2026/03/annual-plan/',
  community_angle:
    'Auckland households are paying about $320 more in rates this year after the council’s biggest rise yet. With the Government now moving to cap rates nationally, Auckland Council should show ratepayers where every dollar goes.',
  summary: `Every winter, Aucklanders open their rates bill and find the same message: pay more. This year the average household is paying about $320 more, and businesses are being hit even harder. It was the council's biggest rates rise yet, and it landed in the middle of a cost-of-living squeeze.

Mayor Wayne Brown says the increase is responsible and mostly driven by the cost of running the new City Rail Link. That is partly fair. The CRL is a real cost that has to be paid. But ratepayers are entitled to ask a simple question: if the bills keep rising faster than wages, where is the discipline?

Councillors had a chance to soften the blow. A proposal to cut the rise from 7.9 per cent to 5.9 per cent, by finding deeper savings, was put on the table. It was voted down. The council says it has already set a $106 million savings target and that Auckland is doing better than many councils facing double-digit increases. Being less bad than others is not the same as being good value.

The problem is not only Auckland's. Across New Zealand, councils have pushed rates up year after year, and the frustration has now reached Wellington. The Government has announced a 4 per cent cap on rates increases, to be phased in from 2027. When central government feels it has to step in and put a lid on local councils, something has gone wrong with how local spending is controlled.

A cap is a blunt tool. It does not cover water charges or fees, and councils warn it could mean cuts to services or delayed repairs. But it exists because ratepayers have lost confidence that councils will hold the line on their own.

Auckland Council should not wait for a law to force it. It should show every household, in plain language, where each dollar goes. It should publish what the savings target has actually delivered. And it should treat rates rises as a last resort, not an annual habit.

Aucklanders are not against paying for trains, pipes and roads. They are against paying more every year without seeing the council tighten its own belt first. Until that changes, the anger on the billboards will keep growing, and the council will have earned it.

Sources: Auckland Council Annual Plan 2026/2027; Newstalk ZB and RNZ reporting on the council's 7.9% rates decision (May 2026); Minister of Local Government announcement on rates capping (25 August 2026).

Photo: Auckland Town Hall, by ChewyPineapple via Wikimedia Commons (CC BY-SA 3.0 NZ).`,
}

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', { query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1` })
    if (existing[0]) return NextResponse.json({ ok: true, existing: true, id: existing[0].id, slug: story.slug })
    const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      method: 'POST',
      body: {
        ...story,
        author: 'From the Editor — Downunder Voices',
        status: 'published',
        // Start of 1 November (Sydney time) so it is today's Editorial of the Day banner.
        published_at: '2026-10-31T13:05:00.000Z',
        import_method: 'automated-editorial',
      },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Seed failed' }, { status: 500 })
  }
}
