import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: 5 November 2026 opinion piece on the US midterm result and the
// lesson for One Nation. Safe to call twice.
const story = {
  slug: 'america-says-enough-trump-midterm-defeat-warning-for-one-nation',
  title: 'America says "enough": Trump\'s midterm defeat is a warning One Nation should not ignore',
  category: 'world',
  image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/US_Capitol_west_side_(cropped).JPG?width=1280',
  source_name: 'Downunder Voices Editorial',
  source_url: 'https://www.cnn.com/2026/11/04/politics/live-news/midterm-election-congress',
  community_angle:
    'American voters have handed both houses of Congress to the Democrats. The message for Australia: there is no lasting room for hate and division, and voters want real answers, not neighbours set against each other.',
  summary: `American voters have delivered a clear message to Donald Trump. In this week's midterm elections, the Democrats took control of both the House of Representatives and the Senate. CNN called it a resounding and historic victory, driven by the President's deep unpopularity. In the House alone, Democrats flipped at least 27 seats.

Trump was not on the ballot, but his politics were. He told Fox News he does not see his party's losses as a blow against him. Voters in his own heartland suggest otherwise. NBC reports Democrats won or led in districts Trump carried by 24 points, and took back Iowa counties that had turned red during his campaigns.

A lesson for Australia

Australians should pay close attention, and so should Pauline Hanson.

One Nation's ties to Trump's movement are no secret. Hanson's own chief of staff has called her "the original Trump". She spoke at a conservative conference at Mar-a-Lago, where she praised the President and described Australia as an economic and social tinderbox. One Nation is now polling strongly here, riding the same wave of anger that carried Trump to power.

America's result shows where that path can end. Politics built on blaming migrants, dividing communities and promising simple answers to hard problems can win attention, and sometimes elections. But when people's daily lives do not improve, and when neighbours are turned against neighbours, voters eventually push back.

Australia is a nation of many voices

Australia's strength has never come from fear. It comes from the people who built it: Indigenous Australians, the families who arrived after the war, migrants from Asia, Africa, the Pacific and everywhere else, who work, pay taxes, raise children and serve their communities.

Hate and discrimination have no place in that story. They divide workplaces, schools and streets, and they leave nobody better off.

The other side

To be fair, One Nation's supporters say its rise reflects real frustration over migration levels, housing and the cost of living, not hatred, and Hanson has rejected claims that her party is racist. Midterm losses are also common for a sitting US president's party, so some analysts warn against reading this result as a total rejection of Trump-style politics.

The message

The American result is a reminder that voters are not as easily divided as some politicians believe. To One Nation, and to every party tempted by the politics of division: Australians want real answers on housing, cost of living, jobs and health. They do not want to be set against each other.

One nation, yes. But one nation for everyone.

This is an opinion piece. Downunder Voices welcomes responses from readers of all views.

Sources: CNN and NBC News (4 November 2026 midterm coverage); Reuters via The Star; SBS News; The Nightly.

Photo: United States Capitol, west side, by Martin Falbisoner via Wikimedia Commons (CC BY-SA 3.0).`,
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
        published_at: '2026-11-04T11:55:00.000Z',
        import_method: 'automated-editorial',
      },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Seed failed' }, { status: 500 })
  }
}
