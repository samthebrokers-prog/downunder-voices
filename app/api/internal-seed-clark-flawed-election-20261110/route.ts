import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: 10 November 2026 headline article on Helen Clark's call for an
// electoral review after the overhang election. Built only from verified
// reporting (AAP via 1News/ODT, Clark's own posts on X, The Spinoff,
// interest.co.nz, Otago University). Safe to call twice.
const story = {
  slug: 'helen-clark-system-gamed-full-review-overhang-election-2026',
  title: '"System gamed": Helen Clark demands full review after overhang election',
  category: 'new-zealand',
  image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
  source_name: 'Downunder Voices — sources: AAP via 1News and ODT, Helen Clark on X, The Spinoff, interest.co.nz, University of Otago',
  source_url: 'https://www.1news.co.nz/2026/11/08/election-possibly-flawed-helen-clark-says/',
  summary:
    'Former Prime Minister Helen Clark says New Zealand "could well be deemed by observers to have had a flawed election" and wants a full review of enrolment rules, campaign funding and the MMP overhang, after a vote-splitting campaign helped National win 42 seats on 29% of the party vote.',
  community_angle: `Former Prime Minister Helen Clark has called for a full review of New Zealand's electoral, campaign funding and enrolment laws, warning that Saturday's general election could be judged a flawed one.

"New Zealand could well be deemed by observers to have had a flawed election," Clark told AAP. She said the electoral system had been "gamed" and that New Zealanders deserved more transparency.

Clark, who led the country from 1999 to 2008, raised three main concerns.

1. The overhang

Preliminary results give National about 29.2% of the party vote, which would normally earn it around 35 seats. Instead it is on track for 42, all of them electorate seats, because it won far more electorates than its party vote entitles it to. Under MMP a party keeps every electorate it wins, so Parliament grows to fit them.

The result is a Parliament of 131 seats instead of 120, an overhang of 11. Labour actually finished slightly ahead of National on the party vote, at about 29.4%.

"This outcome is not what MMP was designed to deliver - which was a proportional result," Clark said.

The size of National's overhang was no accident. In the final weeks of the campaign, centre-right voters were openly urged to give their electorate vote to National and their party vote to ACT or NZ First, so the coalition would win extra seats on top of its fair share.

The most visible push was the "Split Your Vote" campaign of businessman Harry Mowbray, father of Zuru co-founder Nick Mowbray. Former National and ACT leader Don Brash also fronted advertisements urging voters to split, but would not say who paid for them. ACT confirmed it gave permission for a Reality Check Radio newspaper advertisement backing the tactic.

The Electoral Commission investigated whether advertising linked to Mr Mowbray's campaign had been properly authorised, and his website was taken offline days before the election.

Nick Mowbray has given $250,000 to National and $200,000 to ACT this year, according to The Spinoff. Integrity advocates have raised concerns about the Mowbray family money behind the vote-splitting push.

2. Who paid for it

On X, Clark said "anonymous funders backed a vote splitting campaign advantaging National" and that there was "a huge imbalance in party funding".

"There is no transparency around who funded it," she told AAP. "The electoral funding laws allow gross inequity in funding - money politics at work."

3. The enrolment deadline

The Luxon government brought forward the deadline to enrol or update enrolment details. Clark said the enrolment period ended 13 days before polling day and that "the early closure of enrolment disenfranchised many".

The government argued that because the election date was announced back in January, voters had plenty of time to get on the roll.

Turnout was estimated at 74.6%, down from 78.2% in 2023, and special votes are down about 30%, partly because of the law changes.

Why this matters

On preliminary results the National, ACT and NZ First bloc holds 67 of the 131 seats, just one more than the 66 needed to govern. The left bloc holds 64. In an election this close, the overhang and the enrolment cut-off could decide who governs.

Clark is not alone. Professor Andrew Geddis of the University of Otago law faculty wrote before polling day that deliberately trying to engineer an overhang is "a form of electoral cheating". Steve Maharey, a minister in Clark's government, has also called for a review of MMP.

The Electoral Commission recommended abolishing the overhang after its 2012 review of MMP. Successive governments never made the change.

The other side

National itself opposed the split-vote push. It lodged a complaint with the Electoral Commission, calling Mr Mowbray's campaign a "deliberate attempt" to confuse voters, and urged supporters to give National both ticks.

The tactic was also used on the left. Te Pāti Māori asked Māori-roll voters to give it their electorate vote and give their party vote to Labour or the Greens. It won five Māori electorates on under 1% of the party vote, adding one overhang seat for the left. Critics of Clark, including commentators writing in LawNews and business journalist Fran O'Sullivan, say any review must look at both strategies, and that splitting votes is a long-standing and legal choice for voters.

Professor Geddis's criticism of engineered overhangs applied to Te Pāti Māori's strategy as well as the right's.

What happens next

About 400,000 special votes are still being counted. The Electoral Commission will declare the official result on 27 November 2026, and coalition talks are expected to follow.

Clark said the issues "should now be the subject of a full review".

Downunder Voices will report the final result when it is declared.

A note on what is circulating online: a Facebook post shared widely this week says Green co-leader Chlöe Swarbrick "confirmed" the election was "rigged by big money". Downunder Voices could find no record of Ms Swarbrick saying this, and it is not in any of the reports above. Clark's own words were that the system was "gamed" and the result possibly "flawed", not rigged.

Sources: Helen Clark comments to AAP, reported by 1News and the Otago Daily Times (8 November 2026); Helen Clark on X; The Spinoff election coverage (September–November 2026); interest.co.nz preliminary results; Professor Andrew Geddis, University of Otago; LawNews.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
}

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', { query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1` })
    if (existing[0]) return NextResponse.json({ ok: true, existing: true, id: existing[0].id, slug: story.slug })
    const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      method: 'POST',
      body: { ...story, author: 'Downunder Voices Election Desk', status: 'published', published_at: new Date().toISOString(), import_method: 'manual' },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Clark election article seed failed' }, { status: 500 })
  }
}
