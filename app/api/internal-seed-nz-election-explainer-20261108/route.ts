import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: 8 November 2026 explainer on government formation before the final count.
// Written by the owner (Sam). Safe to call twice.
const story = {
  slug: 'nz-election-2026-can-government-be-discussed-before-every-vote-counted',
  title: 'New Zealand Election 2026: Can a Government Be Discussed Before Every Vote Is Counted?',
  category: 'new-zealand',
  image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
  source_name: 'Downunder Voices Original Analysis',
  source_url: 'https://www.electionresults.govt.nz/',
  summary:
    "With nearly 400,000 special votes outstanding and a projected parliamentary majority of just one seat, New Zealand's election has raised questions about the difference between preliminary results, political announcements and the formal formation of a government.",
  community_angle: `New Zealand faces a period of political uncertainty following its general election on 7 November, with Prime Minister Christopher Luxon indicating that the National Party has a pathway to forming the next government despite the official vote count remaining incomplete.

Speaking to supporters after the election, Luxon said National had a pathway to government while acknowledging that the result remained too close to call.

His remarks came as preliminary results placed the National–ACT–New Zealand First coalition on 67 seats in a projected 131-seat Parliament, where 66 seats would constitute a majority.

That leaves the governing bloc with a projected margin of just one seat.

Nearly 400,000 Votes Still Outstanding

According to the Electoral Commission's preliminary results, approximately 399,365 special votes remain to be checked and counted.

These include votes cast overseas and votes requiring additional verification.

The Electoral Commission has emphasised that preliminary results are indicative and may change following the official counting process.

The final results are scheduled to be released on 27 November 2026.

With such a narrow projected parliamentary majority, changes in seat allocations following the special vote count could have important consequences for government formation.

What Did the Prime Minister Actually Say?

Luxon indicated that National had a pathway to forming the next government, but did not formally declare victory.

Opposition leader Chris Hipkins likewise acknowledged that the final outcome would require further counting and potentially political negotiations.

The distinction between expressing confidence in forming a government and claiming that an election has been conclusively won is important.

Neither statement changes the official election results or replaces the constitutional procedures governing the appointment of a government.

Is It Legal to Discuss Government Formation Before the Final Count?

New Zealand's constitutional arrangements do not require political parties to wait until every vote has been counted before beginning discussions about forming a government.

The Department of the Prime Minister and Cabinet's constitutional guidance expressly recognises that negotiations between political parties may occur following an election.

New Zealand Parliament also explains that there is no fixed date by which a new government must be formed.

In some circumstances, government formation may be completed within days. In others, negotiations can continue for several weeks.

The Governor-General must be satisfied that the proposed government can command the confidence of the House of Representatives.

Consequently, an election-night statement about the possibility of forming a government does not, by itself, constitute a breach of electoral law.

What Happens During the Uncertainty?

Until the political situation is resolved and a new administration is appointed, the incumbent government continues under caretaker conventions.

These conventions allow routine government administration to continue while placing constraints on significant new policy decisions.

The caretaker arrangements are intended to preserve constitutional continuity during periods when the composition of the next government remains uncertain.

What Role Does the Electoral Commission Play?

The Electoral Commission is responsible for administering the election, counting votes and declaring the official results.

It does not determine which political parties should form a government.

Questions about potentially misleading electoral communications must be assessed according to the applicable electoral legislation and the Commission's jurisdiction.

There is an important difference between a political prediction, a statement of confidence and a false representation of an official election result.

No finding of unlawful conduct arises merely because a political leader discusses government formation before the official results are declared.

Why the Final Count Matters

New Zealand's Mixed Member Proportional electoral system allocates parliamentary seats through a combination of electorate and party votes.

Changes in party vote totals following the counting of special votes can alter the final distribution of seats.

The 2026 election illustrates why preliminary parliamentary projections must be distinguished from final certified results.

The entry of the Opportunity Party into Parliament, according to preliminary projections, adds another dimension to potential negotiations if neither established political bloc can secure sufficient parliamentary support.

The Constitutional Position

The central constitutional question is not whether a party leader can express confidence before the final count.

It is whether the government ultimately appointed can demonstrate the confidence of Parliament.

Political statements made on election night have no authority to replace the Electoral Commission's official declaration or the Governor-General's constitutional appointment process.

For New Zealand voters, the next significant milestone is 27 November, when the Electoral Commission is scheduled to release the official results.

Until then, the projected parliamentary numbers remain provisional.

Sources: New Zealand Electoral Commission preliminary results; Department of the Prime Minister and Cabinet, Cabinet Manual; New Zealand Parliament.

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
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Election explainer seed failed' }, { status: 500 })
  }
}
