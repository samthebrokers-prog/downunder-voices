import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

const story = {
  slug: 'nz-election-2026-three-weeks-out-race-wide-open',
  title: 'NZ Election 2026: Three Weeks Out, the Race Is Still Wide Open',
  category: 'new-zealand',
  summary: 'New Zealand is heading into the final three weeks of the 2026 election campaign with no clear winner. The latest 1News Verian poll has National and Labour level on 28%, while Christopher Luxon and Chris Hipkins are also tied on 20% as preferred prime minister. The numbers point to a campaign in which smaller parties, coalition arithmetic and undecided voters may matter as much as the contest between the two major parties.',
  source_name: 'Downunder Voices — sources: Electoral Commission and 1News Verian',
  source_url: 'https://www.1news.co.nz/2026/10/13/poll-hipkins-and-luxon-now-neck-and-neck-opportunity-on-track-for-10-mps/',
  community_angle: `With election day on 7 November, New Zealand voters are looking at an unusually open contest. The 1News Verian poll published on 13 October put National and Labour together on 28%. ACT and New Zealand First were both on 10%, the Greens on 15% and Opportunity on 8%. On those numbers, neither the traditional left nor right bloc can comfortably form a government without looking beyond its usual partners.\n\nThat makes the coalition question central. Opportunity has said it would speak first with the party winning the most votes or seats, while Christopher Luxon has ruled out working with Opportunity. Polls are snapshots rather than forecasts, but a 12% undecided figure in the same Verian survey leaves substantial room for movement before voting closes.\n\nThe timetable now matters just as much as the polling. Overseas voting begins on 21 October. The Electoral Commission says 25 October is the final day to enrol or update enrolment details for this election, advance voting begins on 26 October, and election day is Saturday 7 November. Unlike previous elections, voters cannot wait until they arrive at a voting place to enrol.\n\nFor Downunder Voices, the important question over the next three weeks is not simply who is ahead on any particular night. We will follow what the parties are promising on household costs, housing, health, crime, migration and the economy; test campaign claims against primary sources; and show readers what the coalition numbers actually mean.\n\nSources: New Zealand Electoral Commission — 2026 General Election timetable and voting information; 1News/Verian poll published 13 October 2026.`,
}

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', { query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1` })
    if (existing[0]) return NextResponse.json({ ok: true, existing: true, id: existing[0].id, slug: story.slug })
    const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      method: 'POST',
      body: { ...story, image_url: null, author: 'Downunder Voices Election Desk', status: 'published', published_at: new Date().toISOString(), import_method: 'manual-editorial' },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Election seed failed' }, { status: 500 })
  }
}
