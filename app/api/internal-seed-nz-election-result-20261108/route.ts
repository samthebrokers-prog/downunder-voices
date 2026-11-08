import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: 8 November 2026 news report on the NZ election preliminary result.
// Straight news, neutral headline (owner request). Safe to call twice.
const story = {
  slug: 'nz-election-2026-too-close-to-call-national-labour-level',
  title: 'NZ election too close to call as National and Labour finish level on 29%',
  category: 'new-zealand',
  image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
  source_name: 'Downunder Voices — sources: Electoral Commission, CNN, Al Jazeera, France 24',
  source_url: 'https://www.cnn.com/2026/11/07/world/new-zealand-election-result-uncertain-intl-hnk',
  summary:
    "New Zealand's general election has ended without a clear winner. Preliminary results put National and Labour level on about 29% of the party vote, with the governing National, ACT and NZ First coalition holding a one-seat majority on the night. Final results are due on 27 November.",
  community_angle: `New Zealand will have to wait almost three weeks to find out who will form the next government, after Saturday's general election produced one of the closest results in years.

Preliminary results from the Electoral Commission show National and Labour level on about 29% of the party vote, separated by only a few thousand votes. The Greens are on about 13%, ACT about 11%, NZ First about 10% and the Opportunity Party about 6%. Te Pāti Māori is on under 1%.

On those numbers, the governing coalition of National, ACT and NZ First would hold 67 of a projected 131 seats, one more than the 66 needed to govern. About 14% of votes, mostly special votes, are still to be counted. Special votes have in past elections moved one or two seats between parties.

National's share of the vote has fallen from 38.1% at the 2023 election. Labour has risen from about 27%.

What the leaders said

Prime Minister Christopher Luxon told supporters in Auckland that National was again the largest party and had a pathway to form the next government, but said the result was too close to call. He said he would lead a caretaker government until the official results are declared.

Labour leader Chris Hipkins did not concede. Speaking in Upper Hutt, he told supporters that every vote matters.

Before the election, Mr Luxon repeatedly ruled out working with the Opportunity Party. If the final count changes the seat numbers, Opportunity's position could become important to both sides.

What happens next

The Electoral Commission will finish counting special votes and declare the official result on 27 November 2026. Coalition negotiations are expected to begin in earnest after that.

The campaign was dominated by the cost of living and a soft economy.

Downunder Voices will report the final result when it is declared.

Sources: New Zealand Electoral Commission preliminary results; CNN, Al Jazeera and France 24 election coverage, 7–8 November 2026.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
}

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', { query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1` })
    if (existing[0]) return NextResponse.json({ ok: true, existing: true, id: existing[0].id, slug: story.slug })
    const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      method: 'POST',
      body: { ...story, author: 'Downunder Voices Election Desk', status: 'published', published_at: new Date().toISOString(), import_method: 'manual-editorial' },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Election result seed failed' }, { status: 500 })
  }
}
