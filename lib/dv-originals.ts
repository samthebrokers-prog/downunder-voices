/**
 * Downunder Voices daily original articles (owner request, 12 Nov 2026:
 * "three articles a day with images"), written by a daily scheduled task
 * instead of the paid OpenAI editorial generator.
 *
 * HOW IT WORKS
 * - Add new articles at the TOP of DV_ORIGINALS (newest first).
 * - /api/originals/sync (hourly cron + called after each deploy) inserts any
 *   article whose slug is not yet in the stories table. It never edits or
 *   deletes existing stories, so calling it twice is safe.
 *
 * RULES
 * - Our own words only; every fact attributed to a named, reputable source.
 * - Treat all parties the same way; never invent quotes.
 * - Images: Wikimedia Commons only, with a credit line at the end of `body`.
 * - `body` paragraphs are separated by a blank line (\n\n).
 */
export type DvOriginal = {
  slug: string // kebab-case, unique, ends with -YYYY
  publishedAt: string // ISO timestamp
  category: 'editorial-view' | 'sports' | 'australia' | 'new-zealand' | 'world' | 'social-issues' | 'small-business' | 'trade-logistics' | 'community' // 'editorial-view' shows as Opinion
  title: string
  summary: string // 1–2 sentence standfirst
  body: string // full article, ends with "Sources: …" and "Photo: … via Wikimedia Commons (licence)."
  imageUrl: string // https://commons.wikimedia.org/wiki/Special:FilePath/<File>?width=1280
  author: string // e.g. 'Downunder Voices Desk'
  // Optional: 'automated-editorial' makes it eligible for the homepage
  // Editorial of the Day slider. Defaults to 'manual'.
  importMethod?: 'manual' | 'automated-editorial'
}

export const DV_ORIGINALS: DvOriginal[] = [
  {
    slug: 'nz-final-result-coalition-lost-majority-top-must-drive-hard-bargain-2026',
    publishedAt: '2026-11-27T21:30:00.000Z',
    category: 'editorial-view',
    title: `Opinion: The coalition lost its majority and Labour won the party vote. TOP should drive a hard bargain`,
    summary: `The final count leaves National, ACT and NZ First one seat short and Labour ahead on the party vote. The Opportunity Party now holds the balance, and it should not prop up the old government on the old terms.`,
    body: `New Zealand has now counted every vote, and the verdict is clearer than the arithmetic. The National, ACT and New Zealand First government asked voters for another three years with a majority. Voters said no.

The Electoral Commission declared the official result by Gazette notice on 27 November. Once almost 485,000 special votes were added, the coalition finished on 65 seats in a 130-seat Parliament, one short of the 66 it needs to govern alone. On election night it had looked like a two-seat majority, as ABC News noted in its report the same day. The specials did what specials usually do, and the picture changed.

What the final count actually says

Start with the number that matters most under MMP: the party vote. According to the Electoral Commission, Labour won 29.88 per cent of the party vote, ahead of National on 28.35 per cent. More New Zealanders gave their party vote to Labour than to any other party. National still ends up with more seats, 40 to Labour's 36, because it won 40 electorates and its electorate haul exceeds what its party vote alone would deliver. The Commission says the House has an overhang of 10 seats, six of them National's and four Te Pāti Māori's.

The Greens finished on 14.06 per cent and 17 seats, gaining one on specials. ACT has 13 seats, New Zealand First 12, The Opportunity Party seven and Te Pāti Māori five. The Commission also confirmed that Labour's Kieran McAnulty took Wairarapa by 81 votes and Georgie Dansey took Hamilton East by 173, both from National, while the Greens' Julie Anne Genter won Wellington Bays.

Read those numbers together and the story is not a narrow win for the status quo. It is a government that lost ground, a Labour Party that topped the party vote, a Green Party that grew, and a new force, TOP, that now holds the balance.

What the numbers do not say

Honesty matters here, because the left has no easy road either. As The Spinoff's Joel MacManus set out on 27 November, Labour, the Greens and Te Pāti Māori together hold 58 seats. Even with TOP's seven that is 65, also one short. There is no simple path for a Labour-led government, and pretending otherwise would be wishful thinking.

That makes TOP's seven seats decisive, and it makes the terms TOP sets the most important political decision of the summer.

Why TOP should drive a hard bargain

The Opportunity Party did not win more than 175,000 party votes to keep the outgoing government in office on the same terms. Its voters backed a party built on evidence-based policy: fairer tax on wealth and land rather than wages, serious climate action, and a better deal for young New Zealanders locked out of housing. Those are not small asks, and nothing in the last three years suggests a National-ACT-NZ First government would deliver them unprompted.

The Spinoff described TOP leader Qiulae Wong as "in the driver's seat", and ABC reported that she has said she will talk first with the party holding the most seats. That is a fair and transparent process. But talking first is not the same as agreeing at any price. If National wants TOP's votes, the price should be measurable change: a credible plan to cut emissions rather than slow-walk them, tax reform that shifts the load off working people, and real investment in public housing, health and child poverty.

The form of any deal matters too. The Spinoff notes that one option is a confidence-and-supply arrangement that would leave TOP on the crossbench. For a small party with distinctive policies, that is the safer route. It lets TOP secure written policy gains while keeping its freedom to vote against measures it opposes, such as cuts to public services or reversals on climate. Full coalition, with ministers bound by collective responsibility, risks TOP becoming the fourth wheel of a government its voters did not choose.

Luxon has boxed himself in

National's difficulty is partly of its own making. During the campaign Christopher Luxon repeatedly ruled out working with TOP, as The Spinoff recorded. He now needs exactly that party to keep his job. Voters are entitled to notice the change of heart, and TOP is entitled to ask what National is offering that it was not offering a month ago.

There is also the question of the coalition partners. ACT and New Zealand First were elected on platforms that sit uneasily with TOP's approach to climate and tax. Any arrangement that leaves ACT's agenda intact and asks TOP merely to supply the 66th vote would be a poor deal for TOP's voters and for the country.

Labour and the Greens should be ready

Labour and the Greens are not spectators. They won more than 43 per cent of the party vote between them. They should make clear, publicly, what a Labour-led arrangement would offer TOP if the numbers ever allowed it, and what they will support from opposition: action on the cost of living, stable funding for health and public broadcasting, and climate policy that matches the science. A constructive opposition that sets out workable policy is the best preparation for the next election, whenever it comes.

And it might come soon. ABC reported analysts' view that if National cannot reach a deal with TOP, a fresh election is likely, and quoted chief electoral officer Karl Le Quesne: "We always need to be ready for another election." The Spinoff observed that no party appears to have much appetite for that. Nobody should want a second election for its own sake. But nobody should fear one either. A second vote is the system working, not failing, if the alternative is a government built on a deal that does not reflect what people voted for.

The government's case

National argues that it remains the largest party in Parliament, that its coalition is only one seat short, and that stability is best served by continuing the current arrangement with the smallest necessary addition. ACT and New Zealand First say the country voted for a centre-right direction. Those points carry weight: 65 seats is a large bloc, and continuity has value in uncertain economic times.

But stability is not the same as a mandate. The outgoing coalition lost its majority, lost two electorates on the final count and finished second on the party vote. A government formed from that result should look different from the last one.

What comes next

The Electoral Commission says parties have until 2 December to seek judicial recounts. If none are filed, the writ will be returned on 3 December and list MPs declared. After that, the bargaining begins in earnest.

TOP should use its leverage fully and in the open. Labour and the Greens should keep presenting a credible alternative. And every party should remember that New Zealanders turned out in their millions, 77.2 per cent of those enrolled, to change the direction of their country. The deal that emerges must respect that.

This is an opinion column.

Sources: Electoral Commission, "2026 General Election official results", 27 November 2026; The Spinoff (Joel MacManus), "The final 2026 election results are in, but who actually won?", 27 November 2026; ABC News (Stephen Dziedzic, with wires), "New Zealand's incumbent government fails to secure majority from election result", 27 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-final-result-coalition-lost-majority-top-must-drive-hard-bargain-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'health-nz-rehired-166-redundant-staff-public-good-test-2026',
    publishedAt: '2026-11-27T21:25:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Health NZ paid people to leave, then hired at least 166 back. Restructures need a public good test`,
    summary: `Union figures show Health New Zealand has rehired at least 166 people it made redundant, and cannot say what the churn has cost. The next government should require a public good test before any more cuts.`,
    body: `Health New Zealand has been paying people to leave, and then hiring some of them back. That is not reform. It is waste, and the next government should put a stop to it.

The numbers come from the Public Service Association, which obtained them from Health NZ under the Official Information Act and were reported by RNZ on 26 November. They show that at least 166 people made redundant by Health NZ since it was created in 2022 have since been rehired. The real figure is likely higher, because the data does not count people who came back as contractors.

The scale of the churn

The same information shows 1,907 redundancy payments logged since July 2022, drawn from more than 20 separate payroll systems inherited from the old district health boards. Some 292 of those redundancies were in data and digital roles. Health NZ could not say how many former staff returned as contractors, or how much the redundancy payouts have cost in total. It told the union those follow-up questions would be treated as new information requests, with up to 20 working days to answer.

Think about what that means. The country's largest employer cannot readily tell the public what it has spent on getting rid of people, or how many of them it is now paying again through another door. Every redundancy cheque comes out of the health budget. Every rehire after a payout means the taxpayer has paid twice for the same skills, and patients have lived with the disruption in between.

Cuts first, questions later

Ministers in the outgoing government have argued that money saved behind the scenes goes to the frontline. But when the same roles turn out to be needed, the savings evaporate, and the expertise lost in the meantime is hard to rebuild.

It is not as if the frontline has been transformed either. RNZ has reported that Health NZ added just 54 full-time-equivalent nurses over two years, before a September announcement of 380 extra nurses, midwives and healthcare assistants. Caretaker Health Minister Simeon Brown's office has also had to deny that he ordered nursing workforce figures held back until after the 7 November election. Whatever the truth of that, the episode shows how much the public still has to fight to get basic facts about its own health system.

A test before the next restructure

PSA national secretary Fleur Fitzsimons has called the pattern "a senseless merry-go-round where health workers lose their jobs". Her union wants a public good test applied before any major restructure in the public service: a clear, published case showing that the change will improve services and save money once redundancy costs and rehiring are counted.

That is a modest, sensible idea, and Labour, the Greens and TOP should all back it in the coming negotiations and in Parliament. It would not stop genuine reform. It would simply require managers and ministers to show their working before cutting jobs, and to be accountable when the numbers do not add up.

The next government should go further. It should ask Health NZ to publish the full cost of restructuring since 2022, including contractor spending. It should stabilise the workforce, so staff are not facing their third or fourth change proposal in as many years. And it should fund the health system properly, so that frontline gains do not depend on stripping out the people who keep the payroll, data and IT systems running.

Health NZ's case

Health NZ's people and culture director Robyn Shearer has defended its record, saying the agency continues to actively recruit to frontline clinical and support roles. Defenders of the reforms point out that merging 20 district health boards into one organisation was always going to involve duplicated roles, and that some people rehired may have returned to quite different jobs. The outgoing government argues that cutting back-office costs is necessary to protect spending on patients. Those are fair points, but they do not explain why the true costs are so hard to find.

The bottom line

Good health care depends on stable, experienced teams. Paying people to go and then paying again to bring them back serves nobody: not the workers, not the taxpayer, and above all not patients. A public good test is the least New Zealanders should expect.

This is an opinion column.

Sources: RNZ, 26 November 2026, reporting PSA figures obtained under the Official Information Act, as summarised by NEWS WIRE, "Health New Zealand has rehired at least 166 workers it made redundant, union figures show", 26 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/health-nz-rehired-166-redundant-staff-public-good-test-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-gas-reservation-law-good-start-electrify-homes-2026',
    publishedAt: '2026-11-27T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Australia's new gas reservation law puts households first. Keep it at 20 per cent and electrify homes`,
    summary: `Parliament has passed a scheme making LNG exporters reserve up to 20 per cent of their gas for Australians from 2028. It is overdue and welcome, but it should not be watered down, and it should come with a push to cut household gas use.`,
    body: `For years Australians have lived with an absurdity: one of the world's biggest gas exporters, with households and factories on the east coast warned of shortages and paying prices set by overseas markets. This week Parliament finally did something about it.

According to ABC News's business coverage on 27 November, Parliament has passed a scheme requiring LNG exporters to reserve up to 20 per cent of their production for the domestic market from 2028, with Western Australia exempt. Oilprice.com, in a report republished by Yahoo News the same day, said the Albanese government first announced the policy last December and set out the model in May.

It is a good law, and a long overdue one. It should be the start of a fairer energy deal, not the end.

Why it matters to ordinary people

Gas is not an abstract export commodity. Prime Minister Anthony Albanese, quoted by Reuters, put it plainly: "Gas heats Australian homes, it firms renewable energy, it is essential to manufacturing". When east coast supply gets tight, those costs flow straight into power bills, heating bills and the price of goods made in Australian factories.

The risk was real. Oilprice.com reported that the competition regulator warned last year that the east coast market could tip into deficit, a gap only closed by stopgap agreements with exporters. Relying on voluntary deals with a handful of large companies is no way to secure a basic household need. A legislated reservation puts Australians first in the queue for a resource that belongs to them.

The timing matters too. ABC reported on 27 November that the Reserve Bank has raised interest rates five times. Families squeezed by mortgage rises and grocery prices cannot also be left exposed to gas shortages. Anything that steadies energy costs takes some pressure off household budgets and, eventually, off inflation itself.

Where it falls short

The law has been weakened on the way through. Oilprice.com reported that the original fixed 20 per cent mandate became a requirement of up to 20 per cent. That gives room for the share to be set lower, and the government must not let industry lobbying whittle it down in practice. The scheme also does not start until 2028, which offers little to households facing winter bills in 2027.

And reserving gas is only one half of the job. The other half is cutting how much gas we need. Every home that switches from gas heating to an efficient electric heat pump, and every factory that electrifies, reduces both bills and emissions. Labor should pair the reservation scheme with stronger support for household electrification, while the Greens are right to keep pushing for the transition to be faster. Gas should be the backup for a renewable grid, not an excuse to approve new fields that lock in decades of emissions.

The other side

The gas industry opposed the scheme, arguing, as Oilprice.com reported, that it could change investment decisions and lead producers to spend less. Western Australia, which Oilprice says accounts for about two-thirds of the nation's LNG exports, already runs its own 15 per cent reservation and has no pipeline to the east, which is why it was exempted.

These are concerns worth monitoring, and the government should report regularly on supply and prices once the scheme starts. But Western Australia's experience suggests a reservation and a strong export industry can coexist. Producers who profit from Australian resources can reasonably be asked to keep enough at home to supply Australians at fair prices.

The bottom line

Albanese has described the law as preserving Australian gas for Australians. That is the right principle. Now Labor should keep the share at the full 20 per cent, bring forward relief where it can, and back it with a serious push to electrify homes so that families are not tied to gas in the first place. Cheaper, more secure energy is a cost-of-living measure, a jobs measure and a climate measure all at once.

This is an opinion column.

Sources: ABC News (Lin Lin, Katie Silver and others), "ACCC issues Black Friday AI warning, Sequoia gets Senate grilling - as it happened", 27 November 2026; Oilprice.com (Irina Slav) via Yahoo News, "Australia Passes Landmark Law to Reserve Gas for Domestic Consumers", 27 November 2026, including Prime Minister Anthony Albanese's remarks as quoted by Reuters.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-gas-reservation-law-good-start-electrify-homes-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'three-parties-one-pm-two-deputy-pms-now-a-fourth-party-2026',
    publishedAt: '2026-11-27T04:05:00.000Z',
    category: 'editorial-view',
    title: `Three Parties, One Prime Minister, Two Deputy Prime Ministers — Now a Fourth Party?`,
    summary: `New Zealand has spoken. Will its political leaders put the country before their personal ambitions?`,
    body: `New Zealand has spoken. Will its political leaders put the country before their personal ambitions?

The final election results have delivered a powerful message to National, ACT and New Zealand First.

After three years in government, the coalition has fallen short of a parliamentary majority, leaving the Opportunity Party and its leader, Qiulae Wong, in a potentially decisive position.

New Zealand has already experienced a three-party government with one Prime Minister and two politicians sharing the position of Deputy Prime Minister at different stages of the parliamentary term.

Are we now heading towards a four-party government, with even more political compromises, ministerial portfolios and competing demands?

New Zealanders deserve better than another round of negotiations dominated by political egos.

Christopher Luxon, David Seymour and Winston Peters must recognise that the election result is a verdict on their collective leadership.

The cost of living, housing affordability, business confidence, unemployment and the weakness of the New Zealand dollar demand urgent attention.

Ordinary New Zealanders do not have the luxury of negotiating ministerial positions, salaries, allowances and political privileges. They are negotiating with their household budgets, mortgage repayments and supermarket bills.

Meanwhile, the Opportunity Party's emergence represents a significant change in New Zealand's political landscape. Its supporters have placed their confidence in an alternative political voice.

That democratic decision must be respected.

The question is not who gets the biggest office, the most prestigious ministerial title or the greatest political influence.

The question is who can deliver a stable, responsible and economically credible government.

To the leaders of National, ACT and New Zealand First: forget your personal ambitions. Put aside your political egos.

New Zealand belongs to its people, not its politicians.

The voters have delivered their message. It is now time for the politicians to listen.

Downunder Voices — Independent editorial opinion.

Sources: New Zealand Electoral Commission official election results, 27 November 2026.

Image: Supplied.`,
    imageUrl: 'https://www.downundervoices.com/editorial/four-party-government-nz-2026.jpg',
    author: 'Downunder Voices Editorial',
    importMethod: 'automated-editorial',
  },
  {
    slug: 'rnz-58-roles-pause-cuts-until-review-protect-public-broadcasting-2026',
    publishedAt: '2026-11-26T21:30:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Staff did not cause RNZ's $11.8m hole. Pause the 58 redundancies until the review is done`,
    summary: `RNZ wants to shed 58 full-time roles after a loss more than 25 times bigger than forecast. Newsrooms should not pay first for a failure of financial controls, and the next administration must put public broadcasting on a stable footing.`,
    body: `Radio New Zealand is about to lose one in six of its staff, and the people being shown the door are not the ones who lost track of the money.

That is the uncomfortable core of the crisis at the public broadcaster. On 17 November 1News reported that RNZ had recorded an $11.8 million loss for the year to June, more than 25 times the $470,000 it had forecast, and that the organisation blamed inaccurate internal financial reporting. The board has approved a revised plan that proposes cutting 58 full-time roles, out of roughly 350, with affected people leaving progressively between December and 31 March 2027. The restructure itself is expected to cost $2.5 million, on top of an expected $7.8 million deficit for 2026/27.

Those are big numbers for a small organisation. But the right response to a failure of financial controls is to fix the controls and find out who was responsible, not to strip out reporters and producers before anyone knows what went wrong.

What we know about how it happened

The Spinoff's Hayden Donnell, writing on 17 November after speaking to six RNZ staff, set out the components of the blowout as staff understand them: a $2 million land sale wrongly booked as income, staff costs $3.2 million over budget (including $1.4 million in redundancy payments), and running costs $6.4 million over budget, including overruns on a new Auckland office. HRD New Zealand reported on 12 November that The Post had revealed the board approved a $5 million loan facility that broke the law, prompting calls for directors to resign.

Outgoing chief executive Paul Thompson has said he takes responsibility, and brought his departure forward. The board has commissioned an independent review into what RNZ itself has described as its financial controls, escalation, assurance and governance arrangements. That review has not yet started.

So here is the sequence RNZ is proposing: decide on the cuts first, consult on them over the summer holidays, start moving people out in December, and learn what actually went wrong later. That is backwards.

Why the timing is wrong

The unions representing RNZ staff, E tū and the PSA, have asked for exactly one thing: pause the redundancy process until the independent review is finished and a new government is in place. That is not an unreasonable demand. According to RNZ copy republished by the Otago Daily Times, E tū national secretary Rachel Mackintosh said more than 200 people protested outside RNZ's Auckland and Wellington offices on 17 November, and that the union still had not seen the business case behind the figure of 58. "We've asked for the business case behind the 58 again and again," she said.

PSA national secretary Fleur Fitzsimons made the other obvious point: New Zealand is between governments. The official election result is due today, and whoever forms the next administration, RNZ will answer to a new media minister. Locking in permanent damage to a public institution during a caretaker period, when the review that is meant to explain the mess has not even begun, is poor governance.

There is also a fairness problem. Staff told The Spinoff they want redundancies to start in management, and that lower-paid workers are being asked to carry the cost while the people at the top walk away. RNZ's statement in response said the cuts were about financial sustainability, but did not commit to focusing them on management. When union delegate Phil Pennington asked RNZ to list alternatives, including cutting executive pay, he was asking a fair question. Every New Zealander who funds RNZ through their taxes deserves an answer to it.

This did not start with one bad year

It would be convenient to treat RNZ's troubles as a one-off accounting failure. They are not. In August 1News reported that RNZ was already planning to cut 25 to 30 roles, about 10 per cent of its workforce, because of a further funding reduction, with more reductions signalled for the following two years. Acting chief executive Mark Stevens told staff in November that "RNZ funding has reduced by 9% over two years."

In other words, the current government was already squeezing the public broadcaster before the accounting problems surfaced. According to The Spinoff, Prime Minister Christopher Luxon and outgoing broadcasting minister Paul Goldsmith have ruled out a bailout. That is their right, but it means the cost of the board's failures, layered on top of deliberate funding cuts, now falls on newsrooms that serve the whole country.

The damage will be felt well beyond Wellington. RNZ is where many New Zealanders turn in an earthquake, a flood or a cyclone, and where rural and regional communities get news that commercial outlets have long since stopped covering. RNZ says change proposals will be guided by its Charter and by audience needs, and Stevens has said no part of the organisation will be protected. That should worry anyone who relies on RNZ for coverage of their region, of Māori and Pacific communities, or of Parliament itself.

What should happen now

First, the board should pause the redundancies until the independent review reports. If the review finds that senior decisions caused the loss, accountability should start there, not with reporters, producers and technicians.

Second, the review should be made public in full. RNZ is publicly owned. New Zealanders are entitled to know how a forecast loss of under half a million dollars turned into almost $12 million.

Third, whoever forms the next government should commit to stable, multi-year funding for public media. Labour, the Greens and The Opportunity Party should make this an explicit priority in any negotiations. Public broadcasting is not a luxury to be trimmed every budget round; it is part of the infrastructure of a democracy, as essential in an emergency as roads and power lines. A modest, predictable funding settlement, tied to clear reporting and proper financial controls, would cost far less than rebuilding newsrooms once they are gone.

Finally, governance needs to change. A public broadcaster's board must be appointed for competence and must be answerable when things go wrong. Staff should not be the only people asked to leave.

The government's case

The outgoing government and RNZ's management argue that RNZ has to live within its means like any other organisation, that taxpayers should not be asked to cover losses caused by internal failures, and that delaying the cuts would only deepen the deficit. RNZ says the staffing reduction is about making the broadcaster financially sustainable. Those are legitimate concerns. But sustainability built on cutting first and investigating later is not sustainability; it is damage control that lands on the wrong people.

The bottom line

RNZ's journalists did not book a land sale as income, sign off an unlawful overdraft or miss a loss by a factor of 25. Pause the cuts, publish the review, fix the governance, and give public media funding that does not shrink every year. A new Parliament is about to sit. It should not inherit a gutted public broadcaster as a fait accompli.

This is an opinion column.

Sources: 1News (Justin Hu), "RNZ's job cuts to cost $2.5m, staff face news of cuts within days", 17 November 2026; The Spinoff (Hayden Donnell), "You first: RNZ staff want the redundancies to start in management", 17 November 2026; RNZ via Otago Daily Times, "Show us the alternatives: RNZ staff protest job cuts outside offices", 17 November 2026; HRD New Zealand (Jack Campbell), "RNZ staff to protest job cuts after $11.8m budget blowout", 12 November 2026; 1News, "RNZ to cut around 10% of staff amid further funding reductions", 14 August 2026; Electoral Commission, "Progress on official count", 18 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/rnz-58-roles-pause-cuts-until-review-protect-public-broadcasting-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-55000-special-votes-thrown-out-restore-election-day-enrolment-2026',
    publishedAt: '2026-11-26T21:25:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Tens of thousands of votes will not count in today's final result. Bring back election-day enrolment`,
    summary: `The Electoral Commission expects around 55,000 special votes to be thrown out this election, about five times more than last time, after enrolment closed 13 days before polling day. The next Parliament should restore the right to enrol and vote on the same day.`,
    body: `When the Electoral Commission releases the official 2026 election result today, the count will be missing tens of thousands of New Zealanders who turned up, cast a vote and were turned away by a rule change.

According to the Commission's media release of 18 November, official results are due on Friday 27 November. Behind the seat totals is a quieter story. As 1News reported on 16 October, the Electoral Commission estimated that about 55,000 special votes would be disallowed this election, roughly five times more than last time. It also estimated that more than 72,000 electorate votes could be thrown out, up from more than 42,000 in 2023, mainly because of out-of-date addresses.

What changed

Before this year, New Zealanders could enrol right up to and on election day, casting a special vote at the same time. That option is gone. Under electoral law changes passed by December 2025, enrolment for the 7 November election closed at midnight on 25 October, 13 days before polling day. The same changes reinstated a total ban on voting by prisoners sentenced after December 2025.

The scale of what that removes is striking. 1News reported that in 2023 more than 600,000 people cast special votes, and that 450,000 of them enrolled in the final two weeks before the election, including 110,000 who enrolled on election day itself. Under this year's rules, that is close to half a million votes that would not have counted.

Who pays the price

Late enrolers are not a random slice of the country. 1News reported that Electoral Commission data indicates the early cut-off is likely to disenfranchise Māori, Asian and Pasifika communities and young people. These are people who move house more often, rent rather than own, and are more likely to engage with politics late in a campaign. Those are not reasons to shut them out. They are reasons to make voting easier for them.

In a close election, the effect is not abstract. Analysts have been watching tight electorate races and a possible overhang that could shift the balance of the next Parliament. A democracy that discards tens of thousands of good-faith votes on a technicality, when the margins between blocs are this fine, has made a choice about whose voices matter.

The government's case

Supporters of the change argue that closing enrolment earlier speeds up the official count and reduces pressure on election staff. That point has substance: 1News reported that special votes take about ten times longer to process than ordinary votes, and that the 2023 surge in specials was 46 per cent above 2020 and about 100,000 above the Commission's projections. A faster, cleaner count is a reasonable goal.

But the answer to slow counting is more resources and better systems, not fewer voters. Election-day enrolment worked in 2020 and 2023. If the Commission needs more staff or better technology to process specials quickly, fund it. The trade-off between a count that takes three weeks and one that takes two should never be settled by disqualifying people.

What the next Parliament should do

Labour, the Greens and The Opportunity Party should make restoring same-day enrolment a clear commitment in any coalition or support agreement. It should sit alongside proper funding for the Electoral Commission, so that results come faster without anyone losing their vote. The next government should also ask the Commission to publish, electorate by electorate, how many special votes were disallowed this year and why, so that the public can see the real cost of the change.

Voting is the one moment when every adult citizen is equal. A rule that tells someone at the booth that they are a fortnight too late does not protect that equality. It erodes it. Whoever governs after today should put it right before 2029.

This is an opinion column.

Sources: Electoral Commission, "Progress on official count", 18 November 2026; 1News (Indira Stewart), "How the new enrolment rules could affect the election result", 16 October 2026; Democracy Project (Bryce Edwards), "News Briefing: 26 November 2026", 26 November 2026.

Photo: the Beehive and Bowen House, Wellington, via Wikimedia Commons (free licence, as listed on the Commons file page).`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-55000-special-votes-thrown-out-restore-election-day-enrolment-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-labor-greens-trust-tax-private-jets-parliament-deal-2026',
    publishedAt: '2026-11-26T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: The Labor–Greens trust tax deal in Parliament is fair. Wealthy families and private jet owners should pay their share`,
    summary: `With inflation at 4.9 per cent, Labor and the Greens have agreed a 30 per cent minimum tax on discretionary trust distributions and higher fees for some private jet owners. Asking those at the top to pay more is the right call while ordinary households struggle.`,
    body: `Australian households are paying more for almost everything. The ABC reported on 25 November that annual inflation rose to 4.9 per cent in the year to October, a three-year high. In that climate, a tax system that lets some of the country's wealthiest families shift income through trusts at low rates, and lets private jet owners pay a fraction of the fuel tax motorists pay, is hard to defend.

That is why the deal struck in Canberra this week deserves support.

What has been agreed

According to the ABC's federal politics coverage on 25 November, the Greens will support Labor's 30 per cent minimum tax on discretionary trusts in return for extra integrity measures, including more resources for the charities regulator and the Australian Taxation Office. The Greens dropped their push to tax payments from trusts to private schools, sporting clubs and religious organisations at 30 per cent; those remain within a broad carve-out for charitable donations. Earlier, Smart Property Investment reported on 17 November that the Greens had also dropped a demand for a public register naming around a million trust beneficiaries.

The deal also addresses private aviation. The ABC reported that private jet fuel is taxed at about 3.556 cents a litre, compared with 53.7 cents a litre paid by motorists, and that Treasurer Jim Chalmers said Labor had committed to "eliminate" that difference. The fuel tax itself will not change; instead, annual registration fees for some private aircraft will rise from July, with medical, aerial work, tourism, training and recreational flying excluded, according to people involved in the negotiations who spoke to the ABC. AAP, reported by The Canberra Times, said Parliamentary Budget Office analysis commissioned by the Greens costed the private jet fuel concession at $640 million in 2027 and $1.5 billion over the forward estimates.

Why it matters to ordinary people

Discretionary trusts have legitimate uses, but they have also long allowed higher-income families to split income among relatives on lower tax rates. A minimum rate of 30 per cent does not abolish trusts. It simply narrows the gap between what a wage earner pays on each extra dollar and what a family trust can arrange.

The private jet issue is smaller in dollars but large in principle. A nurse filling up a hatchback should not be paying a far higher effective fuel tax than the owner of a business jet. Fixing that, while protecting medical, regional and training flights, is common sense.

The money matters too. Every dollar of revenue that comes from those most able to pay is a dollar that does not have to come from cuts to services that lower-income Australians rely on, at a time when inflation is already squeezing budgets.

The other side

Opposition Leader Angus Taylor called the arrangement a "dirty deal". Accountants Daily reported on 17 November that Coalition senators on the Senate economics committee recommended against passing the trust bill unless the minimum tax was removed, warning of serious costs for small business and calling for a further inquiry. Those concerns deserve a proper hearing: the trust changes are complex, and genuine small family businesses need clear rules and time to adjust. Under the bill, the minimum tax is not due to start until 1 July 2028, according to the committee report, which leaves time for detailed guidance.

The bottom line

Australians have accepted real restraint during a cost-of-living crunch. It is fair to ask those with the most to contribute more, and it is good to see Labor and the Greens working together to get reform through the Senate. Labor should hold the line on integrity, resist any further carve-outs, and use the revenue to ease pressure on households rather than to fund more concessions at the top.

This is an opinion column.

Sources: ABC News (Courtney Gould, Joshua Boscaini), "Federal politics: Greens to support Labor trust tax in exchange for higher fees for some private jet owners", 25 November 2026; Accountants Daily (Malavika Santhebennur), "Coalition senators refuse to support trust tax bill", 17 November 2026; Smart Property Investment (Gemma Crotty), "Investors spared from public register as Greens drop trust bill demand", 17 November 2026; AAP via The Canberra Times, "Greens call for an end to jet fuel tax breaks for rich", 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-labor-greens-trust-tax-private-jets-parliament-deal-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-election-prediction-the-woman-who-could-decide-luxons-fate-2026',
    publishedAt: '2026-11-26T13:05:00.000Z',
    category: 'editorial-view',
    title: `NZ Election Prediction: The Woman Who Could Decide Luxon's Fate`,
    summary: `My prediction is that Christopher Luxon's existing coalition will lose its outright majority when the final election results are announced today. But that does not necessarily mean Chris Hipkins will become the next Prime Minister.`,
    body: `My prediction is that Christopher Luxon's existing coalition will lose its outright majority when the final election results are announced today.

But that does not necessarily mean Chris Hipkins will become the next Prime Minister.

The biggest political winner could be Qiulae Wong, a political newcomer who may suddenly find herself negotiating the future of New Zealand with some of its most experienced politicians.

Luxon once ruled out working with Opportunity. He has since met Wong. Politics has a remarkable way of turning yesterday's rejection into tomorrow's handshake.

Neither National nor Labour secured even 30 per cent of the party vote on election night. That alone should send a powerful message to both parties.

New Zealanders are struggling with the cost of living, healthcare, housing and employment. They cannot afford weeks of politicians bargaining over ministerial positions while ordinary families struggle to pay their bills.

My prediction is that Luxon may remain Prime Minister, but with significantly less political freedom and greater dependence on smaller parties.

Today may not decide who governs New Zealand. It may decide who gets to negotiate the price of power.

The real question is whether the politicians will put the country before their own political survival.

This is an opinion column.

Sources: New Zealand Electoral Commission preliminary results, 7 November 2026; Stuff, "The Opportunity Party could hold the keys to power on Friday", November 2026; 1News, "It's time: Four election scenarios that could play out tomorrow", 26 November 2026.

Image: Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/editorial/nz-election-final-count-today-2026.jpg',
    author: 'Downunder Voices Editorial',
    importMethod: 'automated-editorial',
  },
  {
    slug: 'nz-final-count-special-votes-respect-the-result-2026',
    publishedAt: '2026-11-25T21:30:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Friday's final count decides the government. Every party must respect it, and the left must be ready`,
    summary: `The official result, including almost 400,000 special votes, lands on Friday. If the outgoing coalition holds on, it will govern on less than half the party vote; if the specials tilt, Labour, the Greens and Opportunity need a credible plan.`,
    body: `On Friday afternoon, almost three weeks after polling day, New Zealand will finally learn who it voted for. The Electoral Commission releases the official count at 2pm, and this time it will include the special votes, close to 400,000 of them according to 1News. That is roughly one vote in every seven cast, and it is enough to change the shape of the next government.

Until then, everything is provisional. But the preliminary numbers already tell us something important, and it should shape how every party behaves once the final figures are in.

What election night actually showed

On the preliminary count reported by interest.co.nz on 8 November, Labour won the most party votes, 29.36 per cent to National's 29.21 per cent. The Greens took 13.30 per cent, ACT 10.92 per cent, NZ First 9.78 per cent and The Opportunity Party 5.96 per cent. Te Pāti Māori won five electorates on 0.57 per cent of the party vote.

Because of the overhang, those votes produced a Parliament of 131 seats, with 66 needed to govern. On election night the National, ACT and NZ First bloc had 67 seats, according to interest.co.nz, and the left bloc of Labour, the Greens, Opportunity and Te Pāti Māori had 64.

Add up the right bloc's party votes on those same figures and you get just under 50 per cent. 1News made the same point on Thursday: if the outgoing coalition holds on, it would govern with a majority built on less than half of the party vote, something that has not happened under MMP with minor parties this large.

That is not a technicality. MMP was designed so that the party vote decides the make-up of Parliament. A government that wins fewer votes than its opponents but more seats because of how electorates fell would be legal. It would also be a government with a thin claim to a mandate for anything radical.

Why the specials matter

Special votes are cast by people who enrolled late, voted outside their electorate, or were overseas. They have tended to lean towards the centre-left, and interest.co.nz noted on election night that specials usually add one or two seats to the left. Opportunity's share was also expected to rise.

1News reported on Wednesday that several electorates are close enough to flip. In Wairarapa, National's Mike Butterick led Labour's Kieran McAnulty by just 139 votes. In Mt Roskill, Labour's Michael Wood was 262 votes ahead of National's Carlos Cheung. In Hamilton East, National's Ryan Hamilton led Labour's Georgie Dansey by 456 votes. In Te Tai Tokerau, Te Pāti Māori's Aperahama Edwards was 436 votes ahead of the Green Party's Hūhana Lyndon.

Because National won more electorates than its party vote entitles it to, it has no list MPs. As 1News explained, every electorate National loses now costs it a seat outright. A shift in Wairarapa alone would change the arithmetic.

On election night, Labour leader Chris Hipkins put it simply: "Every vote matters and every vote must now be counted." He was right, and that principle should hold all the way through any recounts that follow.

The four ways this could go

1News laid out four scenarios on Thursday. The outgoing coalition could hold its majority. Opportunity could end up holding the balance of power. Parliament could be hung, with neither bloc able to pass a confidence vote. Or the result could drag on for another week or two while judges conduct recounts, which candidates can request within three working days of the declaration.

Each of those outcomes asks something different of the parties. Here is what we think the parties of the centre-left should do in each.

If the right holds on, Labour, the Greens and Opportunity should accept the result with grace and hold the new government hard to account. A coalition elected on under half the vote should not treat its majority as permission to fast-track divisive changes, and the opposition should say so loudly every time it tries.

If Opportunity becomes the kingmaker, it faces the biggest decision in its short history. Its leader Qiulae Wong has said she would talk to the largest party first. Before the election she told 1News of National: "We will negotiate in good faith with them." That is a fair and honest starting point. But Opportunity's voters backed a party that wants tax reform, serious climate action and a fairer deal for young people and renters. Mr Luxon has ruled Opportunity out, 1News reports, and its five bottom lines should be treated as exactly that. If National will not move, Opportunity should be ready to work with Labour and the Greens, who are closer to its agenda on tax, housing and climate.

If Parliament is hung, nobody should rush back to the polls. A fresh election would cost money, test voters' patience, and very likely produce something similar. The responsible path is long, patient negotiation, including across the blocs on a limited agreement if that is what it takes.

If the count drags on, so be it. Recounts are part of a healthy democracy. 1News reported that in 2020 the writ was not returned until two weeks after the official results. Nobody was harmed by waiting.

What a centre-left government could do

A Labour-led government with the Greens and Opportunity would have a real chance to tackle problems that have festered. Housing affordability, child poverty, health workforce shortages and climate adaptation all need long-term plans that outlast a single term. Labour brings experience of government. The Greens bring a clear programme on climate and poverty. Opportunity brings fresh thinking on tax and on making the system fairer between generations.

These parties will not agree on everything, and they should be honest with voters about where they differ. But they share a basic view that government has a job to do in making life fairer, and that public services and public assets are worth protecting.

The other side

National, ACT and NZ First argue that they won the most seats on election night and that their coalition delivered stability for three years. National's leader Christopher Luxon said on election night that it appeared National had a path to form government, while noting the result was too close to call. The coalition parties say voters endorsed their focus on the economy, law and order and lower spending, and that a seat majority is how MMP works. Those are legitimate arguments, and if the final count confirms their majority, they will have every right to govern.

The bottom line

Friday's count is the result. Not election night, not the commentary, not the polls. Every party should wait for it, respect it, and then negotiate in good faith. If the special votes tilt the balance, as they often do, Labour, the Greens and Opportunity should be ready, with a credible plan, to offer New Zealand a government that reflects how most people actually voted.

This is an opinion column.

Sources: 1News (Justin Hu), "It's time: Four election scenarios that could play out tomorrow", 26 November 2026; 1News (Justin Hu), "Close election races hold key to govt, but waiting game may still go on", 25 November 2026; interest.co.nz (Anna Whyte), "The wait begins as Opportunity knocks, as election 2026 delivers upsets, overhangs and a three week question mark", 8 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-final-count-special-votes-respect-the-result-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'kainga-ora-manderson-grove-sale-pause-state-house-sales-2026',
    publishedAt: '2026-11-25T21:25:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Kāinga Ora is selling a street of state homes to land bankers. The next government should stop it`,
    summary: `Homes in Lower Hutt's Manderson Grove are being marketed for land banking while 339 local households wait for public housing. Sales should be paused and the programme reviewed.`,
    body: `In Lower Hutt, almost an entire street of state houses is up for sale. According to B2B News on 25 November, Kāinga Ora has put homes in Manderson Grove on the market through Bayleys, with about 80 bedrooms between them. The marketing pitches them for investment, development and land banking. Buyers can take one house or the lot, and bids close on 8 December.

At the same time, B2B News reports, 339 households were on the public housing waitlist in Lower Hutt as at September.

Those two facts sit very uncomfortably side by side. While the country waits for a final election result, the next government should put a hold on sales like this one and review the whole programme.

A pattern, not a one-off

Manderson Grove is not the first. In October, ten community and church organisations, including Wellington City Mission and Renters United, wrote an open letter asking Kāinga Ora to halt the sale of 36 empty state homes on Nuku Street in Strathmore, Wellington, CathNews New Zealand reported on 20 October. The deadline sale fell about two weeks before the election. CathNews, citing other reporting, said more than 600 Wellington households were waiting for public housing.

Kāinga Ora's own figures show how steady the selling has become. Its property sales page, as at 20 November, lists 82 Wellington-region properties currently for sale and 48 sold there in the past 12 months. In Auckland, 244 have been sold in the past year; in Canterbury, 120.

B2B News reports that in Christchurch nearly 150 homes have been sold since July 2025 for at least $65 million, with a net loss of 86 public housing units in the second half of 2025.

Why this matters

Kāinga Ora is the country's biggest landlord, and for many families it is the only landlord they can afford. Every house sold into the private market is a house that will not be available the next time a family is put up in a motel or a car.

The argument that each sale funds a new build elsewhere sounds tidy. But it depends on the new homes actually being built, in the places where people need them, at the pace the waitlist demands. Housing advocate Vanessa Cole of Public Housing Futures said earlier this year that about 3,500 planned homes had been cancelled, B2B News reports. When pipelines shrink while sales continue, the net effect on families waiting is hard to see as anything but negative.

Marketing public homes as a land-banking opportunity also sends the wrong message. Land banking means buying land and holding it while values rise. Public land is a long-term asset. Selling it to people whose business model is to wait is the opposite of what a housing crisis calls for.

What the next government should do

Labour, the Greens and The Opportunity Party have all argued for more public and affordable housing, not less. Whoever forms the next government, there are three sensible steps.

First, pause sales of homes that could be repaired or redeveloped for public housing, particularly in areas with long waitlists like Lower Hutt and Wellington.

Second, publish a clear rule: no net loss of public homes in any region where the waitlist is growing. If a house is sold, its replacement should be built nearby, and the public should be able to check.

Third, look again at how redevelopment is judged. A site that does not pay its way on a narrow financial test may still be the cheapest way to house a family over thirty years once motel bills and health costs are counted.

The government's case

Kāinga Ora says the homes it sells do not meet its long-term needs. According to B2B News, it sells about 900 homes a year, roughly 1 per cent of a portfolio of about 78,000, and replaces or renovates around 2,000 a year. It says homes have sold on average 5 per cent above market value and that proceeds are reinvested. On Strathmore, regional director Sarah Willson said "it was not financially viable to deliver new social housing there", CathNews reported. Chris Bishop, as housing minister, called the programme "sensible asset management" and said overall supply was still growing, B2B News reports. Some economists also argue the Manderson Grove sale is not classic land banking.

The bottom line

Selling a street of public homes while hundreds of local families wait is a choice, not a necessity. The next government should stop it, count the homes, and make sure that public housing in New Zealand grows rather than quietly shrinks.

This is an opinion column.

Sources: B2B News, "Kāinga Ora pitches Lower Hutt street to land bankers", 25 November 2026; CathNews New Zealand (from RNZ reporting), "Church group calls for halt of capital state housing sale", 20 October 2026; Kāinga Ora, "Property sales" (data as at 20 November 2026), page updated 16 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/kainga-ora-manderson-grove-sale-pause-state-house-sales-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-inflation-4-9-per-cent-power-bills-not-rate-pain-2026',
    publishedAt: '2026-11-25T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Australian inflation has hit 4.9 per cent. Cut power, fuel and housing costs instead of piling on rate pain`,
    summary: `Electricity prices are up 25 per cent in a year as last year's rebates drop out of the figures. Direct help on the costs driving inflation would do more than higher interest rates.`,
    body: `Australian inflation has jumped again. The Australian Bureau of Statistics reported on 25 November that "CPI annual inflation was 4.9 per cent in the 12 months to October 2026", up from 4.3 per cent in September. That is the highest rate since 2023, according to CommBank's analysis published the same day.

Behind that number are households paying a lot more for the basics. The fix should not be another round of pain through interest rates. It should be targeted help on the costs that are actually driving prices up.

Where the rises are

The biggest drivers are things people cannot easily cut back on. The ABS figures show transport prices up 10.6 per cent over the year and housing up 6.4 per cent. Within those, CommBank reports electricity up 25.2 per cent over the year, new home building costs up 5.1 per cent and rents up 3.5 per cent. Fuel prices rose 6.3 per cent in October alone, CommBank says, after big rises in August and September.

Food and non-alcoholic drinks were up 3.5 per cent, the ABS says. Underlying inflation, measured by the trimmed mean, rose to 3.8 per cent from 3.6 per cent.

The power bill problem

The electricity number needs explaining. CommBank economist Trent Saunders said the jump "mainly reflected the large fall in electricity prices in October last year", when households received extra government rebates. In other words, the rebates held bills down last year, and now that support has wound back, the annual comparison looks dramatic.

That does not make the pain any less real. A household that relied on the rebate is now paying the full bill. But it does tell us something useful: direct help on power bills worked. When the rebates were there, measured inflation was lower and families had more breathing space.

The lesson is not that support should be withdrawn because it shows up in the statistics later. It is that temporary help is not enough. Households need power bills that stay lower, which means faster investment in cheap renewable generation, help for renters and low-income homeowners to install solar and batteries, and stronger action on energy retailers who keep loyal customers on poor deals.

Interest rates are a blunt tool

CommBank notes the Reserve Bank lifted the cash rate to 4.85 per cent on 3 November. Rate rises work by squeezing spending across the economy, and they land hardest on people with mortgages and on renters whose landlords pass costs on. They do nothing to make petrol, power or building materials cheaper.

If inflation is being driven by fuel, electricity and housing costs, then the most effective response is to tackle those costs directly. That means more public and community housing to take pressure off rents, support for efficient and electric transport so families are less exposed to petrol price spikes, and a sharper look at whether price rises in concentrated markets are justified.

The other side

There is a fair counter-argument that government spending, including rebates, can add to demand and make the Reserve Bank's job harder. CommBank also notes that the end of card surcharges on 1 October gave October prices a temporary push, and that the bank expects the Reserve Bank to hold rates at its December meeting. Those points deserve weight: not every part of this rise will last.

The bottom line

A 4.9 per cent inflation rate is a real hit to household budgets. The answer is not to wait for higher interest rates to grind demand down. It is to bring down the specific costs, especially power, fuel and housing, that are hurting ordinary Australians most.

This is an opinion column.

Sources: Australian Bureau of Statistics, "Consumer Price Index, Australia, October 2026", 25 November 2026; CommBank Newsroom, "Inflation hits 4.9%, its highest since 2023, as fuel, power and building costs climb", 25 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-inflation-4-9-per-cent-power-bills-not-rate-pain-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'maori-seats-not-a-bargaining-chip-referendum-2026',
    publishedAt: '2026-11-24T21:30:00.000Z',
    category: 'editorial-view',
    title: `Opinion: The Māori seats are not a bargaining chip. Abolition must stay off the table`,
    summary: `ACT says it may seek a binding referendum on scrapping the seven Māori electorates in talks with National and NZ First. The overhang has a simple fix that does not tear up an arrangement that has stood since 1867.`,
    body: `Every negotiation needs a price, and ACT appears to have found one. Days before the final count, its leader David Seymour has floated a binding referendum on abolishing the seven Māori electorates, and says it may well become part of what his party asks for in exchange for supporting a National-led government.

It is the wrong answer to a real problem, and it should be ruled out before anyone sits down to sign anything.

What ACT is proposing

According to 1News on 24 November, Mr Seymour wants the Māori seats scrapped through a binding referendum, and argues the seats are behind the large overhang projected in the new Parliament. Any vote would need to be held by November 2027 for a change to apply at the 2029 election. Speaking on RNZ's Midday Report the same day, as reported by Te Ao Māori News, he said ACT might push for the referendum in coalition talks, adding: "we may well do that."

1News reported that NZ First also supports a binding referendum on the seats, and that ACT's 2022 policy described them as an anachronism. Mr Seymour, who is Māori and enrolled on the general roll, told 1News the seats were "the proximal cause of the current overhang".

The overhang is real. Fixing it is easy

There is no dispute that this election produced an awkward result. On preliminary figures reported by 1News, Parliament will have 131 seats, 11 more than the usual 120. According to the RNZ report carried by Te Ao Māori News, National holds seven overhang seats and Te Pāti Māori four.

Look at those two numbers again. The largest share of the overhang belongs to National, which won more electorates than its party vote entitled it to. 1News reported that Labour narrowly won the preliminary party vote, 29.4 per cent to National's 29.2 per cent, yet National is projected to hold 42 seats to Labour's 36. If the goal were simply to make Parliament match the party vote, the first question would be about how electorate wins are counted, not about who gets to vote in which electorate.

Te Pāti Māori ran a candidate-only campaign. Its party vote fell to about 0.6 per cent while it won five electorates, 1News reported. You can argue that tactic stretched MMP. Many people did, and a group of 46 academics and experts has urged party leaders to change the rules so overhangs stop happening, according to RNZ's report in the Otago Daily Times. But the fix they are talking about is a change to how overhang seats are treated. It does not require removing anyone's representation.

That is also Te Pāti Māori's answer. As reported by 1News, the party says the right is blaming the seats for its own failed overhang campaign, and that the remedy lies in the overhang rule itself.

The seats are about more than arithmetic

The Māori electorates have existed since 1867. They are one of the ways the Crown has given practical effect to its relationship with Māori under Te Tiriti o Waitangi. Te Pāti Māori co-leader Debbie Ngarewa-Packer told 1News that removing the seats would breach Te Tiriti. The party's response, carried by Te Ao Māori News, is that the seats are part of how the Crown meets its Treaty obligations.

Whatever view anyone takes of that argument, it is not one that should be settled as a side deal in a coalition agreement struck behind closed doors. A party that won a modest share of the vote should not be able to put the representation of hundreds of thousands of Māori voters on the table as the price of its support.

Nor is it a decision for a simple majority of the wider population to impose on a minority. The whole point of the Māori roll is that Māori voters choose for themselves whether to be on it. Every five years, at the Māori Electoral Option, they make that choice. That is the right place for this decision to sit: with the people the seats belong to.

It may not even work for the right

There is a practical problem with ACT's plan too. Political scientist Dr Lara Greaves of Victoria University of Wellington, one of the 46 signatories, told RNZ that about 90 per cent of party votes in the Māori electorates go to left-bloc parties. She cited pollster David Farrar's figures suggesting National could have lost between nine and 14 seats had the Māori seats been abolished before this election, because Māori voters would move onto the general roll in electorates such as Northland, Rotorua and the East Coast. "Strategically, it could be quite a silly move for them," she told RNZ.

Dr Greaves also warned of significant protest if the seats were removed. Anyone who remembers the hīkoi against the Treaty Principles Bill should take that seriously. New Zealand does not need another three years of division staged for political advantage.

What the left should say now

Labour, the Greens and The Opportunity Party should be clear before the final count on Friday: they will not support any referendum on abolishing the Māori seats, and they will support a straightforward change to the overhang rules so that the size of Parliament reflects the party vote. That is a fix that deals with the problem everyone has noticed, without making Māori representation the scapegoat.

Labour, with the largest preliminary party vote, has a particular responsibility here. The party has long counted on the support of Māori voters. It should say plainly that their seats are not up for negotiation, whoever forms the government.

The government's case

ACT's case, as put by Mr Seymour to 1News, is that a separate roll creates division, that every citizen should have an equal vote in the same kind of electorate, and that any change would only happen if voters approved it in a binding referendum. He told RNZ he could not see what purpose a separate Māori roll now serves. NZ First shares the referendum position. Those are arguments that deserve a fair hearing in a proper national conversation, led by Māori, not a clause in a coalition document.

The bottom line

The overhang is a technical problem with a technical solution. The Māori seats are not a technical problem. They are part of the deal at the heart of this country. National should rule out any referendum on abolishing them as a condition of forming a government, and the parties of the left should make clear they will defend them.

This is an opinion column.

Sources: 1News Reporters, "ACT calls for Māori seats to go as MMP overhang fight heats up", 24 November 2026; Te Ao Māori News / RNZ Midday Report, "ACT eyes referendum on abolishing Māori seats in coalition talks", 24 November 2026; Otago Daily Times / RNZ (Tuwhenuaroa Natanahira), "Māori seat referendum could backfire on right bloc - political expert", 24 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/maori-seats-not-a-bargaining-chip-referendum-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-lng-terminal-wrong-bet-shelve-it-2026',
    publishedAt: '2026-11-24T21:25:00.000Z',
    category: 'editorial-view',
    title: `Opinion: A billion-dollar LNG terminal is the wrong bet for New Zealand's electricity. Shelve it for good`,
    summary: `The Taranaki LNG plan was parked before polling day and still awaits a final call. Cheaper, cleaner ways to cover dry years already exist, and New Zealand should take them.`,
    body: `One of the most expensive energy decisions in years is sitting in a drawer in Wellington, waiting for whoever forms the next government. It should stay there.

The plan is to bring liquefied natural gas into Taranaki so New Zealand has extra fuel for power stations in dry years, when the hydro lakes run low. Port Taranaki says the government confirmed in October that it would not sign a contract before the 7 November election, and that a decision is now expected after a new government is formed. The preferred provider's identity has not been made public, the port says, because it is commercially sensitive.

How we got here

The case for the terminal grew out of the winter of 2024. As The Spinoff's Joel MacManus explained on 21 October, wholesale electricity prices that winter averaged about $820 per megawatt hour, against roughly $180 in previous winters. It was a genuine shock for businesses and households.

But the answer the government chose is costly. A feasibility study by the big power companies and Firstgas put construction at upwards of $1 billion and running costs at up to $210 million a year, The Spinoff reported. When Energy Minister Simon Watts announced the plan in February, he told interest.co.nz the cost would be "north of a billion dollars". The terminal would supply about 12 petajoules over a winter.

The first plan was to fund it with a levy of $2 to $4 per megawatt hour on electricity. Consumer NZ estimated that at $15 to $30 a year on most power bills, according to The Spinoff, while the Taxpayers' Union put it at $40 to $90 per household, interest.co.nz reported. The levy was later dropped, and the Ngāmotu Advocate reported in October that the plan shifted to industry paying, leaving the power companies unhappy.

There are better options

The people who know the electricity system best are not convinced. Meridian chief executive Mike Roan told a select committee in May that the terminal was not necessary for electricity, The Spinoff reported. A Sapere report for Rewiring Aotearoa pointed to alternatives such as diesel backup and more renewables.

The four big generators, Genesis, Meridian, Mercury and Contact, put forward their own package to cover dry years: making the most of the Huntly power station, better use of hydro storage, a new peaking plant, more flexible demand from big industrial users, and greater use of gas storage, according to the Ngāmotu Advocate.

Parliamentary Commissioner for the Environment Simon Upton warned that the plan risked "the worst of both worlds", meaning higher emissions and higher costs, The Spinoff reported. That is the heart of the problem. Port Taranaki notes that around 60 per cent of our electricity already comes from hydro and about 30 per cent from other renewables. Locking in a billion-dollar fossil fuel facility for more than 15 years, as interest.co.nz reported, is a bet against the direction the system is already moving.

Where the parties stand

Labour, the Greens and The Opportunity Party all oppose the terminal, according to The Spinoff. Labour leader Chris Hipkins has said Labour would not go ahead with the facility. That is the right call. The money is better spent on storage, demand response and more renewable generation, which protect households in dry years without tying the country to imported fossil gas.

The other side

Supporters argue the terminal is insurance. Mr Watts told interest.co.nz it would cut wholesale prices and protect around 2,000 jobs, with benefits the government put at about $265 million a year. Gas Industry Co chief executive David Prentice called it critical to energy security, and Pan Pac said it would help keep the company in New Zealand, The Spinoff reported. Those concerns about industrial users are real, and any alternative plan must answer them.

But insurance should not cost more than the risk it covers. A billion-dollar gas terminal that may sit idle in wet years, while adding to emissions in dry ones, is not prudent planning. Whoever forms the next government should shelve it for good and back the cheaper, cleaner plan the industry has already put on the table.

This is an opinion column.

Sources: The Spinoff (Joel MacManus), "The government's controversial plan to build an LNG terminal in Taranaki, explained", 21 October 2026; interest.co.nz (Mandy Te), "LNG import terminal could be operating as soon as 2027 or early 2028", 9 February 2026; Ngāmotu Advocate (Richard Woodd), "Importing LNG stalled: what happened and what comes next?", 6 October 2026; Port Taranaki, "LNG at Port Taranaki", accessed 25 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-lng-terminal-wrong-bet-shelve-it-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'cop31-antalya-failure-australia-no-new-coal-gas-2026',
    publishedAt: '2026-11-24T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: The Antalya climate talks failed with Australia in the chair. Credibility starts with no new coal and gas at home`,
    summary: `COP31 ended on 22 November without an agreed deal after Australia co-led the talks. If Canberra wants to be taken seriously on fossil fuels, it has to stop approving new coal and gas projects.`,
    body: `Australia wanted COP31 to show the world, and the Pacific, that it had become a serious climate partner. Instead, the talks in Antalya ended without an agreed deal, and the final week of Parliament has opened with that disappointment hanging over the Albanese government.

What happened

According to UN News, COP31 in Antalya, Türkiye, closed on Sunday 22 November without a climate pact, after two weeks of talks and two days of overtime. Language on fossil fuels was the main sticking point. Several countries formally objected to the final text, and COP31 President Murat Kurum said that because there was no agreement on it, the decisions had not been adopted.

Australia was not a bystander. Under the arrangement agreed in Belém last year, Türkiye hosted COP31 and Australia's Climate Change and Energy Minister Chris Bowen served as President of Negotiations, as law firm Clayton Utz explained on 4 November. UN News reported that compromise drafts were circulated by the co-presidents, Australia and Türkiye.

The European Union said it could not accept a text that left out fossil fuels, UN News reported. The Marshall Islands, one of our Pacific neighbours, said accepting the text would amount to a betrayal of its people. UN Secretary-General António Guterres said he was deeply disappointed, and put it plainly: "There is no ambiguity in the science."

On 24 November, the ABC's 7.30 described a government under pressure on several fronts, including deep disappointment at the COP31 talks and the affordability crisis.

Why this lands at home

The failure was not Australia's alone. Consensus rules give any determined country a veto. At COP30 in Belém last year, SBS reported, Saudi Arabia, Russia and others treated any mention of fossil fuels as off limits. But Australia's ability to lead was weakened by its own record. Clayton Utz noted that while renewables generated more than half of Australia's power by the end of 2025, the country continues to approve new gas and expanded coal projects, and that this remains a point of criticism.

It is hard to ask the world to move away from coal, oil and gas while signing off on more of them. At COP30 last year, Australia was one of about two dozen countries to sign the Belém Declaration on the Transition Away from Fossil Fuels, SBS reported. That signature has to mean something in Australian approvals, not only in conference halls.

The Pacific is watching too. Clayton Utz reported that more than US$5 billion of over US$16 billion committed to the Pacific for climate action since the Paris Agreement remains undisbursed. Our neighbours need that money delivered, not announced again.

What should change

Antalya shows why new coal and gas approvals have to end. A credible plan would stop new fossil fuel project approvals, put the 2035 target of a 62 to 70 per cent cut below 2005 levels on a firm path, and speed up the money Australia and others have promised the Pacific. That would give Australia something solid to bring to the next round of talks.

There is also a cost-of-living case. Every extra dollar of clean, cheap renewable power and home electrification takes pressure off household bills. Climate action and affordability are not rivals.

The government's case

Mr Bowen and the government can fairly say they took on a hard job, that consensus was blocked by countries determined to resist fossil fuel language, and that Australia's renewable share has grown quickly. Gas is still used to firm the grid and supports jobs in some regions. Those points are real. But leadership abroad is easier when the record at home matches the words, and right now it does not.

This is an opinion column.

Sources: UN News, "COP31 ends without climate pact as UN chief warns there is 'no ambiguity in the science'", 22 November 2026; Clayton Utz (Brendan Bateman), "COP31 in Antalya – Australia takes the gavel at the 'Implementation COP'", 4 November 2026; ABC News (7.30), "Federal government under pressure over COP31 and cost of living", 24 November 2026; SBS News (Cheyne Anderson), "The two words missing from the world's most important climate conference agreement", 22 November 2025.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/cop31-antalya-failure-australia-no-new-coal-gas-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'foodstuffs-break-up-coalition-talks-act-veto-2026',
    publishedAt: '2026-11-23T21:30:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Most of the new Parliament wants to fix the supermarket duopoly. One party should not be allowed to veto it`,
    summary: `National, NZ First, Labour, the Greens and Opportunity all campaigned on taking on the grocery giants. As coalition talks continue, ACT says it will fight a Foodstuffs break-up. Shoppers deserve better than a deal that quietly drops the one thing most parties agreed on.`,
    body: `There are not many things the parties in New Zealand's new Parliament agree on. Fixing the supermarket market is one of them. That is why the latest news from the coalition talks should worry every household that has winced at the checkout this year.

According to a NZ Herald report by Michael Sergel, summarised in Bryce Edwards' Democracy Project briefing on 23 November, National is holding firm on its plan to break up Foodstuffs, and ACT is vowing to fight it. The briefing reports that ACT leader David Seymour told Newstalk ZB he would oppose the policy even if it worked, because of the signal it would send to investors.

Read that again. A party that will hold a small share of the seats is saying it would block a policy that might lower grocery prices, not because it would fail, but because of how it might look to business. That is not a reasonable position to bring into coalition talks. It is a veto on the cost of living.

What the parties promised

During the campaign, the parties set out very different plans, but the direction was clear. Consumer NZ's guide to the parties' grocery policies, published on 1 October, laid them side by side.

Labour would ban excessive prices on essentials such as food, fuel, power, banking and insurance, with penalties and repayment of excess profits. It would also force Foodstuffs and Woolworths to run their wholesale arms separately from their supermarkets, so independent grocers get a guaranteed right to buy on fair terms, as 1News reported on 20 September. Labour leader Chris Hipkins pointed to the Telecom split under Helen Clark as the model.

The Greens would require the two big players to sell 120 stores and two distribution centres into public ownership to create KiwiMart, a public competitor. They also back an excessive-pricing ban and a pricing accuracy code with automatic compensation for shoppers who are overcharged, according to Consumer NZ.

The Opportunity Party put the most weight on making the Commerce Commission stronger and more independent, with the powers and funding to pursue the break-up of the duopoly through the High Court, Consumer NZ reported.

NZ First wants Foodstuffs split into two competing co-operatives. National, as 1News reported on 16 September, would amend the Grocery Industry Competition Act within 100 days, give the Commerce Commission six months to test separation, and legislate only if the Commission recommends it.

So Labour, the Greens, Opportunity, NZ First and National all went to voters promising to intervene in some form. ACT went the other way. In a 1News report on 28 September, Mr Seymour called the break-up proposals "insane" and argued the real barrier to new supermarkets is government red tape. His party's plan was a one-stop consenting process for new stores and accepting food labelled for UK, EU and US rules without relabelling.

Why it matters at the till

This is not an argument about abstract market theory. The Commerce Commission's 2022 grocery market study called out excessive profits, Consumer NZ noted, and four years later the Commission's latest review of the wholesale market still found competition weak on price, range and access.

The MBIE-commissioned modelling by Sense Partners, reported by 1News on 16 September, estimated prices about 3.5 per cent lower on average in the first year after a separation. It put household gains at between $110 and $730 in the first year, rising to $200 to $1,320 a year by 2035, depending on income and family type. Its central estimate was a net benefit of $2.9 billion over 20 years.

Those numbers are contested, and that is fair. A Foodstuffs-commissioned peer review by HoustonKemp, reported by RNZ's Giles Dexter on 1News on 4 October, argued the benefits looked too good to be true and questioned assumptions about costs. On the other side, the same report noted that the Sense Partners work had been peer-reviewed by former UK Competition Commission chief economist John Davies and by Motu.

That is exactly why the right answer is to let an independent regulator test the options properly, rather than letting one minor party kill the idea before the evidence is in. Consumer NZ's Jon Duffy made the point in the Herald report, as summarised by the Democracy Project: he does not think it is "particularly democratic" for one party to block it.

The centre-left case

Our view is that Labour has the strongest overall plan. A ban on excessive prices goes after the problem shoppers actually feel. Separating wholesale from retail gives independent grocers, the dairies and the regional stores, a fair shot at stock and prices. It is also less disruptive than tearing a co-operative in half, and it builds on a model New Zealand has used before with telecommunications.

The Greens' KiwiMart is bolder, and it would give families a public option in the same way Kiwibank did for banking. Opportunity's emphasis on a stronger, better-funded Commerce Commission is the backbone any reform needs: without a regulator with real teeth, every promise ends in another review. As Mr Hipkins put it in September, "New Zealanders can't eat a review."

The government's case

National's position deserves to be stated fairly. Its finance spokesperson Nicola Willis has said she does not want politicians making decisions that belong to the Commerce Commission, and National's plan only legislates if the Commission recommends a split. ACT argues that splitting a complex business would add costs, discourage investment and deter new competitors, and that faster consents for new stores are a quicker fix. Foodstuffs says losing shared infrastructure could raise costs through separate warehousing and technology, Consumer NZ reported. Those are real concerns, and any reform should be designed so the savings reach shoppers rather than disappearing into restructuring costs.

What should happen now

Whatever shape the next government takes, the supermarket promise must survive the talks. If National forms a government, it should not trade away its own flagship cost-of-living policy to keep ACT on board. If a centre-left arrangement emerges, Labour, the Greens and Opportunity should make an excessive-pricing ban, a wholesale split and a stronger Commerce Commission bottom lines.

Most voters backed parties that promised to take on the duopoly. A deal that quietly drops that promise would be a betrayal of the people standing in the checkout queue.

This is an opinion column.

Sources: The Democracy Project (Bryce Edwards), "News Briefing: 24 November 2026", 23 November 2026 (summarising NZ Herald, Michael Sergel, "Foodstuffs break-up: National holds firm as Act vows to fight plan"); 1News (Justin Hu), "National to 'pursue' Pak'nSave and New World break-up", 16 September 2026; 1News (Justin Hu), "It's breakup season: Labour, National clash on tearing up grocery duopoly", 20 September 2026; 1News (Justin Hu), "ACT reveals supermarkets policy, decries 'insane' break-up proposals", 28 September 2026; Consumer NZ (Gemma Rasmussen), "Election 2026: How the main parties plan to improve the grocery sector", 1 October 2026; 1News/RNZ (Giles Dexter), "Foodstuffs-commissioned review criticises break-up modelling", 4 October 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/foodstuffs-break-up-coalition-talks-act-veto-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-child-poverty-bottom-line-coalition-talks-2026',
    publishedAt: '2026-11-23T21:25:00.000Z',
    category: 'editorial-view',
    title: `Opinion: One child in seven is going without. Child poverty must be a bottom line in the coalition talks`,
    summary: `New Zealand is officially off track for the child poverty targets written into law, and 47,500 more children fell into hardship in three years. Whoever forms the next government must put the Child Poverty Reduction Act back at the centre of the deal.`,
    body: `While the parties bargain over ministries and policy wins, there is a group with no seat at the coalition table: the 169,300 New Zealand children living in material hardship.

That figure comes from the Child Poverty Action Group (CPAG), which launched its Manifesto to Reduce Child Poverty on 27 August. CPAG says material hardship now affects 14.3 per cent of children, about one in every seven. For tamariki Māori and disabled children it is one in four. For Pacific children it is one in three. More than 350,000 children live in households CPAG describes as financially insecure.

The direction of travel is the real alarm. Citing the government's own Budget 2026 Child Poverty Report, CPAG says 47,500 more children fell into hardship over the past three years, and that New Zealand is now "officially off track" for the targets set in law.

A law both big parties signed up to

The Child Poverty Reduction Act 2018 set a goal of halving child poverty by 2028, with material hardship down to 6 per cent. According to CPAG, the leaders of both Labour and National reaffirmed that commitment in 2023.

It is worth remembering what happened when the law was taken seriously. The manifesto's lead author, Professor Emeritus Innes Asher of the University of Auckland, says child poverty fell between 2019 and 2022 because of deliberate policy changes. Those were years of a Labour-led government. The lesson is simple: child poverty moves when governments choose to move it.

On 17 October, CPAG and the New Zealand Council of Christian Social Services released a pre-election update, reported by Waatea News. It found hardship is now worse than when the Act was passed, despite the early gains. NZCCSS chief executive Alicia Sudden described children arriving at services in shoes that no longer fit. When the manifesto was launched, CPAG's executive officer Lyn Amos put it bluntly: "Child poverty is a political choice, not an inevitability."

What a serious plan looks like

CPAG's manifesto, written by 11 researchers and advocates and backed by groups including the Paediatric Society, Save the Children, KidsCan, the Nurses Organisation and the Council of Trade Unions, sets out a practical path.

On incomes: lift the minimum wage to the Living Wage, raise benefits and index them to wages, and replace Working for Families with a single, non-discriminatory Child Tax Credit. It also wants to remove poverty traps in which families can lose up to 96 cents of each extra dollar earned.

On housing: build 3,500 to 4,000 social homes a year and end no-fault evictions. On health: free GP and after-hours care for all children up to 18. On education: properly fund the Equity Index so schools in poorer communities get more.

These are the kinds of measures Labour, the Greens and the Opportunity Party should insist on in any negotiations they are part of. The 2018 Act was passed under a Labour-led government, and Labour has the track record of 2019 to 2022 to point to. The Greens have long campaigned on liveable incomes. Opportunity, if it ends up as a kingmaker, has a rare chance to make a child poverty commitment the price of its support. Any party that goes into government without one is choosing to let the 2028 targets fail.

The government's case

National and its partners argue that the best route out of poverty is work, and that a stronger economy, lower inflation and tax relief help families more than higher benefits. They point to the cost of welfare at a time of tight budgets. Getting more parents into good jobs does matter. But the figures CPAG cites show hardship rising over the last three years, not falling, and CPAG's own analysis, as reported by Waatea News, notes that child poverty has risen and fallen under governments of both colours. The difference is policy.

The ask

The coalition agreements will be written in the next few weeks. Every one of them should include a costed plan to get back on track for the 2028 targets, with progress reported to Parliament each year. One child in seven going without is not a number any government should be willing to sign off on.

This is an opinion column.

Sources: Child Poverty Action Group, "A Manifesto to Reduce Child Poverty (2026)", 27 August 2026 (citing the Budget 2026 Child Poverty Report); Waatea News (Matthew Tukaki), "One in Seven Children Living in Hardship: Poverty Groups Demand Urgent Action Ahead of Election", 17 October 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-child-poverty-bottom-line-coalition-talks-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-rental-affordability-crisis-rent-caps-public-housing-2026',
    publishedAt: '2026-11-23T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Australia's rent crisis is spreading to the regions. Canberra's rent guardrails show what works`,
    summary: `New SGS Economics figures reported by the ABC show rentals unaffordable for average households across much of Australia, with Perth the worst capital and regional Queensland the worst region. Rent increase guardrails, higher income support and a big public housing build should be the response.`,
    body: `If you rent in Australia, you already know the numbers are bad. New figures show they are getting worse in more places, and for more people.

The ABC on 24 November reported the latest SGS Economics and Planning Rental Affordability Index, which compares median rents with household incomes. A score under 100 means an average-income household is paying more than 30 per cent of its income in rent, the standard line for housing stress. Affordability has worsened or stayed at crisis levels across most of the country, in the cities and the regions.

Perth is now the least affordable capital, with average households paying more than 30 per cent of income on rent after rents soared following the pandemic. Hobart had the steepest fall over the past year. Regional Queensland is the least affordable region, with rent taking more than 32 per cent of the average renting household's income, and regional South Australia and Tasmania have also gone backwards.

For people on low incomes, the picture is brutal. In Sydney, the ABC reported, median rent takes 84 per cent of a single pensioner's income, and a single person on income support faces rent higher than their entire income. Childcare workers could spend nearly half their wage on rent. Jackson Hills of National Shelter, which commissioned the research, said the squeeze is now spreading to higher-income groups and outside the big cities.

The place that bucked the trend

There is one striking exception. The Australian Capital Territory is the most affordable capital. SGS principal Ellen Witte told the ABC this was down to higher incomes, more supply, and the fact that the ACT is the only jurisdiction to have put guardrails around rent increases.

That should end the argument that nothing can be done about rent rises. In the ACT, a landlord who wants to lift rent by more than a set benchmark linked to rental inflation has to justify it, as the Grattan Institute has described. It has not stopped people building or renting out homes there. Melbourne, second most affordable behind the ACT, has also benefited from Victorian policy changes and a push to build more homes, according to Ms Witte.

What should happen

The Australian Greens want a two-year rent freeze coordinated through National Cabinet, followed by a cap of 2 per cent every two years, enforced by a National Renters Protection Authority, plus a large public housing build through a public developer. At minimum, every state should adopt ACT-style limits on rent increases now. Renters cannot wait for supply alone to catch up.

Income support also has to rise. UNSW City Futures researcher Alistair Sisson told the ABC that capping rent increases, lifting income support and investing in public housing were all needed, noting that "Australia has comparatively very, very low levels of public housing". Mr Hills said there are no overnight fixes and that sustained investment over about 20 years is required. The Albanese Government's Housing Australia Future Fund is a start, but at this scale of crisis it needs to be much bigger, and Commonwealth Rent Assistance needs a substantial boost for those already priced out.

The other side

Critics of rent controls, including the Grattan Institute's Joey Moloney, argue a hard freeze could reduce the supply of rentals, discourage new building and make it harder for newcomers and people in crisis to find a home. Grattan instead backs the ACT model, a larger increase in Rent Assistance and more housing in established suburbs. Those are serious points, and they are a strong argument for well-designed guardrails rather than doing nothing. The ACT's results suggest limits on rent increases and new supply can work side by side.

Australia's renters are no longer only the young or the poor. They are nurses, childcare workers, pensioners and families in regional towns. The evidence of what helps is in front of us. Governments now need the will to act on it.

This is an opinion column.

Sources: ABC News (Madi Chwasta, Georgie Hewson, Jessica Riga, Simon Elvery and Emma Machan), "Rental affordability remains at crisis levels across Australia", 24 November 2026 (reporting the SGS Economics and Planning Rental Affordability Index, commissioned by National Shelter); Australian Greens, "Rent Freeze Now" campaign page, accessed 24 November 2026; Grattan Institute (Joey Moloney), "Why freezing rents would do more harm than good", accessed 24 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-rental-affordability-crisis-rent-caps-public-housing-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-dental-care-cost-free-public-dental-2026',
    publishedAt: '2026-11-22T21:30:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Four in ten adults are skipping the dentist because of cost. The next government must bring teeth into the public health system`,
    summary: `The latest New Zealand Health Survey shows cost now keeps 42.6 per cent of adults away from dental care. Labour, the Greens and Opportunity have all offered ways to fix it, and whoever forms the next government should start building free public dental care.`,
    body: `There is a strange line running through New Zealand's health system. Until your 18th birthday, the dentist is free. The day after, you are on your own. For a growing number of adults, that means not going at all.

The Ministry of Health's New Zealand Health Survey for 2025/26, released on 18 November, found that 42.6 per cent of adults had avoided seeing a dentist or dental worker in the past year because of the price, as reported by Newswire on 20 November. The survey interviewed 8,833 adults and 2,777 children face to face between July 2025 and July 2026. Stuff, running an RNZ report on 21 November, summed it up in a headline: half of Kiwi adults are skipping the dentist.

That is not a small group of people who have let things slide. It is close to half the adult population, and it includes working people, parents, pensioners and students. A problem that large is not a matter of personal choice. It is a gap in the system.

The cost of looking away

It is also not only about teeth. The same survey found that cost stopped 17.1 per cent of adults from seeing a GP, up from 10.2 per cent in 2020/21, according to Newswire's summary of the Ministry's release. When people cannot afford a check-up, small problems become big ones, and big ones end up in emergency departments that the public already pays for.

The campaign group Dental for All has tried to put a number on that. In a report produced by the consultancy FrankAdvice using Treasury's own cost-benefit tool, reported by RNZ on 4 November 2024, it estimated that the current system costs the country $2.5 billion a year in lost productivity and $3.1 billion in lost quality of life, including $103 million in sick days. The same RNZ report put the average dental visit at $353, a sum many households simply do not have spare in a tight month.

Current help is thin. Work and Income can pay up to $1,000 a year for immediate and essential dental treatment, as Pacific Media Network reported in March 2024, and RNZ noted that grants of this kind do not cover check-ups or cleaning. In other words, the state will help you once the tooth is already broken, but not to stop it breaking. That is the definition of an ambulance at the bottom of the cliff.

The Dental Association's chief executive, Mo Amso, told Pacific Media Network the funding approach was "a very poorly funded, ancient model that's not fit for purpose". When the dentists' own professional body says that, politicians should listen.

Three parties, three serious answers

The good news is that the centre-left parties have already done the policy thinking.

The Greens went into this election promising free, publicly delivered dental care for everyone, funded by new taxes on the wealthiest New Zealanders, as Waatea News reported on 29 July 2026. The WhichParty election guide records that the Greens would start with community care clinics in the areas of highest need. That is the right sequence: begin where the damage is worst, then build out.

The Opportunity Party has proposed free primary care for people under 30 through its "Teal Card", including free dental and mental health care for the same age group, according to WhichParty. Targeting young adults makes sense. It catches people at exactly the age they lose free care, and it builds habits that last a lifetime.

Labour campaigned in 2023 on free dental care for under-30s, to be expanded step by step, and its health spokesperson Ayesha Verrall told RNZ in 2024 that this remained party policy. Verrall put the principle well: "There's no logical reason why free healthcare stops at your teeth." Labour's 2026 health centrepiece was its Medicard, offering three free GP visits a year at a cost of $550 million funded from a capital gains tax, WhichParty reports. A Labour-led government should treat dental care as the natural next step from that card.

Te Pāti Māori, for its part, has proposed free primary care and dental care for whānau earning under $60,000, according to WhichParty.

Put those together and there is a clear path. Start with young adults, as Labour and Opportunity propose. Add low-income households, as Te Pāti Māori proposes. Build public community clinics in the highest-need areas first, as the Greens propose. Then extend cover over time until no adult in New Zealand has to choose between a filling and the power bill.

What it would cost

Nobody should pretend this is cheap. Dental for All's April 2026 proposal, reported by Rova on 23 April, estimated free adult care through a network of publicly owned community clinics would cost around $936 million a year, plus a one-off capital investment of $1.1 billion. Its 2024 report put the cost of a universal scheme at up to $2 billion a year, RNZ reported. Private dentists would keep operating under the proposal.

Those are real sums. But they need to be set against the billions in lost productivity and quality of life already being paid every year, just in a less visible way. Rova also reported Dental for All's polling showing more than eight in ten adults support bringing dental care into the public health system. This is not a fringe idea. It is a mainstream demand waiting for a government willing to act.

A phased approach also lets the workforce grow with demand. The campaigners themselves have called for more dental training places and more oral health therapists, Rova reported. Funding those places should begin in the first budget of the next government, because a clinic without staff helps nobody.

The government's case

The outgoing National-led government has argued that the health system needs to be fixed before new services are added. In 2024 Prime Minister Christopher Luxon pointed RNZ to an extra $17 billion for health over three years, and WhichParty notes National invested $447 million in primary care capacity in Budget 2025 instead of offering free GP visits. Finance Minister Nicola Willis has criticised Labour's Medicard as "free GP visits for millionaires", arguing help should be targeted. Those are fair questions about priorities and targeting, and any scheme should be designed carefully.

But after three years, the survey shows cost barriers to care rising, not falling. Fixing the system has to include fixing the part of the body the system leaves out.

What should happen next

Coalition talks are still under way and the official election result is due on 27 November. Whoever forms the next government, Labour, the Greens and Opportunity should make a first stage of public dental care a non-negotiable part of any deal they sign. A sensible first step would be free dental care for everyone under 30, a funded workforce plan, and the first public community clinics in the regions with the worst access.

New Zealand was a pioneer in free dental care for children a century ago. It can lead again. Four in ten adults staying away from the dentist because of cost is a choice the country has been making quietly for years. It is time to make a different one.

This is an opinion column.

Sources: Newswire, "NZ Health Survey 2025/26", 20 November 2026 (reporting the Ministry of Health release of 18 November 2026); Stuff/RNZ, "Half of Kiwi adults are skipping the dentist", 21 November 2026; RNZ, "Dental system costing NZ $2.5b a year in lost productivity, $103m in sick days - report", 4 November 2024; Pacific Media Network (Khalia Strong), "Almost half of NZ avoiding dentist due to cost", 5 March 2024; Rova (Rebekah Hunt), "'Filling the gap': Kiwi adults could all get free dental care with new proposal", 23 April 2026; Waatea News (Matthew Tukaki), "Greens put free dental care back on the table", 29 July 2026; WhichParty NZ, "Health policy: where NZ parties stand in 2026", accessed 23 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-dental-care-cost-free-public-dental-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'christchurch-enable-fibre-sale-keep-public-assets-2026',
    publishedAt: '2026-11-22T21:25:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Selling Christchurch's fibre network for a one-off payday would be a mistake the city cannot undo`,
    summary: `Christchurch councillors decide on Wednesday whether to put the sale of Enable, worth up to $1 billion, to the public as their preferred option. A rates cap should not push the city into selling a profitable public asset.`,
    body: `On Wednesday 25 November, Christchurch city councillors will decide whether selling Enable Networks, the city's fibre broadband company, becomes their preferred option for public consultation in the draft 2027 to 2037 long-term plan, Chris Lynch Media reported on 20 November. The case for selling is being made loudly. The case for keeping it deserves just as loud a hearing.

What is on the table

Enable was set up in 2007 and now operates as a regional broadband wholesaler. In the 2026 financial year it paid a $25 million dividend to Christchurch City Holdings, the council's investment arm, according to Chris Lynch Media. City Holdings has recommended selling its whole stake, while an independent review found a credible case both for keeping and for selling, and recommended the public be asked.

Finance committee chair Sam MacDonald backs a sale. He says it could raise about $1 billion, with roughly $500 million used to repay City Holdings debt and another $500 million placed in a professionally managed Future Fund. He estimates the council would borrow about $250 million less over a decade and save around $90 million in interest. "I want an iron fence around the Future Fund," he told Chris Lynch Media. The Press, as summarised by The Kākā on 20 November, reported that Deloitte valued Enable at $776 million as at 30 June.

The rates cap is doing the pushing

This debate does not come out of nowhere. The National-led government's proposed rates cap would limit council increases to between 2 and 4 per cent a year, the Otago Daily Times reported in December 2025. Christchurch's own modelling showed a 4 per cent cap would require rates in 2029/30 to be $80.3 million lower than planned. MacDonald told the ODT at the time: "I think the rates cap will help us have a conversation about Enable."

That is the problem in one sentence. A cap imposed from Wellington, without new funding for the infrastructure councils are expected to maintain, is steering cities towards selling the assets that earn them money. It is a short-term fix for a long-term squeeze.

Why keeping Enable is the better bet

First, a sale is permanent. Once a strategic network is sold, the city does not get it back, and future councils lose both the income and the say over how it is run. Fibre is not a luxury; it is the backbone that schools, small businesses, hospitals and people working from home now depend on.

Second, a promised "iron fence" is only as strong as the next council's vote. Future funds can be raided, rules can be rewritten, and a fund invested in markets rises and falls with them. An asset that has paid a steady dividend is not obviously worse than a pot of money whose protection depends on politicians not touching it.

Third, the public has spoken on this kind of question before. In the 2013 citizens-initiated referendum on central government asset sales, about two thirds of voters opposed selling shares in state power companies, according to the Electoral Commission's results. Labour and the Greens campaigned against those sales. The same principle applies locally: assets built with public money should not be sold to plug holes created by policy choices elsewhere.

Christchurch has also learned the value of what it owns. Mayor Phil Mauger has opposed selling Lyttelton Port, Orion and Christchurch Airport, the ODT reported. Enable belongs in the same category of long-term infrastructure, and People's Choice co-chair Paul McMahon was right to warn the ODT that chasing a sale is shortsighted.

The other side

Supporters of a sale make a serious argument. Paying down debt reduces interest costs, a Future Fund could spread returns across generations, and council chief executive Bede Carran has stressed that Wednesday's decision is about what to consult on, not a final call. Some councillors, such as Aaron Keown, say they would support a sale only if it stacks up financially. Those are reasonable positions, and the public should see the full numbers.

What councillors should do

Councillors should put both options to residents fairly, with independent figures on dividends, interest savings and the long-term value of the network. They should not present a sale as the preferred path simply because a rates cap makes the books harder to balance. And the incoming government in Wellington, whoever leads it, should rethink a rates cap that pushes councils to sell the family silver rather than giving them better ways to fund growth.

Christchurch rebuilt itself once. It should not now sell off one of the few modern assets it built for the long term.

This is an opinion column.

Sources: Chris Lynch Media (Kineta Knight), "Finance chair backs $1 billion Enable sale ahead of council debate", 20 November 2026; The Kākā (Bernard Hickey), "Early Bird", 20 November 2026, summarising The Press (Tina Law and Amber Allott), 20 November 2026; Otago Daily Times, "Could a rates cap mean asset sales?", 9 December 2025; Electoral Commission, 2013 citizens-initiated referendum results.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/christchurch-enable-fibre-sale-keep-public-assets-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-household-debt-stress-financial-counselling-2026',
    publishedAt: '2026-11-22T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Australians already feel like they are in a recession. The debt helplines are the warning light Canberra should not ignore`,
    summary: `Calls to the National Debt Helpline are up almost 12 per cent and more than four in ten callers have jobs. With interest rates at an 18-year high, the Albanese Government should protect financial counselling and renters in its December update.`,
    body: `Economists may argue about whether Australia is heading into a recession. Many households are not waiting for the official verdict. "It's as if we are in a recession but without that big, scary word," Queensland mother of three Crissy McDonald told the ABC in a report published on 20 November.

The numbers behind that feeling

The Reserve Bank lifted the cash rate by 25 basis points to 4.85 per cent on 3 November, its fifth rise this year and the highest level since 2008, SBS News reported. The board was split six votes to three. Unemployment has climbed to 4.9 per cent, its highest since the pandemic, and Roy Morgan polling shows consumer confidence at a seven-month low, the ABC reported on 20 November. Large employers including Bunnings, Canva, NAB, ING and Qantas have announced job cuts.

The ABC's 20 November report also noted that real GDP per person fell slightly in the March quarter before edging up in the June quarter. Even RBA governor Michele Bullock has acknowledged people will feel like it is a recession because they feel poorer, the ABC reported.

The warning light

The clearest signal comes from the front line. The National Debt Helpline, run by Financial Counselling Australia, handled 187,905 calls and chats in the 12 months to the end of August, up 11.76 per cent on the year before, the ABC reported on 4 November. The share of callers in mortgage stress rose from about 10 to 11 per cent to 14 to 15 per cent, and more than four in ten callers were in paid work.

Uniting Church spokeswoman Aileen Muldoon told the ABC: "we are seeing more people in paid work whose income is no longer sufficient". Roy Morgan estimates more than 1.82 million borrowers could be in mortgage stress after the latest rise, and a Canstar survey found 68 per cent of renters were worried about rent or living costs, the same ABC report said.

These are not people who have made reckless choices. They are workers, renters and small business owners caught between higher rates, higher rents and a softening job market.

What Canberra should do

Treasurer Jim Chalmers has said the government will look for further budget savings in December's mid-year update, SBS reported. Labor is right to take inflation seriously. But savings must not come from the services that keep families from falling over the edge.

First, guarantee multi-year funding for the National Debt Helpline and community financial counsellors. When demand is rising this fast, waiting lists are the last thing a family in crisis needs.

Second, give renters real help. A household that has just seen its rent rise sharply has no mortgage relief package to call on. A stronger Commonwealth Rent Assistance payment, and pressure on the states for national limits on how often and how much rents can rise, would do more for struggling tenants than any amount of talk about patience.

Third, keep the focus on jobs. If the RBA keeps raising rates, the government's job is to make sure the pain does not fall only on those with the least room to absorb it.

The other side

The Coalition's treasury spokesperson Tim Wilson argues that overseas conflicts cannot explain all of Australia's inflation, SBS reported, suggesting government spending is part of the problem. Economists are also divided on the outlook: Capital Economics' Abhijit Surya told the ABC Australia has not yet entered a per-person recession, and Oxford Economics' Ben May called a recession possible but not inevitable. Those are fair points, and spending should be well targeted.

But targeted support for people in debt stress is exactly the kind of spending that makes sense in a downturn. The debt helplines are telling Canberra something important. The mid-year update is the moment to show it is listening.

This is an opinion column.

Sources: ABC News (Hanan Dervisevic), "For these Australians, the recession has already arrived", 20 November 2026; ABC News (David Taylor and Nassim Khadem), "RBA's fifth rate hike a huge blow to mortgage borrowers", 4 November 2026; SBS News (Alexandra Koster), "RBA's Cup Day call takes rates to 18-year high; board divided over decision", 3 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-household-debt-stress-financial-counselling-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'mmp-overhang-131-seats-fix-before-2029-2026',
    publishedAt: '2026-11-21T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: An 11-seat overhang has pushed Parliament to 131 MPs. Fix MMP's weak spot before 2029, not after`,
    summary: `Forty-six electoral experts say the overhang now threatens the proportional heart of MMP. Labour, the Greens and Opportunity should make a fair, cross-party fix a condition of the next government, and National should stop hiding behind a routine review.`,
    body: `New Zealanders voted for proportional representation three times: in 1992, in 1993 and again in 2011. The deal was simple. The share of seats a party gets in Parliament should match the share of party votes it wins. This year that deal has been bent further out of shape than at any time since MMP began.

Preliminary results from the 7 November election show an overhang of 11 seats, pushing the House from its usual 120 members to 131, according to reporting summarised by Newswire on 18 November. RNZ's Russell Palmer reported the same day that seven of those extra seats belong to National and four to Te Pāti Māori. The official result is due on 27 November, after special votes are counted, so the exact numbers may still move. But the shape of the problem will not.

What the experts are saying

On 18 November, 46 legal, political and public policy experts published an open letter called "Keep the 'P' in MMP". It was led by Otago University law professor Andrew Geddis, political scientist Lara Greaves and researcher Max Rashbrooke, Stuff and RNZ reported. Their message was that the overhang now puts the proportionality of the whole system at risk, and that politicians must act before the next election.

Geddis described the current outcome, Newswire reported, as "Not really the way democracy is supposed to work". He also noted the clock is ticking: there are only three years before New Zealanders vote again.

The experts are careful not to blame only one side. As RNZ reported, Geddis said Te Pāti Māori's overhang came from a deliberate strategy of winning electorates while collecting few party votes, while National's was more of an organic result of holding many electorate seats as its party vote fell. The Spinoff's figures, cited by Newswire, show National won 42 electorates on a party vote that would have entitled it to about 35 seats, while Te Pāti Māori won five of the seven Māori seats with well under one per cent of the party vote.

Rashbrooke warned that, unless the rules change, parties could start engineering overhangs on purpose, turning future elections into an arms race of split-vote tactics. That is the real danger. Once one party benefits from gaming the system, every party is under pressure to copy it, and voters lose the clear link between how they vote and who governs.

Why this matters for fairness

Overhangs are not new. Newswire notes they followed the 2005, 2008, 2011, 2014 and 2023 elections. But they used to be one or two seats. An 11-seat overhang is different in kind. In a close election it can decide which bloc governs, even when the other bloc won more party votes.

The experts themselves drew the comparison with 1978 and 1981, RNZ reported, when National kept power under first-past-the-post despite Labour winning more votes. MMP was supposed to end that kind of result. It would be a bitter irony if MMP slowly drifted back towards it.

This is not about which party wins this particular count. A fair rule should be one you would accept whether it helps you or hurts you. That is exactly why Labour, the Greens and The Opportunity Party should champion it now, while the next government is still being formed.

The fix was recommended in 2012

None of this is a surprise. After the 2011 referendum kept MMP, the Electoral Commission reviewed the system and recommended in 2012 that overhang seats be abolished, as RNZ and Newswire both reported. Governments led by both National and Labour have since changed electoral law without acting on it. Labour should own its share of that failure, and then fix it.

The experts' letter sets out five options. Parliament could add list seats so the House grows to restore proportion; reduce the number of electorates; remove extra electorate seats from parties that win more than their party-vote share, as Germany now does, perhaps allowing one or two overhang seats; move to a single vote that counts for both electorate and party; or weight MPs' votes in the House by party-vote share. Each has costs. Geddis has said plainly that there is no perfect electoral system.

The German-style option is worth serious attention. It keeps the principle that party vote decides the size of each party's caucus, while still letting electorates choose a local MP. It would also take away the incentive to game the system.

The other side

National's position, as reported by The Spinoff and summarised by Newswire, is that the usual post-election review by the Electoral Commission and Parliament's Justice Committee is enough. ACT's David Seymour has said voters are entitled to use their two votes however they choose, and that is a fair point about voter freedom. Earlier this year Christopher Luxon said National would hold a referendum on MMP itself if re-elected, an idea NZ First, ACT, Labour and the Greens all opposed. Labour's Kieran McAnulty has warned that overhang tactics are likely to become permanent unless the rules change.

Those are real arguments, and they deserve a hearing. But a routine review that ends in a report on a shelf is how the 2012 recommendation was lost. And a referendum on scrapping MMP would be the wrong answer to a problem that can be fixed inside MMP.

What the next government should do

The experts want a dedicated select committee to work through the options quickly. That is the minimum. Labour, the Greens and Opportunity should go further and write a firm commitment into any coalition or confidence agreement: a cross-party process that reports within a year, followed by legislation in time for 2029.

They should also invite National, ACT, NZ First and Te Pāti Māori into that process. Electoral law works best when it is built across the aisle, so that the next change of government does not simply reverse it. Every party should sign up to one principle: no party should get more seats than its share of the party vote earns it.

Opportunity in particular has an opening here. A party that campaigns on evidence-based reform could make fixing the overhang one of its price-of-support items, whichever way it leans. Labour and the Greens should welcome that and back it.

The last word

MMP has served New Zealand well because voters trust that it is fair. That trust is earned one election at a time. An 11-seat overhang tells us the system has a hole in it, and that parties are learning how to drive through it.

The next government has three years to close that hole. If it waits for another review, it will have chosen to run the 2029 election on rules everyone already knows are broken.

This is an opinion column.

Sources: RNZ (Russell Palmer), "Experts call for urgent MMP reform over election overhang", 18 November 2026, as republished by Farmers Weekly; Stuff (Emma Ricketts), "46 electoral experts sign open letter calling for MMP reform", 18 November 2026; Newswire, "46 experts urge New Zealand politicians to fix the MMP overhang as Parliament grows to 131 seats", 18 November 2026; Electoral Commission, Review of the MMP voting system, 2012.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/mmp-overhang-131-seats-fix-before-2029-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-nurse-numbers-2100-claim-safe-staffing-2026',
    publishedAt: '2026-11-21T21:15:00.000Z',
    category: 'editorial-view',
    title: `Opinion: The "2100 extra nurses" line has collapsed. New Zealand needs safe staffing, not spin`,
    summary: `Health NZ's own figures show nursing numbers barely moved after the end of Labour's hiring drive, and the latest data arrived only after the election. The next government must fund vacancies and legislate safe staffing.`,
    body: `Throughout the campaign, voters were told the National-led government had hired 2100 extra nurses. Nurses on the wards knew it did not match what they saw on their shifts. The figures now tell the same story.

What the numbers show

AAP FactCheck examined the claim on 7 October and rated it misleading. Christopher Luxon told the TVNZ leaders' debate that "2100 extra nurses have been hired during my time in government". But AAP found National's figure was built by starting the count in September 2023, almost two months before the coalition took office. Almost all of the growth happened between 30 September 2023 and 31 March 2024, the tail end of a recruitment drive started under Labour.

From April 2024 to March 2026, AAP found, Health NZ added about 54 full-time-equivalent nurses. Health Minister Simeon Brown had conceded that 54 figure in Parliament in August.

Kai Tiaki Nursing New Zealand, the nurses' union magazine, reported in August that total nursing FTEs went from 29,404 in March 2024 to 29,458 in March 2026. At the time, Labour health spokesperson Ayesha Verrall said about 1,445 nursing vacancies were unfilled across Health NZ, many for two years, Kai Tiaki reported.

The latest figures, released only after the vote, do not change the picture. The Post's Andrea Vance reported this week, as summarised in Bryce Edwards's Democracy Project briefing of 20 November, that Health NZ added a net 117 full-time nurses in the year to June, for about 29,474 in total. The same report said Health NZ declined an urgent request to release the data before polling day, and that its "corporate and other" staff category grew by more than 3,100 FTEs since June 2024.

Why it matters

This is not a row about statistics. A nursing FTE that is never filled is a patient who waits longer for pain relief, a ward that runs short overnight, and a nurse who goes home exhausted and starts thinking about Australia. NZNO kaiwhakahaere Kerri Nuku told Kai Tiaki many nurses are under enormous pressure and considering leaving.

Voters were entitled to the best available figures before they voted. If Health NZ held workforce data until after the election, that is a problem for public trust, regardless of who governs. Official information should not run on a political timetable.

The government's case

National argues its 2100 figure came straight from Health NZ's quarterly workforce reports, using September 2023 as the baseline because it reflected the previous government, a spokesperson told AAP. Ministers also point to the large Health NZ deficit they inherited, which AAP reported was driven in part by unbudgeted nurse hiring that a Deloitte review linked to weak oversight. Brown has said there is more work to do and that he wants to progress nurse-to-patient ratios. Those are fair points: Labour's hiring surge was not well managed financially, and that should be acknowledged.

What should happen now

But you cannot fix a budget by leaving wards short. Labour, the Greens and Opportunity should make three commitments in any government they form.

First, fund and fill the long-standing vacancies, starting with graduate nurses. Kai Tiaki reported fewer than half of new graduates are being hired in each intake, while we recruit overseas.

Second, legislate safe staffing. Nurse-to-patient ratios work in Victoria and Queensland. If the minister supports progress on ratios, there should be cross-party room to get it done.

Third, require Health NZ to publish workforce data on a fixed schedule, election year or not, so no government can pick its moment.

Nurses held the health system together through a pandemic. They deserve honest numbers and enough colleagues on every shift.

This is an opinion column.

Sources: AAP FactCheck (George Driver), "Nursing workforce debate obscures Health NZ budget debacle", 7 October 2026; Kai Tiaki Nursing New Zealand (Joel Maxwell and Mary Longmore), "Government 'fudging' hiring figures as nurses face intense pressure", 11 August 2026; The Post (Andrea Vance), nurse workforce report, as summarised in the Democracy Project News Briefing, 20 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-nurse-numbers-2100-claim-safe-staffing-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'rnz-deficit-job-cuts-public-media-funding-2026',
    publishedAt: '2026-11-21T21:10:00.000Z',
    category: 'editorial-view',
    title: `Opinion: RNZ's $11.8 million hole should bring accountability at the top, not cuts to the newsroom`,
    summary: `New Zealand's public broadcaster faces 58 job losses after a deficit far larger than forecast and an overdraft set up without Crown approval. Staff and listeners should not pay for failures in management and oversight.`,
    body: `RNZ belongs to every New Zealander. When the power goes out in a storm or an earthquake hits, it is the voice people trust. So the news that the broadcaster will lose 58 jobs after an $11.8 million deficit should worry everyone, whatever their politics.

What we know

Stuff reported on 9 November that RNZ will cut 58 jobs, and that RNZ itself said its financial reporting for the year "did not accurately reflect" its real position.

An investigation by RNZ's Checkpoint team, republished by 1News on 20 November, set out more detail. The deficit was more than 25 times the roughly $470,000 loss that had been forecast. RNZ's annual report disclosed a $5 million overdraft set up without the Crown approval required under the Crown Entities Act, though no more than $2.3 million was drawn. The move to a new Auckland office ran $1.85 million over budget, and personnel spending was $3.2 million over.

The same report described a rift between senior executives, and questions about who approved spending, based on unnamed sources. Those claims are not proven, and an independent review ordered by the board should be allowed to test them. Chair Brent Impey briefed Media Minister Paul Goldsmith when the problems surfaced.

Who should carry the cost

Here is the core problem. The people losing their jobs did not set up the overdraft, approve the office fit-out or sign off the accounts. Reporters, producers and technicians are being asked to pay for failures that happened above them.

Governance expert Angus Ogilvie put it simply in the Checkpoint report: "If there were errors in the financial statements, that's a management issue." That responsibility runs to the board too. A Crown entity that breaks the rules on borrowing needs better oversight, not a smaller newsroom.

There is also a bigger question. RNZ has been running on tight funding for years while being asked to do more across radio, online and Pacific services. A public broadcaster that is always one bad year from cuts cannot plan for the long term.

The other side

The government's view is that RNZ must live within its budget like any Crown entity, and that taxpayers should not simply cover a deficit caused by poor management. RNZ's acting leadership says the cuts are needed to balance the books, and the board has ordered an independent review. Those are reasonable positions. Public money must be spent carefully, and nobody wants a bailout with no strings.

What should happen

But balance-the-books cuts are the wrong first step when the review has not yet reported. Labour, the Greens and Opportunity should press for three things.

First, pause compulsory redundancies until the independent review is finished and published in full, so decisions rest on facts.

Second, strengthen governance: require financial expertise on RNZ's audit committee and limit the use of non-disclosure agreements that keep the public in the dark. Employment lawyer Barbara Buckett told Checkpoint the difficulty arises when such agreements are used to suppress information.

Third, give public media multi-year funding that rises with costs, so RNZ is not forced into crisis cuts every time something goes wrong.

Strong public journalism is part of a healthy democracy, especially in a year when coalition talks will decide who governs. RNZ needs to get its house in order. It should not lose its voice while it does.

This is an opinion column.

Sources: Stuff, "RNZ to cut 58 jobs after $11.8 million deficit", 9 November 2026; RNZ Checkpoint (Craig McCulloch, Lisa Owen and Lee Taylor), "Fallout at RNZ: A leadership rift and the role of a Chief People Officer", republished by 1News, 20 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/rnz-deficit-job-cuts-public-media-funding-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-pay-equity-high-court-ruling-repeal-2026',
    publishedAt: '2026-11-19T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: New Zealand's High Court says the pay equity law discriminated against women. It has to go`,
    summary: `A judge has found the 2025 law that cancelled 33 pay equity claims unjustifiably discriminated on the basis of sex, and that saving money was the main driver. Whoever leads next must repeal it and restore a fair process.`,
    body: `For eighteen months, the women who care for our sick, teach our children and keep our public services running have been told that their pay equity claims were scrapped for their own good. This week the High Court said otherwise.

In a decision released on 19 November, Justice Paul Radich declared that the Equal Pay Amendment Act, which the National-led government passed under urgency in May 2025, is inconsistent with the New Zealand Bill of Rights Act, 1News political reporter Justin Hu reported. The judge found that the workers affected had been subject to unjustified discrimination on the basis of their sex.

That is a remarkable finding about a law that was supposed to make pay equity work better. It should change the conversation in every coalition room in Wellington.

What the 2025 law did

The facts are worth setting out plainly, because they were rushed through so quickly that many New Zealanders never saw them.

According to 1News, the law passed all three readings in a single day, with no select committee and no chance for the public to be heard. It cancelled 33 active pay equity claims, many of them years in the making. It raised the test for a female-dominated workforce from 60 per cent to 70 per cent, sustained for at least ten consecutive years. And it limited the comparisons claimants could draw to their own industry or sector.

That last change matters more than it sounds. The whole point of pay equity is to ask whether work done mostly by women has been undervalued compared with work of similar skill and responsibility done mostly by men. If you can only compare within a sector that is already dominated by women, you are measuring an undervalued job against other undervalued jobs. The test becomes much harder to pass, almost by design.

What the court found

Five unions representing health staff, teachers, public servants and tertiary education staff brought the challenge, 1News reported.

Justice Radich looked at the official papers behind the law and found nothing tangible showing that the old system was broken. Instead, he concluded that "the main driver was fiscal". He also found that the changes were not proportionate to their stated objectives.

In plain English: the government said it was fixing a flawed process, but the court found the evidence pointed to saving money, and that the way it did so discriminated against women.

The unions did not win every point. The court found that passing the law under urgency without consultation was lawful, and that cancelling the claims did not breach natural justice. That is important to note, because it shows this was a careful judgment, not a blanket win for one side.

A declaration of inconsistency also does not strike the law down. It stays in force. The Crown can still appeal. If the declaration stands, the Attorney-General must tell Parliament, and the government must give a formal response within six months, 1News reported.

Why this is a test for the next government

So the court has done its job. Now Parliament has to do its job.

The law cannot be quietly left on the books while the next government is formed. A statute that a senior judge has found discriminates against women on the basis of their sex is not a technical problem for officials to manage. It is a matter of basic fairness, and of whether Parliament respects the rights it wrote into law in 1990.

Labour, the Greens and Te Pāti Māori opposed the bill when it passed in May 2025, as the parliamentary record shows. That stand has now been vindicated by the High Court. Any government that Labour leads should commit, in its coalition agreement, to repealing the 2025 changes and restoring a fair pathway for the claims that were cancelled.

The Opportunity Party now holds the balance in many scenarios. According to 1News, it opposed the 2025 changes, but repealing them was not one of its five published bottom lines for coalition talks. The Public Service Association has called on Opportunity to take leadership on the issue and said no coalition deal should leave the law in place.

That is a fair challenge, and Opportunity should take it up. The party prides itself on evidence-based policy. Here is a court ruling that tested the evidence and found it lacking. If Opportunity wants to be the party of good process and honest numbers, it should insist that pay equity is restored in any agreement it signs, whichever side it talks to.

The real cost of "fiscal" decisions

It is worth remembering who sits behind the 33 cancelled claims. They are working people in health, schools, the public service and tertiary education, many of them the workers who held the country together during the pandemic and who are now being asked to do more with less in a stretched public service.

Pay equity is not a pay rise for its own sake. It is a correction for decades in which work done mainly by women was paid less simply because women did it. The previous system, built by consensus across Parliament, was slow and imperfect. But it was producing settlements, including the landmark care and support worker settlement of 2017 under a National-led government. Fixing its flaws was always possible. Scrapping live claims overnight was a choice.

When the court says that choice was driven by money, ordinary voters understand exactly what that means. Budgets were balanced, in part, by deciding that women's work could wait.

What should happen now

First, the caretaker government should not appeal this decision. Spending public money to defend a law that the High Court has found discriminatory, in the dying weeks of a government that may not be returned, would compound the original mistake.

Second, every party in coalition talks should state clearly whether it will repeal or fix the 2025 changes. Voters are entitled to know before any deal is signed.

Third, the next government should restore a proper process, with a full select committee, so that unions, employers and the public can design a pay equity system that is fair and affordable. Done properly, that is the opposite of what happened in May 2025.

The government's case

Outgoing Workplace Relations Minister Brooke van Velden said officials were carefully considering the decision, that the Crown must decide whether to appeal, and that because of that and the caretaker period she would not comment further, 1News reported. When it passed the law, the government argued that the old regime had the wrong settings, that claims were too easy to start and too costly and uncertain for taxpayers, and that the changes would make the system more workable.

Those concerns about cost and process deserve a serious answer. But the right answer was to consult, design and legislate carefully, not to cancel 33 live claims in a day. The court has now said, in effect, that saving money was not a good enough reason to treat women's work unequally.

The next government has six months, at most, to show it agrees.

This is an opinion column.

Sources: 1News (Justin Hu), "Govt's pay equity changes breached women's rights, High Court rules", 19 November 2026; New Zealand Parliament, Equal Pay Amendment Bill votes, May 2025.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-pay-equity-high-court-ruling-repeal-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-low-level-drug-charges-rise-2019-promise-2026',
    publishedAt: '2026-11-19T21:15:00.000Z',
    category: 'editorial-view',
    title: `Opinion: More New Zealanders are being charged for low-level drug use. The 2019 promise of help first is being broken`,
    summary: `A Drug Foundation report finds low-level drug charges at a ten-year high, with Māori charged at nearly five times the rate of non-Māori. Police should be chasing the gangs, not people caught with a pipe.`,
    body: `In 2019, Parliament made a sensible decision. Police were told not to prosecute people for possessing or using drugs unless a prosecution was required in the public interest, and to consider a health-centred response instead. New figures suggest that promise is quietly being broken.

A new report from the NZ Drug Foundation, "Drugs and the Justice System in Aotearoa", built from Ministry of Justice and Police data, found that more people were charged with low-level drug offences in 2025-26 than at any point in the past decade, 1News reported on 20 November.

The numbers

According to the report, 4230 people were charged in 2025-26 with drug possession or use as their most serious drug offence. In 960 cases, possession or use was the only charge. Sixty-two people were convicted solely for having a drug utensil, such as a pipe, the most in five years. Fifteen people were sent to prison for possession or use alone.

The share of cases ending up in court tells the story. After the 2019 law change, court proceedings fell to 18.9 per cent of cases in 2021. By 2025 they had climbed back to 43.2 per cent, higher than before the reform, according to the figures reported by 1News.

The burden is not shared fairly. Māori were charged at 4.8 times the rate of non-Māori and faced 47 per cent of all drug charges, despite making up about 15 per cent of the population aged 15 and over. Māori were more than half of those convicted for possession or use, and nearly 58 per cent of those imprisoned for it.

Young people are caught too. Over the past decade, 943 people under 25 were convicted for possession or use with no other charge.

Why this matters

The Drug Foundation's executive director Sarah Helm put it bluntly: "Punishing people for using drugs does not work – it makes things much worse." A conviction can follow a young person for life, closing doors to jobs, travel and housing, without doing anything to treat addiction.

Ms Helm also pointed to where the money goes. According to the foundation, around $334 million a year is spent on drug law enforcement, twice what is spent on prevention, addiction treatment and harm reduction combined. She noted that three people a week die from preventable accidental overdoses.

To be fair, the rise in court action began before the current government took office. The low point was 2021. But the caretaker government has spent three years promoting a tougher approach to crime, and the signal that sends to the front line is clear. Discretion that leans towards help has gradually given way to discretion that leans towards the courts.

What should change

Labour passed the 2019 reform. The Greens have long called for drug use to be treated as a health issue, and The Opportunity Party has argued for evidence-based drug policy rather than slogans. Together they should make this part of any coalition agreement.

The Drug Foundation's recommendations are a good starting point: remove criminal penalties for low-level possession and use; review the police instructions on the 2019 law and report regularly on how discretion is used; fund more Kaupapa Māori services; expand Te Pae Oranga iwi community panels and the Alcohol and Other Drug Treatment Courts; and move money from low-level enforcement to serious organised crime, treatment and harm reduction.

None of that is soft. It frees police to chase the gangs that profit from the drug trade, instead of processing people caught with a pipe.

The other side

Police see things differently. Detective Superintendent Greg Williams, director of the national organised crime group, told 1News that prosecutions are needed because transnational crime groups and gangs are operating in New Zealand, and that most people charged with possession also face other offences. He said around 8000 people were charged from July 2024 and more than 4000 of them were dealt with outside court. He welcomed expanding treatment courts, but disagreed that all funding should shift to treatment, and said a review should be considered but was hard to justify on one report.

Those are fair points, and police deserve the tools to tackle organised crime. But the figures for people charged with possession or use alone, and the stark overrepresentation of Māori, show the 2019 promise is not being kept. The next government should keep it.

This is an opinion column.

Sources: 1News (River Lin), "More people now being charged with low-level drug offences", 20 November 2026; NZ Drug Foundation, "Drugs and the Justice System in Aotearoa", as reported 20 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-low-level-drug-charges-rise-2019-promise-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-jobless-rise-jobs-first-plan-2026',
    publishedAt: '2026-11-19T21:10:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Australia's jobless rate has hit 4.9 per cent. It is time for a jobs-first plan, not more pain`,
    summary: `Unemployment jumped in October as 43,500 jobs disappeared, and households say it already feels like a recession. The Reserve Bank should hold off, and Canberra's December update must protect workers.`,
    body: `Australia does not have to be in a technical recession for it to feel like one. For a growing number of households, it already does.

Official figures released on 19 November showed the unemployment rate rose to 4.9 per cent in October, up from 4.7 per cent in September, ABC News reported. About 43,500 jobs disappeared in the month, when economists had expected a gain. Westpac described it as the highest jobless rate since the pandemic, and analysts at RBC noted that part-time jobs made up more than 90 per cent of the losses.

That follows a fall of more than 36,000 jobs in September, according to Westpac figures cited by the ABC. Two bad months in a row is not a blip.

People are already feeling it

ABC reporter Hanan Dervisevic spoke to Australians living through the squeeze. An Albury woman told of having about $50 to $60 a fortnight for groceries and fearing redundancy. A Queensland mother said her family's mortgage repayments now equal her husband's entire income. A Melbourne publican said customers were spending less.

Big employers including Bunnings, Canva, NAB, Bendigo Bank, ING and Qantas have announced job cuts, the ABC reported. Consumer confidence is at a seven-month low, according to a Roy Morgan poll.

Even Reserve Bank governor Michele Bullock has acknowledged the strain. After the bank lifted the cash rate to 4.85 per cent, she said conditions "are going to make people feel like it's a recession because they feel poorer", the ABC reported.

The lesson for the Reserve Bank

The cash rate has been raised five times in nine months, according to RBC analysis reported by the ABC. Inflation needed to be brought down. But the cost of that fight is now landing on workers, especially part-time and younger workers, who have the least room to absorb it.

The ACTU has warned against a sixth increase, and several bank economists now expect the Reserve Bank to hold. That is the right call. Australia should not try to cure inflation by pushing tens of thousands more people out of work.

What Canberra should do

Federal Labor will release its mid-year budget update in December. Finance Minister Katy Gallagher has promised sensible savings. Foreign Minister Penny Wong said: "We're a Labor government, we're always focused on jobs."

That focus now needs to show up in the numbers. The Australian Council of Social Service chief executive Cassandra Goldie has urged the government and the Reserve Bank to act together, noting that about a quarter of a million people have left paid work since 2022.

A jobs-first update would avoid cuts that fall on people who have just lost work, lift support for the unemployed so they can keep looking for work with dignity, and bring forward training and apprenticeship places so people can move into sectors that are still hiring, such as building, care and clean energy. Cutting spending into a downturn would only deepen it.

The other side

Opposition Leader Angus Taylor said Australia is in an economic crisis and blamed federal government spending for the rise in unemployment. Deputy Liberal leader Jane Hume said the economy was not working for Australians. Acting Prime Minister Richard Marles responded that there are 83,500 more jobs than a year ago, while acknowledging the moment is difficult. Some economists also caution that Australia is not in a technical recession: GDP grew 0.4 per cent in the June quarter and 2.1 per cent over the year, the ABC reported.

Those are fair points to put on the record. But a political argument about who is to blame will not pay anyone's rent. The priority now is to stop a slowdown becoming a slump, and to make sure the people who lose their jobs are not left to fall alone.

This is an opinion column.

Sources: ABC News, "Federal politics: Taylor says Australia is in 'economic crisis' following rise in jobless rate", live blog, 19 November 2026; ABC News, business and markets live blog, 19 November 2026; ABC News (Hanan Dervisevic), "Australians describe life in a recession-like squeeze", 20 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-jobless-rise-jobs-first-plan-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-flood-risk-scores-who-pays-adaptation-2026',
    publishedAt: '2026-11-18T21:20:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Every home in New Zealand now has a flood score. The next government must decide who pays before the water arrives`,
    summary: `New data rating every residential property for flood risk shows tens of thousands of families in Christchurch, Napier, Auckland and Lower Hutt are exposed. The caretaker government has pushed the question of who pays into the next term. That cannot wait any longer.`,
    body: `For most New Zealanders, flood risk has been something you worried about after the rain, not before you bought the house. That changed this week.

Property data firm Cotality has given every residential property in the country a flood risk score from zero to five, based on the combined risk from rivers, the coast and surface water, RNZ reported on 18 November in a story by Kate Newton carried by 1News. The analysis draws on detailed third-party data that some banks and insurers already use.

The numbers are sobering. In Wairoa, still recovering from Cyclone Gabrielle, 66 per cent of homes score between three and five, the highest-risk bands. In Buller it is 61 per cent, in Napier 56 per cent, in Gore 50 per cent and in Westland 43 per cent.

The biggest exposure, though, is in our cities. About 24,000 higher-scoring homes are in Christchurch, 13,900 in Napier, 11,300 in Auckland and 10,400 in Lower Hutt, according to the same report. Cotality chief property economist Kelvin Davidson pointed out that the largest financial threat may come from places with lower overall exposure but many more houses.

The market is already moving

This is not a distant problem. Earlier this year AA Insurance temporarily stopped offering new home insurance policies in Westport because of flood risk, RNZ reported. Westpac has said publicly that it will look more closely at riskier properties when it lends, and Mr Davidson suggested other banks may be doing the same quietly.

Earth Sciences New Zealand data released late last year found more than a third of the population would be exposed to inland flooding in a major event, and buildings worth $235 billion are exposed to flood risk, more than half of them in Auckland, Wellington and Canterbury, RNZ reported.

When insurers and banks start pricing in risk, the people who feel it first are ordinary homeowners. A family that bought a modest house in Napier or Lower Hutt twenty years ago, long before anyone published a flood score, can find that the biggest asset they own is suddenly harder to insure, harder to sell and harder to borrow against. Mr Davidson himself acknowledged there is a "fairness question" for people who bought decades before they knew of the risk.

The government has kicked the can

Here is the problem. The National-led government has had three years to settle the hardest question in climate adaptation: who pays to protect, move or compensate people whose homes are at risk. It has not answered it.

According to RNZ, the government points to its adaptation framework, a set of high-level guiding principles, and a National Flood Map due early next year. But it has delayed decisions on how adaptation costs will be shared until the next term of government.

Meanwhile, a government-commissioned report published last year concluded that the Crown could not keep buying out flood-affected properties at market rates, as it did after Cyclone Gabrielle in 2023. The chair of that reference group, Matt Whineray, said there would always be a role for government in relieving hardship. Councils have pushed for long-term co-funding for adaptation.

So the message to homeowners is effectively this: the market is waking up to your risk, the old safety net is being wound back, and the new rules will come later. That leaves families in limbo, and it leaves councils carrying decisions they cannot afford alone.

Councils are already at the front line

Look at Gore. Mayor Ben Bell told RNZ that new flood maps show the town's floodbanks would not hold in a 75-year flood, and that most properties would need floor levels of 1.8 metres. In some cases that means living quarters only on the second floor. He said the council could not allow people to build in that context.

A small town council should not have to choose between halting growth and putting new families in harm's way with no national plan to back it up. This is exactly where central government leadership is needed.

What a fair adaptation deal looks like

The coalition talks after the official results on 27 November give the parties of the centre-left a chance to put this at the top of the agenda. Labour, the Greens and The Opportunity Party should insist on four things in any agreement.

First, a clear national cost-sharing law. Homeowners, councils, insurers, banks and the Crown all have a stake. People deserve to know, before the next storm, what support exists and what does not.

Second, a properly funded adaptation fund that pays for protection where it makes sense, such as stopbanks, drainage and planting, and for planned, voluntary relocation where it does not. Planned retreat, done early and fairly, is far cheaper and kinder than emergency buyouts after a disaster.

Third, fairness for existing owners. Families who bought in good faith decades ago should not carry the whole loss alone. Support should be means-tested and focused on owner-occupiers, not investors, so that public money goes to those who need it most.

Fourth, an end to building new homes in places we already know will flood. That protects future buyers and stops the bill growing. It also means councils need the money and legal backing to say no.

The Opportunity Party has long argued for pricing risk honestly, and there is merit in that, as long as it is paired with real help for people who cannot move on their own. The Greens have consistently pushed for stronger climate action, and Labour's record after Cyclone Gabrielle shows it understands that the state must stand behind communities when disaster strikes. Together they could deliver the long-term settlement this issue needs.

The government's case

The caretaker government's supporters would argue that a National Flood Map and agreed principles are necessary foundations before any cost-sharing law, and that rushing a scheme could create an open-ended liability for taxpayers. They would also say that market signals, such as insurance prices, help steer building away from risky land. Mr Davidson cautioned that "we shouldn't necessarily panic about it", noting there has been no wholesale move away from higher-risk properties yet.

Those are reasonable points. A flood map is useful, and nobody wants a blank cheque. But a map without a plan simply tells families how worried to be. With insurers and banks already acting, the cost of waiting falls on households first.

The water will not wait for the next term of government. Neither should the decision about who helps the people in its path.

This is an opinion column.

Sources: RNZ (Kate Newton), "Every residential property in NZ given a score for flood risk", published by 1News, 18 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-flood-risk-scores-who-pays-adaptation-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-deadlock-no-fresh-election-stable-government-2026',
    publishedAt: '2026-11-18T21:15:00.000Z',
    category: 'editorial-view',
    title: `Opinion: A deadlocked result is not a reason for a fresh election. The parties must do the work and form a stable government`,
    summary: `With the final count due on 27 November and Parliament required to meet by 14 January, talk of a snap election is a distraction. MMP is built for negotiation, and the centre-left parties should show they can deliver.`,
    body: `New Zealand is in an unusual place. The election produced no clear winner on the night, the final results are not due until 27 November, and the country is being run by a caretaker government led by Christopher Luxon.

In that kind of uncertainty, some people reach for a simple fix: just vote again. That would be a mistake.

The rules give us time

University of Auckland political scientist Grant Duncan set out the timetable in an analysis for The Conversation, republished by 1News on 18 November. Parliament must assemble by 14 January, whether or not a new government has been sworn in. Ministers who lost their seats see their warrants expire on 4 December, so a reshuffle of the caretaker team is likely if talks drag on.

When Parliament meets, the government faces a confidence vote. If the three caretaker parties hold a majority, they continue. If they fall short but another party abstains or supports them, they may carry on for now. If they lose, the Prime Minister resigns and the Governor-General asks whoever can command a majority to form a government. That could be Mr Luxon, Labour's Chris Hipkins or someone else, without another election.

As Dr Duncan put it, "A temporary deadlock does not necessarily mean a fresh election." He argues that the Governor-General's reserve power to dissolve Parliament has never been needed in New Zealand and should be avoided, and that if the parties compromise, the process could be finished by Christmas.

Why a snap election is the wrong answer

A second election would cost money, delay decisions on the cost of living, health and housing, and most likely produce a similar result. Voters have already spoken. Their message is that no single bloc has an easy majority, and that the parties need to work together.

That is how MMP is meant to work. It rewards parties that can negotiate in good faith and punishes those that treat compromise as weakness.

The opportunity for the centre-left

This is a moment for Labour, the Greens and The Opportunity Party to show they can be the stable option. Opportunity, which has provisionally secured seven seats according to 1News, holds real leverage.

Its deputy leader Daniel Eb told RNZ the party expects a "pretty gnarly negotiation period" and that its published bottom lines are a good starting point. He said the party is planning for several scenarios, including staying on the crossbench, but will wait for the special votes.

That is a responsible approach. Opportunity's bottom lines are public, which means voters can judge any deal against them. Labour and the Greens should engage seriously with those ideas rather than dismiss them. A Labour-led arrangement that delivers on fair taxes, housing and climate, and gives Opportunity real policy wins, would be a stronger and more honest government than a National-led one that only courted Opportunity after the votes were counted.

Stability is not the same as the status quo. A new government that has to negotiate every major decision across several parties can be more careful, more transparent and more representative than a single-party majority.

The other side

National's supporters argue that the right bloc remains the largest grouping, and that the incumbent Prime Minister should have the first chance to form a government. A former ACT chief of staff, Andrew Ketels, told 1News' Breakfast programme the right bloc would be confident of governing. Some commentators also worry that a multi-party government including newer parties could prove unstable.

Those concerns are understandable. But the test is simple: who can command a majority in the House and keep it. That should be settled through honest negotiation and a vote in Parliament, not a rerun of an election that has already happened. As Dr Duncan wrote, "A majority can always be found, when the will is there."

This is an opinion column.

Sources: Grant Duncan for The Conversation, "Stable government is parliament's top priority – a fresh election isn't the answer", published by 1News, 18 November 2026; RNZ (Lillian Hanly), "Opportunity deputy leader predicts 'gnarly negotiation period' ahead", published by 1News, 18 November 2026.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-young-workers-rate-hikes-real-wages-2026',
    publishedAt: '2026-11-18T21:10:00.000Z',
    category: 'editorial-view',
    title: `Opinion: Young Australians are paying the price for the fight against inflation. Canberra needs a plan for their jobs`,
    summary: `Youth unemployment is above 11 per cent and real wages have gone backwards for a full year, while the Reserve Bank has lifted rates five times in 2026. A Labor government should make sure the young are not left to carry the load.`,
    body: `When the economy slows, young people are usually the first to feel it. They are the last hired, the first let go, and the most likely to be on casual hours with no buffer.

That is what makes the latest numbers in Australia worrying.

The numbers

Youth unemployment was 11.1 per cent in September, compared with 4.7 per cent for the workforce as a whole, according to Australian Bureau of Statistics figures reported by the ABC on 15 November. Economists are watching for that rate to rise as the economy softens.

SEEK chief economist Blair Chapman told the ABC: "We tend to see younger workers affected more heavily when there is a slowdown". SEEK says graduate job advertisements have been trending down from their post-pandemic highs. Commonwealth Bank economist Harry Ottley said youth unemployment is now rising faster than for other groups.

At the same time, the cost of borrowing has climbed sharply. EY chief economist Cherelle Murphy noted that the cash rate has risen from 3.6 per cent to 4.85 per cent this year after five increases, the ABC's business blog reported on 18 November.

Wages are rising, but not fast enough

The September quarter wage figures, released on 18 November, showed the Wage Price Index up 1.1 per cent in the quarter and 3.5 per cent over the year, the ABC reported. That is better than expected. The ABS said decisions by the Fair Work Commission, including its 4.75 per cent increase to award wages, drove much of the private sector rise.

But prices have now outpaced wages for four quarters in a row, which Oxford Economics described as a full year of negative real wage growth. For a young worker on casual hours paying rent, that is a year of falling living standards.

The ABC's reporting included Lachlan Riddell, a 24-year-old with a music diploma who has applied for hundreds of jobs over three years, works casually and relies on JobSeeker. He rejects the idea that his generation does not want to work. His story is a reminder that behind each percentage point are people doing everything asked of them and still falling behind.

What Labor should do

The Albanese government did not set interest rates, and taming inflation matters. But a Labor government has a duty to make sure the burden of that fight is shared fairly, and not dumped on those with the least power in the labour market.

First, it should back the Fair Work Commission's approach to award wages. The 4.75 per cent rise helped low-paid workers, many of them young, and the ABS figures show it made a real difference. Any suggestion that award increases should be held down to help the Reserve Bank should be resisted.

Second, it should treat youth unemployment as a priority, not a side effect. That means targeted, paid training and apprenticeships in areas with real vacancies, such as care, health and construction, and support for employers who take on young jobseekers. Skills and Training Minister Andrew Giles told the ABC that young people need to understand where the vacancies are. Government can do much more to help them get there.

Third, it should look again at the adequacy of income support for young people looking for work, so that searching for a job is not also a slide into debt.

The other side

Economists and the Coalition would argue that the priority must be bringing inflation down, and that stronger wage growth could keep it higher for longer. CBA senior economist Ashwin Clarke said the wage data was stronger than expected and keeps the Reserve Bank watchful into 2027. Others note that by some measures, such as participation, young people are still more engaged in the labour market than before the pandemic.

Those points are fair. But a recovery that leaves a generation of young workers stuck at the start of their careers is not much of a recovery. Fighting inflation and protecting young people's first jobs are not opposites. A Labor government should be doing both.

This is an opinion column.

Sources: ABC News (Fiona Blackwood), "Economists are watching for higher youth unemployment as economy softens", 15 November 2026; ABC News business blog (David Taylor and Gareth Hutchens), "Wage growth picks up, Nvidia rules out return of Jensen Huang, ASX falls — as it happened", 18 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-young-workers-rate-hikes-real-wages-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'kiwisaver-hardship-withdrawals-fund-financial-mentors-2026',
    publishedAt: '2026-11-17T21:10:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Record KiwiSaver hardship withdrawals are a warning light. The next government must fund the people who help families out of debt',
    summary: 'More than 52,000 New Zealanders raided their retirement savings for hardship in a single year. The answer is not to lock the door on them but to properly fund free financial mentors and deal with the jobs crisis behind the numbers.',
    body: `When people start emptying their retirement savings just to get through the week, something has gone badly wrong. In New Zealand that is now happening on a scale we have never seen.

In the year to June 2026, 52,330 KiwiSaver members made a financial hardship withdrawal, according to Inland Revenue statistics updated on 19 October. Ten years earlier, in the 2016 financial year, the figure was 10,670. Hardship applications now outnumber first-home applications, according to new university research.

The dollar figures tell the same story. Hardship withdrawals reached $443.6 million in the year to 31 March 2025, up from $264.3 million the year before, a rise of 50.8 per cent, Victoria University of Wellington law lecturer Victoria Stace wrote in research published by 1News and The Conversation on 17 November. One KiwiSaver provider told her research team that withdrawals were "roughly three times what we had pre-Covid".

These are not people cashing in for a holiday. To get a hardship withdrawal you have to show you cannot meet basic living costs. Every one of those 52,000 applications is a household that has run out of other options.

Why this is happening

The obvious place to start is jobs. New Zealand's unemployment rate rose to 5.7 per cent in the September 2026 quarter, the highest in more than a decade, interest.co.nz reported on 4 November from Stats NZ figures. About 174,000 people were out of work. Annual wage growth slowed to 2.1 per cent.

That is the economy the National-led government has presided over for three years. Its answer to a slowing economy was to cut public spending hard and wait for the private sector to pick up the slack. For tens of thousands of families, the slack has instead been picked up by their own retirement savings.

Every dollar taken out now is a dollar, plus decades of compound growth, that will not be there at 65. Today's hardship becomes tomorrow's poverty in old age, and eventually a cost the rest of us share through the pension and the welfare system.

The people doing the hard work

There is a group of New Zealanders who see this up close every day: financial mentors, the mostly community-based workers who help people with debt for free. Many are volunteers.

Their umbrella body, FinCap, told Parliament's Social Services and Community Committee in May that mentors closed 30,000 financial hardship cases in 2025, a 57 per cent increase since 2021. A FinCap survey found mentors now spend 40 per cent of their time on KiwiSaver hardship applications.

That second figure should alarm any government. It means that a large share of the country's free debt-help workforce has been turned into a paperwork service for retirement withdrawals, instead of doing what mentors do best: negotiating with creditors, sorting out benefit entitlements and, where needed, helping people through formal insolvency so that the debt stops growing.

FinCap has put a price on fixing this. In March it identified a $30.5 million funding gap and called for total sector funding of $50 million, with $25 million to come from the industries that benefit when their customers get help, such as banks, lenders, KiwiSaver providers, power companies and telcos. It described mentoring as a "fence at the top of the cliff".

What the research recommends

Dr Stace's research, commissioned by FinCap, makes four sensible proposals. Anyone applying for a hardship withdrawal should be offered a session with a financial mentor first. There should be a central hardship assessment and support service, so people are not dealing with very different forms and rules depending on which provider they happen to be with. The government should look at trialling "sidecar" emergency savings accounts linked to KiwiSaver. And Inland Revenue and the Retirement Commission should work with providers to collect better data and standardise the process.

None of these ideas is expensive. All of them would keep more money in people's retirement accounts while still helping them when they are in trouble.

What the parties are offering

KiwiSaver reform is already on the table in the coalition talks. A National-led government would likely make KiwiSaver contributions compulsory, Dr Stace noted. Labour has promised compulsory employer contributions. The Opportunity Party's "KiwiSaver 2.0" plan includes a compulsory scheme with no hardship withdrawals at all, she wrote.

Labour's approach is the right foundation. Making employers contribute for every worker lifts the savings of low-paid people without taking more out of pay packets that are already stretched.

The Opportunity Party is right that hardship withdrawals are a poor substitute for a proper safety net, and its focus on long-term savings deserves a serious hearing in any negotiation. But simply banning hardship withdrawals, without first building something better, would leave desperate families with nowhere to turn except high-interest lenders. The sensible order is to build the support first, and then tighten the rules.

The Greens' long-standing call for a guaranteed minimum income points in the right direction. If benefits and support payments covered basic costs, far fewer people would need to break open their retirement savings in the first place.

A practical plan for the next government

Whoever forms the next government after the official results on 27 November should do four things in its first budget.

First, close FinCap's funding gap and require the industries that profit from lending and essential services to share the cost.

Second, put a financial mentor at the front door of every hardship application, as the research recommends.

Third, set up the central hardship service and standard rules across every KiwiSaver provider.

Fourth, and most importantly, treat rising unemployment as the emergency it is. Public investment in housing, infrastructure and training would put people back to work. That is the surest way to bring these withdrawal numbers down.

The other side

The government's supporters would argue that rising unemployment reflects high interest rates set to bring inflation down, and that a recovery is coming. They also point out that hardship withdrawals exist precisely so people can use their own money when they need it. Others argue that compulsory industry levies would raise costs that are passed on to customers, and that mentoring services should be funded through normal budget decisions rather than new charges.

Those are fair points, but they do not change the basic picture. More than 52,000 New Zealanders took money out of their retirement savings last year because they could not pay for the basics. A government that is serious about both today's cost of living and tomorrow's retirements should be helping them before they reach that point.

This is an opinion column.

Sources: Inland Revenue, KiwiSaver withdrawal statistics by number, updated 19 October 2026; Victoria Stace for The Conversation, republished by 1News, 17 November 2026; interest.co.nz (Mandy Te), Stats NZ September quarter labour market figures, 4 November 2026; FinCap, "Social Services and Community Committee hear our request for funding", 18 May 2026; FinCap, "Call for industry co-funding to support essential financial mentors", 25 March 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/kiwisaver-hardship-withdrawals-fund-financial-mentors-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'supermarket-break-up-advice-coriolis-competition-2026',
    publishedAt: '2026-11-17T21:05:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: The supermarket advice voters did not see shows we need real competition powers, not election slogans',
    summary: 'Advice to the government found a Foodstuffs split on its own would barely move grocery prices, and it was kept out of public view until shortly before the election. Shoppers deserve a tougher, more honest plan.',
    body: `Grocery prices are one of the biggest worries for New Zealand families, so any plan to fix them deserves an honest public debate. It now appears that voters did not get one.

Advice commissioned by the Ministry of Business, Innovation and Employment from consultancy Coriolis was not a firm endorsement of breaking up the supermarket chains, NZ Herald journalist Jenée Tibshraeny reported, according to the Democracy Project's 17 November briefing. Nicola Willis's office twice turned down the Herald's Official Information Act requests for the advice, and it was released only to a journalist shortly before the election, the briefing said. Meanwhile MBIE published a more favourable analysis by Sense Partners on its own website. Tibshraeny wrote that the handling "feels cynical".

What the advice said

Coriolis has since published a summary of five reports released by MBIE, totalling more than 580 pages. The work began with slides for a meeting with Ms Willis in April 2025 and continued through September 2025.

The findings are sobering. Coriolis estimated that splitting the chains alone would cut prices by about one cent in the dollar, and that its three demerger options would lower consumer prices by 0.5 to 1 per cent. It found "no easy fixes" and singled out attracting a limited-range discounter such as Aldi as the standout opportunity. Business news site B2B News reported on 10 November that the work pointed to biosecurity rules and labour costs as bigger drivers of grocery prices.

Compare that with the campaign. National's 2026 platform promised to split Foodstuffs into two, creating three national chains, and its own modelling claimed prices would be 3.5 per cent lower after one year and 5 per cent lower after six, B2B News reported. Ms Willis put household savings at up to $1,320 a year, B2B News reported.

Why this matters

There is a pattern here worth naming. When advice supports a minister's plan, it goes on the website. When it does not, the public has to fight for it under the Official Information Act. That is not how good government is meant to work, whichever party is in charge.

None of this means the supermarket problem is imaginary. The Commerce Commission's 2022 market study found the sector was not workably competitive, Coriolis noted. Families paying more each week for basics know that already.

What it does mean is that a single headline policy will not fix it. The progressive parties have the better instinct here. The Opportunity Party has made stronger Commerce Commission powers one of its five bottom lines for coalition talks, interest.co.nz's Anna Whyte reported, according to the Democracy Project. That is a sensible bottom line, and Labour and the Greens should back it in any talks.

A credible plan would give the Commerce Commission and the Grocery Commissioner sharper tools, free up land and planning rules so new competitors can actually open stores, actively court a discount chain, and make sure smaller grocers can get fair wholesale access. A break-up can still be on the table, but sold honestly, as one tool among several, not as a promise of big savings that the government's own advice did not support.

The other side

Supporters of the break-up argue that structural change is the only way to end the duopoly for good, and that even a 1 per cent saving adds up across billions of dollars of grocery sales. Ministers can also point out that the Coriolis advice was eventually released, and that the 2022 Sense Partners analysis found a net benefit from divestment over 20 years, according to B2B News. The New Zealand Initiative's Eric Crampton has argued the first step is simply making it easier to build supermarkets.

That last point is one everyone should be able to agree on. Whatever the next government looks like after 27 November, it should publish all the supermarket advice it holds and give shoppers a plan built on the evidence, not on campaign numbers.

This is an opinion column.

Sources: Democracy Project (Bryce Edwards), News Briefing, 17 November 2026 (summarising Jenée Tibshraeny, NZ Herald, and Anna Whyte, interest.co.nz); Coriolis Research, "Restructuring New Zealand's Supermarket Duopoly", November 2026; B2B News, "Coriolis: Foodstuffs split cuts grocery prices only 1-3%", 10 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/supermarket-break-up-advice-coriolis-competition-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'victoria-regional-food-relief-funding-election-2026',
    publishedAt: '2026-11-17T21:00:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Regional Victoria\'s food relief centres need a funding promise before polling day',
    summary: 'Six regional food relief hubs that supply about 100,000 meals a week will lose state funding next July. With hunger rising and interest rates at an 18-year high, both major parties should commit to keeping them open.',
    body: `Victorians vote in a state election this month, and the cost of living is the issue voters keep raising. Yet one of the simplest promises either major party could make has not been made: to keep regional food relief going.

Six regional food relief centres, in Wodonga, Bendigo, Geelong, Shepparton, Mildura and Warrnambool, are due to run out of state government funding in July 2027, ABC News reported on 18 November. Between them they help supply about 100,000 meals a week.

The 2025 state budget gave the Regional Food Security Alliance $6 million over two years for these centres. The alliance's chair, Cathie Steele, says $12 million is needed over the next four years to meet demand. "We just need to keep our services going," she told the ABC.

Neither Labor nor the Coalition has committed to extending the grant, the ABC reported. Alliance chief executive Jacqui Watt said responses from candidates and sitting members had been "non-committal".

Demand is rising, supply is falling

The need is not hard to see. A Foodbank hunger report released in October found that more than half of food-insecure households had switched to cheaper alternatives, the ABC reported. In Bendigo, Foodshare has had a 21 per cent drop in fresh food supplies this year. Its chief executive, Michelle Murphy, said the warehouse was seeing less fresh produce coming through. Supermarkets are cutting waste, which is good for the environment but leaves less to donate.

The national picture is just as worrying. A St Vincent de Paul Society survey found one in two Australians feel more financially stressed heading into Christmas, ABC NewsRadio reported on 16 November. Vinnies regional director Claire Van Doorn said up to 29 per cent of people seeking help were new to the charity, and some of them had jobs.

Then there is the Reserve Bank. On 3 November it lifted the cash rate to 4.85 per cent, its highest level since 2008 and the fifth rise this year, the ABC reported. Canstar estimated repayments on a $600,000 mortgage were about $456 a month higher than at the start of the year. Renters and mortgage holders in regional towns are feeling every one of those rises.

A small cost for a big return

Twelve million dollars over four years is a tiny sum in a state budget. It buys a network that turns donated and surplus food into meals for families, pensioners and working people who have simply run out of money before payday.

This should be an easy call for a Labor government. Labor's values are about making sure nobody is left behind when times get hard, and this is exactly that kind of moment. The government should commit the full $12 million before polling day and stop leaving the centres guessing.

The Liberals and Nationals should match it. Rural and regional communities are their heartland, and these centres serve them directly.

The other side

A Victorian Liberals spokesperson told the ABC it was up to Labor to explain why future funding had not been secured. That is a fair challenge to the government, though it would be stronger with a commitment of its own. One Nation has promised $14 million over four years for the six centres if it forms government, the ABC reported. Treasurer Jim Chalmers has blamed the Middle East war for inflation, while Opposition Leader Angus Taylor has called the problem "homegrown", the ABC reported on 3 November.

Voters can weigh those arguments. What they should not have to accept is a food relief network left facing a funding cliff while hunger rises. Both major parties have days left to fix that.

This is an opinion column.

Sources: ABC News (Isabella Davies and Ed Gannon), 18 November 2026; ABC NewsRadio, "Food becoming a 'discretionary spend' as the cost of living pressures mount", 16 November 2026; ABC News business live coverage, "RBA hikes cash rate to 18-year high of 4.85 per cent", 3 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/victoria-regional-food-relief-funding-election-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-election-hidden-money-third-party-donor-disclosure-2026',
    publishedAt: '2026-11-15T21:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Voters still do not know who paid for the 2026 campaign. Fix the donation rules before 2029',
    summary: 'Registered campaign groups could each spend $424,000 on election ads without telling anyone where the money came from. Whoever forms the next government should make full donor disclosure a first-year law.',
    body: `New Zealand has voted, the special votes are being counted and the coalition talks are under way. One question has no answer and, under the current law, never will: who paid for the advertising that tried to change our minds?

Political parties have to tell the Electoral Commission who gives them large donations. Groups that campaign alongside the parties do not. That gap was legal in 2026. It should not be legal in 2029.

How the gap works

Any group can register with the Electoral Commission as a "third-party promoter" and campaign for or against parties and policies. In 2026 a registered promoter could spend up to $424,000 on election advertising, The Spinoff reported on 13 November. An unregistered promoter could spend up to $17,000. For comparison, a party's own advertising limit was just over $1.5 million, and each electorate candidate was limited to $36,000.

The catch is on the other side of the ledger. The Electoral Commission's guidance tells third-party promoters they do not need to record or report the donations they receive, the Democracy Project's Bryce Edwards noted in September. They file a spending return only if they spend more than $100,000, The Spinoff reported. So a group can raise hundreds of thousands of dollars, spend it attacking one side, and never say where a cent of it came from.

This is not a small corner of the system. There were 25 registered promoters at this election, Newsroom's Jonathan Milne reported, according to the Democracy Project's summary of his work on 5 November. Each was entitled to spend up to $424,000 without naming its funders.

The groups that campaigned

The best-known is the Taxpayers' Union. It is a registered promoter, and its membership list is confidential unless a supporter chooses to go public, Edwards reported. Its executive director, Jordan Williams, has been open about the group's purpose. The Union's annual review set the aim to "do everything in our power to ensure that Labour does not return to office", Edwards reported.

There is nothing wrong with a lobby group having a political view. Voters, though, deserve to know whose view it is. When a campaign tells you a party's tax plan will wreck the economy, it matters whether the money behind that message came from thousands of small donors or from a handful of people who would pay the tax.

Writing in the Sunday Star Times, Andrea Vance worked out that five like-minded groups, including the Taxpayers' Union, the Free Speech Union, Hobson's Pledge and the Sensible Sentencing Trust, could in theory spend $2.12 million between them, according to the Democracy Project's 15 November briefing. No donor to any of them has to be named.

Online, the picture is murkier still. The Spinoff's analysis of Meta and Google ad data found that Centrist NZ, founded by Canadian Jim Grenon, spent more than $10,000 on Meta ads without being a registered third-party advertiser. TikTok's transparency tool does not even work in New Zealand, the same analysis found, so nobody can check spending there at all.

The parties are not short of money either

The parties themselves raised large sums this cycle. National has taken more than $13.4 million, ACT more than $6.2 million, NZ First more than $3 million and Labour more than $5 million, Newsroom reported, according to the Democracy Project's summary. At least party donations above the threshold are eventually published. The full party spending returns for 2026 are not due until April next year, The Spinoff noted. That means we will learn the details of this campaign's money five months after the votes were counted.

Big money and hidden money are two separate problems, and the second is easier to fix.

What should change

First, every registered third-party promoter should have to disclose donors on the same terms as political parties. Vance has proposed disclosure of donations above $6,000, the Democracy Project reported. That is a sensible starting point.

Second, groups that share staff, offices or directors should share a single spending cap. Otherwise one well-funded network can multiply its limit simply by registering more names.

Third, foreign money should be banned from third-party campaigns as it is from party donations. Vance proposed this too.

Fourth, the online rules need to catch up. Every paid political ad on every platform should carry a clear name and appear in a public library that New Zealanders can search.

None of this is radical. It is the same standard we already apply to parties. Labour, the Greens and the Opportunity Party should make it a shared priority in any talks. Whoever ends up in government after 27 November should pass this in its first year, well before the next campaign starts, so that no party can be accused of changing the rules to suit itself.

It should also cover every side. Unions run third-party campaigns too: the Council of Trade Unions spent $23,800 on Google ads, against the Taxpayers' Union's $25,800, The Spinoff found. Rules that ask the left to open its books along with the right are a feature, not a cost. We are confident progressive campaigns can live with them.

The other side

Defenders of the current rules make reasonable points. Third-party campaigning is a form of free speech, and groups argue that naming donors could expose ordinary supporters to harassment. Mr Williams has said that about two-thirds of the Taxpayers' Union's money comes from small online donations and less than 3 per cent from industry, Edwards reported. Others argue the spending caps already limit any one group's reach, and that tougher rules would mostly add paperwork for small community campaigns.

Those concerns can be met. A disclosure threshold of several thousand dollars protects small donors, and caps already keep the amounts in check. What cannot be defended is a system where the people with the deepest pockets can shape an election in private.

The 2026 election was close, and the final result may still turn on the special votes. In a contest that tight, every hidden dollar matters. The next Parliament has three years to make sure that in 2029, voters know who is talking to them.

This is an opinion column.

Sources: The Spinoff (Shanti Mathias), 13 November 2026; Democracy Project (Bryce Edwards), "The influence of the Taxpayers' Union in the election", 22 September 2026; Democracy Project News Briefing, 5 November 2026 (summarising Newsroom reporting by Jonathan Milne); Democracy Project News Briefing, 15 November 2026 (summarising Andrea Vance, Sunday Star Times); Electoral Commission third-party promoter guidance, 2026.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'mason-clinic-mental-health-vacancies-staffing-2026',
    publishedAt: '2026-11-15T21:10:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: 35 empty jobs at the Mason Clinic is a budget choice, and patients and staff are paying for it',
    summary: 'The union for mental health staff says Health NZ is leaving dozens of roles unfilled at the country\'s largest forensic mental health service to stay within budget. Safe staffing should not wait for the coalition talks to end.',
    body: `While politicians negotiate in Wellington, the people who staff New Zealand's most demanding mental health service say they have run out of patience.

The Public Service Association (PSA) has taken Health New Zealand to the Employment Relations Authority over staffing at the Mason Clinic in Auckland, which the union describes as the country's largest forensic mental health service. RNZ reported the legal action on 7 November.

What the union says

According to the PSA's statement of 6 November, 35 nursing and allied health roles at the clinic were unfilled as of late September, some of them since 2025. The union says Health NZ is breaching two collective agreements that require it to take all reasonable and practicable steps to fill vacancies as soon as they occur.

The union's account of the reason is the most troubling part. The PSA says Health NZ told it the roles were not being filled because there was no approval to fill them, and that recruitment goes ahead only where a district is within budget. The PSA says it has raised the issue repeatedly since March, that staff told it in July they were at breaking point, and that a September letter went unanswered until the union chased it a month later.

PSA national secretary Fleur Fitzsimons called the situation "a dangerous gamble with the safety of patients, staff and the public."

The union is asking the authority to find that Health NZ breached the agreements and to order it to fill the vacancies. It also says the problem is not limited to the Mason Clinic, because moving staff between mental health units simply opens new gaps elsewhere.

Why this matters to everyone

Forensic mental health services care for some of the most unwell people in the country, many of them referred through the courts. Short staffing in that setting is not only a workplace issue. It affects whether patients get treatment that helps them recover, whether staff go home safe, and whether the public can trust the system.

It also fits a wider pattern. In the same week, RNZ reported Health NZ figures showing about 5,000 fewer planned procedures in July and August than in May and June, as winter flu pressure pushed operations back. A health system that runs this close to the edge has no room to absorb a bad winter, let alone a hiring freeze.

The National-led government has repeatedly said that frontline services are protected while it cuts back-office spending. If the PSA's account is right, a hiring rule that waits for a district to be within budget is not protecting the front line. It is rationing it.

What should happen

Labour and the Greens have argued throughout this term that the health system needs proper funding and a workforce plan, not budget caps that leave wards short. The Mason Clinic case shows why. Whatever government emerges from the talks this month, its first health decision should be simple: approved, funded roles in mental health and other safety-critical services get filled, without waiting for a district's books to balance.

That means a clear instruction to Health NZ, money set aside to make it happen, and regular public reporting of vacancies in mental health services so the problem cannot hide again. It also means listening to the nurses, occupational therapists and other staff who raised the alarm months before they went to the authority.

The government's case

Health NZ has not publicly responded to the PSA's statement in the material we reviewed, and the union's description of its budget rules is the union's account. The NZ Herald has reported that Health NZ denies the facility is understaffed. Health NZ and ministers have argued that the system must live within its means after years of overspending, and that new roles should go where they are most needed rather than being filled automatically. The authority will now weigh the evidence.

That is a fair process, and its outcome should be respected. But nobody should need a legal ruling to know that a secure mental health service running dozens of staff short is a risk worth fixing now.

This is an opinion column.

Sources: PSA press release, "Govt's Health Squeeze Leaves Mason Clinic Short-Staffed", via Scoop, 6 November 2026; RNZ, 7 November 2026; RNZ, 13 November 2026; NZ Herald report on Health NZ's response, November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/mason-clinic-mental-health-vacancies-staffing-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-december-budget-cuts-protect-struggling-households-2026',
    publishedAt: '2026-11-15T21:00:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Australia\'s pre-Christmas spending cuts must not land on the people already going under',
    summary: 'With the cash rate at 4.85 per cent and unemployment at a five-year high, the Albanese Government is hunting for savings before Christmas. It should look at tax breaks and gas profits before it looks at families on the edge.',
    body: `Australians are heading into Christmas with less money, more debt pressure and fewer secure jobs than at any time in years. The federal government has promised more spending cuts in its December budget update. The question is who will pay for them.

How tight things are

On Melbourne Cup Day, 3 November, the Reserve Bank lifted the cash rate to 4.85 per cent, its fifth increase this year, on a split six to three vote, SBS reported. Unemployment was 4.7 per cent in September, the highest in five years.

The ABC's Jessica Irvine reported that the Reserve Bank expects inflation to reach 4.5 per cent by the end of the year and mortgage repayments to hit their highest level since 2007 and 2008. Real wages are forecast to fall by 1 per cent this year, AAP reported. Governor Michele Bullock warned that the rate rises would make people feel like it's a recession, according to Seven's reporting republished by The Nightly.

Job losses are piling up. NAB is cutting 2,500 roles, Canva more than 1,200 and Woodside at least 500, SBS reported on 9 November, with 732,000 Australians out of work.

In Tasmania, independent senator Jacqui Lambie told the ABC's Insiders the financial strain was the worst since Covid, news.com.au reported on 16 November.

The savings hunt

Treasurer Jim Chalmers said on 3 November that the government had already found almost $180 billion in savings since 2022 and would find more in the December update. "Australians are already struggling and this will stretch their budgets even further," he said. Finance Minister Katy Gallagher said no area was exempt, SBS reported. Employment Minister Amanda Rishworth has since said there will be no cuts to aged care or health, news.com.au reported.

We welcome that promise. It needs to go further.

Where the money should come from

A government that is serious about inflation can trim spending without making poor households poorer. The JobSeeker base rate is $808.70 a fortnight for a single person, the ABC reported in August. That is not a payment anyone gets rich on, and people on it spend nearly every dollar on rent, food and power. Cutting payments, tightening eligibility or freezing indexation would hurt the people least able to cope and would do little to cool an economy driven by global oil prices, which Mr Chalmers said had risen above $110 a barrel.

There are better places to look. Greens senator David Shoebridge proposed in October that the government tax gas export profits rather than cut the private health rebate for pensioners. Tax concessions that mostly benefit people who already own investment property or have large super balances cost the budget billions each year, and trimming them would cool demand from people who can most afford it.

Labor came to office promising that no one would be left behind. A December budget update that protects pensioners, renters and people looking for work, and asks more of gas exporters and the most generous tax breaks, would keep that promise. One that does the opposite would hand the Coalition its best argument.

The other side

The Coalition and business groups argue that government spending is part of the inflation problem. Opposition Leader Angus Taylor has said the government is in denial and that the Coalition has a $31 billion savings plan, the ABC reported. Nationals leader Matt Canavan said the latest rate rise risked a recession and blamed government spending, The Nightly reported. The Business Council's Bran Black told AAP it was hard to ask families to tighten their belts when the government had not tightened its own. The government's spokespeople point out that JobSeeker has risen by about $4,300 a year since 2022, the ABC reported.

Those arguments deserve a hearing, and some savings are fair. But a budget that balances itself on the people already going under is not responsible. It is just cruel at Christmas.

This is an opinion column.

Sources: SBS, 3 November 2026; Treasurer Jim Chalmers media release, 3 November 2026; ABC News (Jessica Irvine), 3 November 2026; AAP via Newcastle Herald, 3 November 2026; The Nightly (Seven), 4 and 8 November 2026; ABC politics live, 4 November 2026; SBS and AAP, 1 November 2026; SBS, 9 November 2026; news.com.au via CathNews, 16 November 2026; ABC News, 7 August 2026; Australian Greens statement, 14 October 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-december-budget-cuts-protect-struggling-households-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-election-prediction-specials-hung-parliament-opportunity-decides-2026',
    publishedAt: '2026-11-15T15:30:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: History says the special votes will cost Luxon his majority. Our prediction: Opportunity chooses the next government',
    summary: 'In 2017, 2020 and 2023 the special votes cost National two seats every time. Scaled to this year\'s smaller count, history points to the coalition falling from 67 seats to 65, one short of a majority, with Opportunity holding the balance of power.',
    body: `Eleven days before the official result, New Zealand is being told to wait and see. Downunder Voices will not sit on the fence. Here is our call: the special votes will take at least one seat, and more likely two, from National, ACT and NZ First. The coalition will fall below the 66 seats needed to govern, and the Opportunity Party will decide who leads the country.

Where things stand

On the Electoral Commission's preliminary count, Labour narrowly won the party vote, 29.36 per cent to National's 29.21 per cent, SBS reported. National, ACT and NZ First hold 67 seats in a 131-seat Parliament, one more than they need. About 399,000 special votes are still being counted, including about 96,000 from New Zealanders overseas. The official result is due on Friday 27 November.

What history tells us

Special votes are the votes cast by people overseas, people voting outside their electorate and people who enrolled late. They are counted after election night, and for more than 20 years they have moved in one direction. Since 1999, every party that has gained seats when the specials were added has been on the left, NZ Herald analysis found.

The last three elections show how steady the pattern is:

2017: about 420,000 special votes (16% of the total). National lost 2 seats. Labour and the Greens gained 1 each.

2020: about 505,000 special votes (17%). National lost 2 seats and fell from 26.8 to 25.6 per cent. Labour gained 1 and Te Pāti Māori gained 1.

2023: about 603,000 special votes (21%). National lost 2 seats, from 50 to 48, and slipped 0.9 percentage points. The Greens gained 1 and Te Pāti Māori gained 2. Labour's share did not move, while ACT and NZ First each lost 0.4 points. National and ACT lost the majority they appeared to have on election night, and had to bring in NZ First.

That is three elections in a row in which National lost exactly two seats, and three in a row in which the right bloc went backwards.

Our prediction for 2026

This year there are fewer specials: about 399,000, roughly 14 per cent of all votes, according to RNZ. That is about 30 per cent fewer than usual, because changes to the law mean same-day enrolments are no longer counted as special votes, The Spinoff noted. Fewer specials means a smaller swing.

So we have scaled history down to match. If 2026's specials lean the way they did in 2017, 2020 and 2023, but with only around two-thirds of the weight, National should drop between half a point and a point of the party vote and lose one or two seats. Labour, which narrowly won the party vote on election night, should stay ahead of National and is the most likely party to pick up a seat, with the Greens next.

Our call: the coalition falls from 67 seats to 65, one short of the 66 needed. Labour, the Greens, Te Pāti Māori and Opportunity would then hold 66.

RNZ's analysis spells out what that means. If the coalition loses one seat it sits on 66, just enough to govern. Lose two and it drops to 65, and the four other parties hold the majority.

The overseas vote matters here too. About 96,000 special votes came from New Zealanders overseas, SBS reported, many of them in Australia. Kiwis abroad have been part of the left-leaning special vote in every recent election, and we see no reason for that to change.

What happens next

Opportunity leader Qiulae Wong has said she will talk to National first, because it won the most seats, and will turn to Labour if those talks stall, 1News reported. Her five bottom lines include regulating lobbying and capping political donations, RNZ reported. Mr Luxon has said real negotiations will not start until the official result.

Our prediction is that the National talks stall. Mr Luxon ruled Opportunity out nineteen times during the campaign, according to Stuff, and a Stuff poll found 45 per cent of people now trust him less after his U-turn. ACT's David Seymour is already talking to him about the finance job, Stuff reported, and NZ First ruled Opportunity out during the campaign. A National-led deal would mean Ms Wong's young party sitting at the cabinet table with ACT and Winston Peters. That is a hard sell to her own voters.

Chris Hipkins, by contrast, was open to Opportunity before a single vote was cast, and met Ms Wong within days of the count. If the coalition falls to 65, we expect a Labour-led government with the Greens and Opportunity, relying on Te Pāti Māori for confidence and supply. It would be untidy. It would also reflect how New Zealanders actually voted: Labour first on the party vote, and a clear message that people want change on the cost of living.

The other side

Our prediction could be wrong, and the case against it is real. On the night, the coalition already had a majority without Opportunity, and Mr Luxon has said he does not need Ms Wong's support. If the specials move only one seat, he can govern as before. Ms Wong has also said Opportunity would drop its tax reform plans in return for concessions in talks with the centre-right, which makes a deal with National easier than it looked during the campaign. And a Labour-led government would need four parties to agree on every confidence vote, which critics warn would be unstable.

Those are fair points. But a one-seat majority built on a record overhang, with the left ahead on the party vote, is not a mandate. When the final count lands on 27 November, we expect the balance to tip, and Qiulae Wong to choose change.

This is an opinion column. The prediction is ours, based on the reporting listed below.

Sources: NZ Electoral Commission preliminary results; NZ Herald special-vote analysis (2020 and 2023) and official-result reports, 2020 and 2023; 1News and Newsroom, 3 November 2023; SBS, 8 November 2026; Reuters via The Star, 8 November 2026; RNZ, 8 November 2026; The Spinoff, 8 November 2026; 1News, 10 November 2026; RNZ, 9 November 2026; NZ Herald, 8 November 2026; Stuff, 12 and 14 November 2026; Wikipedia summary of Opportunity Party policy announcements, October 2026.

Graphic: Downunder Voices, using Electoral Commission results for 2017, 2020, 2023 and the 2026 election-night count. 2026 figures are our prediction.`,
    imageUrl: '/news/nz-election-specials-forecast-2026.png',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'wales-beat-all-blacks-73-year-drought-ends-cardiff-2026',
    publishedAt: '2026-11-14T16:10:00.000Z',
    category: 'sports',
    title: 'History in Cardiff: Wales beat the All Blacks for the first time since 1953',
    summary: 'Seventy-three years of waiting are over. Wales have beaten New Zealand at the Principality Stadium, their first win over the All Blacks since December 1953.',
    body: `Wales have beaten the All Blacks. Read that again, because no Welsh rugby fan under the age of about 80 has ever seen it happen.

The final whistle in Cardiff on Saturday night ended a run that began on 19 December 1953, when Wales won 13-8 at Cardiff Arms Park. Since that day New Zealand had won 34 Tests in a row against Wales. Before this match, Wales had beaten the All Blacks only three times in 38 attempts: in 1905, 1935 and 1953.

A flying start

Wales came out firing. Scrum-half Tomos Williams scored inside the first two minutes, and captain Dewi Lake crashed over soon after. With Sam Costelow converting both, the home side led 14-0 before New Zealand had settled. Prop Archie Griffin added a third try midway through the half.

The All Blacks fought back, as they always do. Tries to Cortez Ratima and Wallace Sititi, plus a score just before the break, levelled it at 21-21 at half-time.

The second half

Early in the second half, tries from Eddie James and Louis Rees-Zammit pushed Wales clear again, and Costelow kept landing his kicks. New Zealand replied through Fehi Fineanganofo and Peter Lakai, with Richie Mo'unga converting every try, to keep the pressure on until the very end.

In the final minute the All Blacks threw everything at the Welsh line, desperate to win the ball back. Wales held on, the ball was booted into the stands, and the Principality Stadium erupted.

What it means

For Wales it is a night for the history books, and the kind of result that changes how a whole generation of players believes in itself. Captain Dewi Lake admitted before the match that most of Wales' long losing run came before he was born.

For New Zealand, it is another painful result on a northern tour that has already included a heavy defeat at Twickenham. Questions will be asked back home. But on this night the story belongs to Wales.

Final score: Wales 35, New Zealand 28.

Sources: live match coverage from VAVEL and TNT Sports, 14 November 2026; Swansea Bay News, 14 November 2026; Planet Rugby, 14 November 2026; historical record from RugbyPass.

Graphic: Downunder Voices.`,
    imageUrl: '/news/wales-beat-all-blacks-cardiff-2026.png',
    author: 'Downunder Voices Sport',
  },
  {
    slug: 'luxon-opportunity-u-turn-trust-labour-led-option-2026',
    publishedAt: '2026-11-14T15:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Luxon broke his word on Opportunity. Wong should test a Labour-led deal before propping him up',
    summary: 'Christopher Luxon ruled out Opportunity all campaign, then sat down with Qiulae Wong within days of the count. Voters noticed, and Opportunity should make sure a Labour-led option gets a fair hearing before it signs anything.',
    body: `Before polling day, Christopher Luxon was clear. National would not work with The Opportunity Party. Stuff counted nineteen separate times he ruled it out. Within two days of the preliminary count showing his coalition clinging to a one-seat buffer, he was hosting Opportunity leader Qiulae Wong in his office for an hour and describing the meeting as very positive and very constructive, the NZ Herald reported.

This column argues that the U-turn tells Opportunity, and every voter, something important. A leader who drops a firm promise the moment the numbers get tight is not a safe partner. Opportunity should keep its bottom lines, wait for the special votes, and give a Labour-led government with the Greens a genuine chance before it hands Mr Luxon a second term.

Voters noticed

The public reaction has been sharp. A Stuff "Pulse of the Nation" survey of 533 people, reported by Isaac Davison on 14 November, found 45 per cent said the U-turn made them less likely to trust Mr Luxon to keep his word. Only 8 per cent said it made them more likely. Stuff also reported claims that Mr Luxon could have faced another leadership challenge from his own caucus had he refused to talk to Opportunity.

That is the man asking Opportunity to keep him in power: a leader who has already faced two confidence votes among his own MPs this year, according to the Associated Press, and whose promise on this very question lasted barely a weekend.

The mandate is thin

National's claim to govern rests on being the largest party in Parliament. But Labour narrowly won the party vote on election night, 29.36 per cent to National's 29.21 per cent, according to the Electoral Commission's preliminary count. National ended up with more seats because its electorate wins created a record overhang.

The Post's Henry Cooke reported that the three right-bloc parties are only about 17,000 party votes ahead of the rest of Parliament. Three years ago the gap was about 256,000. That is not a ringing endorsement of the outgoing government. It is a country split almost down the middle, with roughly 399,000 special votes still to be counted, according to interest.co.nz. Specials have usually helped the left by a seat or two.

Labour and the Greens did not need a U-turn

The contrast with the other side is striking. Labour and the Greens were open to working with Opportunity before a single vote was cast, 1News reported on 4 November. Since the election, Chris Hipkins and Greens co-leader Chlöe Swarbrick both reached out to Ms Wong, and Ms Swarbrick caught up with her over a beer. The Spinoff observed that Mr Hipkins is far more eager than his National counterpart to form a government with Opportunity, and more prepared to compromise in talks.

Mr Hipkins met Ms Wong for an hour on 10 November. He described it as a chance to understand each other's priorities. That is how a partnership should start: with respect, not a reluctant phone call two days late.

There is also the question of who Opportunity represents. The Herald's Thomas Coughlan has pointed out that Opportunity's voters are concentrated in urban Wellington seats that elected Labour or Green MPs. Many of those voters chose Opportunity as a fresh, evidence-based voice, not as a route to keeping ACT and New Zealand First in cabinet.

What Opportunity should do

Ms Wong has said Opportunity will talk to National first and turn to Labour if those talks stall, 1News reported. She has also said her five bottom lines are non-negotiable. Holding firm on them is right. But "National first" should not mean "National only". On issues such as ending bottom trawling, a cleaner tax system and evidence-based policy, Opportunity has more in common with Labour and the Greens than with ACT, or with New Zealand First, which ruled Opportunity out during the campaign.

The best outcome for New Zealand is a stable government that reflects the full count. If the specials move even one or two seats, a Labour-led government with the Greens and Opportunity would be the natural fit, and Opportunity should be ready for it.

The other side

Mr Luxon's supporters make a fair point: on the provisional numbers National, ACT and NZ First already hold 67 of 131 seats, one more than needed, and Mr Luxon says he does not need Opportunity's support at all. National is the largest party in Parliament. The Herald's Coughlan has also argued that any left-leaning deal relying on Te Pāti Māori would be very risky, which is why many commentators expect Opportunity to lean right.

Those arguments deserve a hearing. But trust is the currency of any coalition, and on that measure the outgoing Prime Minister has started these talks in deficit. Opportunity should keep every door open until 27 November, and walk through the one that leads to a fairer, more honest government.

Sources: NZ Herald, 10 November 2026; Stuff (Isaac Davison), 14 November 2026; The Post (Henry Cooke), via The Democracy Project briefing, 14 November 2026; NZ Herald (Thomas Coughlan), via The Democracy Project briefing, 14 November 2026; 1News, 4 and 10 November 2026; The Spinoff, 10 November 2026; interest.co.nz, 9 November 2026; Associated Press, 8 November 2026; NZ Electoral Commission preliminary results.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-election-one-week-on-what-happens-before-27-november-2026',
    publishedAt: '2026-11-14T15:10:00.000Z',
    category: 'new-zealand',
    title: 'NZ election one week on: where the numbers stand and what happens before 27 November',
    summary: 'A week after polling day New Zealand still has no clear winner. Here is where the seats sit, why special votes matter, and how a government could be formed.',
    body: `A week after New Zealanders voted on 7 November, nobody can yet say who will govern. Christopher Luxon's National-led government stays on as a caretaker while the Electoral Commission counts the last votes. Here is a plain guide to where things stand.

The numbers on election night

On the preliminary count, National has 42 seats, Labour 36, the Greens 16, ACT 13, New Zealand First 12, The Opportunity Party 7 and Te Pāti Māori 5. That makes a Parliament of 131 seats, so 66 are needed to govern.

National, ACT and New Zealand First together have 67, just one more than they need. Labour, the Greens and Te Pāti Māori have 57. Opportunity's seven MPs sit in between.

On the party vote, Labour finished narrowly ahead of National, 29.36 per cent to 29.21 per cent. National still has more seats because it won many electorates, which created 11 overhang seats, an unusually high number.

Why special votes matter

About 399,000 special votes, roughly 14 per cent of the total, are still being checked and counted, according to interest.co.nz. Special votes include ballots from New Zealanders overseas and people who voted outside their home electorate. In past elections they have usually helped the left by one or two seats.

Several electorates are also very close. Wairarapa was separated by only 139 votes on election night and Mt Roskill by 252. A change in either could shift the overall numbers.

The official result is due on Friday 27 November.

Who is talking to whom

National leader Christopher Luxon ruled out working with Opportunity throughout the campaign, but met Opportunity leader Qiulae Wong for an hour on 9 November. Labour leader Chris Hipkins met her the following day. Wong has said Opportunity will talk to National first and turn to Labour if those talks stall, and that its five bottom lines are not negotiable, 1News and the NZ Herald reported.

Luxon has said formal coalition talks will start once the official result is declared, the Herald reported. He maintains National, ACT and New Zealand First can govern on the current numbers. Labour and the Greens are waiting for the final count, and have said they are willing to work with Opportunity.

Three possible outcomes

If the special votes barely change things, National, ACT and New Zealand First keep a narrow majority and can govern on their own, though with almost no room for error.

If the specials take a seat or two from the right, the coalition loses its majority and Opportunity's support becomes essential for either side. Opportunity would then effectively decide who governs.

If no stable government can be formed, the Associated Press notes New Zealand could face a fresh election. Every party leader has said they want to avoid that.

A debate about the system itself

The result has started a wider argument about MMP. A Stuff survey of 533 people, published on 14 November, found only 21 per cent want the system kept exactly as it is, while about a third would like a new system. The Post has estimated that each overhang MP costs taxpayers about $2.1 million over a three-year term. Labour's Chris Hipkins and the Greens' Chlöe Swarbrick have both said they are open to reforms to stop large overhangs in future.

Downunder Voices will keep its NZ Election 2026 Live page updated until a government is formed.

Sources: NZ Electoral Commission preliminary results; interest.co.nz, 9 November 2026; 1News, 4 and 10 November 2026; NZ Herald, 9 and 10 November 2026; Associated Press, 8 November 2026; Stuff, 14 November 2026; The Post, via The Democracy Project briefing, 14 November 2026.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-election-one-week-on-what-happens-before-27-november-2026',
    author: 'Downunder Voices Desk',
  },
  {
    slug: 'victoria-election-two-weeks-out-one-nation-preferences-2026',
    publishedAt: '2026-11-14T15:00:00.000Z',
    category: 'australia',
    title: 'Victoria votes in two weeks: Labor trails as the Coalition and One Nation swap preferences',
    summary: 'Early voting opens on Wednesday 18 November. Polls put Jess Wilson\'s Coalition well ahead, and the biggest question for voters may be how much influence One Nation would have in the next government.',
    body: `Victorians go to the polls on Saturday 28 November to elect all 88 members of the Legislative Assembly and all 40 members of the Legislative Council. Early voting opens this Wednesday, 18 November, and runs until Friday 27 November, from 9am to 6pm every day except Sunday 22 November, according to the Victorian Electoral Commission. Nobody needs a reason to vote early, and on election day voters can use any voting centre in the state.

Where the polls stand

Labor goes into the final fortnight in serious trouble. A Lighthouse tracking poll for News Corp, surveying 1,351 voters and reported on 13 November, put the Liberal-National Coalition on 32 per cent, One Nation on 23 per cent, Labor on 21 per cent and the Greens on 14 per cent. Opposition Leader Jess Wilson had a net favourability of plus 17, compared with minus 19 for Premier Ben Carroll. The same report said Mr Carroll is at risk of losing his own seat of Niddrie in Melbourne's north-west.

Other polls tell a similar story. A DemosAU survey taken from 30 October to 5 November had Labor on just 18 per cent and the Coalition ahead 56 to 44 after preferences.

Mr Carroll replaced Jacinta Allan as premier on 28 July, four months before the election, promising a new direction after 11 years of Labor government. So far there has been no poll bounce. The ABC reported on 1 November that some Labor MPs privately concede they cannot win.

The preference question

The biggest issue in the final fortnight may be preferences. The Coalition and One Nation have agreed to put each other ahead of Labor on how-to-vote cards in key seats, NCA NewsWire reported on 12 November, and AAP reported the Coalition will largely rank One Nation above Labor across the state. Ms Wilson has ruled out a formal deal with One Nation and has said the Coalition will put Labor, the Greens and the Victorian Socialists last.

Labor has gone the other way. Labor's Anthony Carbines told reporters Labor would put One Nation at the bottom of its how-to-vote cards, calling it a principled decision. Labor's campaign has warned that a vote for the Coalition risks a Liberal-One Nation government, a line Prime Minister Anthony Albanese has also used.

Polls suggest the Coalition could win a majority in its own right. But in a close finish, One Nation, led in Victoria by Warren Pickering, could hold real bargaining power in the upper house or in a hung lower house. Voters are entitled to a straight answer from Ms Wilson before 28 November about what role, if any, One Nation would have in a government she leads.

What each side is saying

Mr Carroll argues that only Labor can stop a Liberal-One Nation government, and has offered to debate Ms Wilson only if One Nation's leader is also on stage. Labor has pitched policies at health workers, including tougher action against violent patients.

Coalition supporters argue that 11 years of Labor has left Victoria with high debt, cost blowouts on major projects and rising crime, and that change is overdue. They point out that she has refused a formal deal with One Nation, and say preference decisions are a normal part of campaigning under Victoria's voting system.

Whoever wins, this is shaping up as one of the most fragmented elections in Victoria's history, with four parties all polling well into double figures. With up to 60 per cent of voters expected to vote early, according to the VEC, much of the result may be locked in well before election night.

Sources: Victorian Electoral Commission; Parliament of Victoria; NCA NewsWire / Yahoo News Australia, 12 November 2026; DemosAU poll, 30 October to 5 November 2026; AAP; ABC News, 1 November 2026.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/victoria-election-two-weeks-out-one-nation-preferences-2026',
    author: 'Downunder Voices Desk',
  },
  {
    slug: 'rnz-deficit-staff-should-not-pay-for-governance-failure-2026',
    publishedAt: '2026-11-13T21:40:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: RNZ\'s $11.8m hole was a failure at the top, and staff and listeners should not pay for it',
    summary: 'RNZ lost $11.8 million last year against a forecast loss of $470,000 and now plans to cut 58 jobs. The people who made the programmes did not cause this, and the next government should protect public broadcasting rather than shrink it further.',
    body: `Public broadcasting in New Zealand has taken a hit it did not need. RNZ has reported a loss of $11.8 million for the year to June, against a forecast loss of just $470,000, and says it will cut 58 roles to recover. That is roughly one in six jobs at the country's public radio and digital news service.

This column argues that the people who put RNZ on air every day are being asked to pay for mistakes made well above their heads, at the end of two years in which the outgoing government steadily squeezed RNZ's funding. A Labour-led government, with the Greens and The Opportunity Party, should fix the governance, protect the newsroom and give RNZ stable funding it can plan around.

What went wrong

The numbers come from RNZ's own annual result, reported by 1News on 9 November. RNZ said its internal financial reporting during the year did not accurately reflect its real position, so neither the board nor management took action in time. It said costs were not cut after a 7% drop in its baseline funding. Around $2 million from land sales was wrongly counted as revenue. Staff costs ran $3.2 million over budget, including $1.4 million in redundancy payments. Other operating costs ran $6.4 million over, including about $1.85 million for moving the Auckland office and $1.7 million for remediation work at the Titahi Bay site.

There is more. According to 1News, the auditor EY, acting for the Auditor-General, found RNZ had set up a $5 million overdraft without ministers' approval when it was only authorised to borrow $3.5 million. RNZ says it drew no more than $2.3 million and the facility is now closed. Its cash fell from $18.8 million to $8.5 million over the year, and it is forecasting a further loss of $7.8 million this year.

The chief financial officer resigned and left on 2 October. Board chair Brent Impey has said there is no suggestion of criminality, and David Seymour, one of RNZ's two shareholding ministers, told TVNZ's Breakfast on 10 November that there was currently no suggestion of fraud. That matters, and it should be said clearly. This looks like a failure of financial control and oversight, not of honesty. Mr Impey summed it up himself: "It's a crisis, but it has to be fixed, and we'll do it."

Experts were blunt. Stephen Walker, a former executive director at Audit New Zealand, said the result showed "a real weakness in forecasting and budgeting", The Spinoff reported on 10 November, and Auckland University's Norman Wong called counting land sales as income a basic error. Mr Walker told RNZ a board should be checking results every month.

Who pays

Now look at who is paying. RNZ says the 58 cuts, made up of 18 roles already announced and 40 new ones, will reach right across the organisation, including news, audio, technical and operations staff as well as senior management. Its workforce would fall from 347 to 289 by the end of March. In August RNZ had already said it would cut 25 to 30 roles, about 10% of staff, because of "a further reduction in our funding this year", with more reductions signalled for the next two years, 1News reported on 14 August.

Unionised RNZ staff have announced protests, according to the Council of Trade Unions' daily news roundup on 13 November. They have every reason to. Reporters, producers and technicians did not set the budget, did not sign off the overdraft and did not book land sales as income. Yet most of the pain of fixing the hole will land on them and on the listeners who rely on what they make.

The squeeze came first

It is also worth remembering how RNZ got so little room to absorb a shock. In Budget 2025 the government cut RNZ's funding by $18 million over four years, Metronews reported in June 2025, with part of the money redirected to regional journalism through other channels. Labour's media spokesperson at the time, Reuben Davidson, called it a "giant step back". Stephen Walker made a similar point from a neutral position: "Virtually every public entity has had their annual budget reduced."

None of that excuses poor reporting inside RNZ. A smaller budget makes accurate forecasting more important, not less. But it does explain why one bad year now threatens one in six jobs. An organisation that has been cut year after year has no cushion left, and the first casualties are the reporters who cover the regions, the courts and the councils that commercial outlets have increasingly left behind.

What should happen next

First, the independent review that the RNZ board has promised must be published in full, so the public can see who knew what and when. Accountability should start at the top. That is the standard the public should expect of every public body, and it should apply here.

Second, the job cuts should be paused until the review is finished. Even Mr Seymour has said there may be room to save some of the 58 roles because the budgeting assumptions were wrong. If the shareholding minister believes that, the board should test it before anyone is made redundant.

Third, the next government should give RNZ multi-year funding it can plan around, tied to clear standards for financial reporting. Public media is part of the infrastructure of a democracy, like courts and libraries. It cannot do its job if every Budget brings a fresh cut and every mistake becomes a reason to shrink it again. A Labour-led government that values trusted, independent news should say so in its first Budget.

Fourth, protect what makes RNZ worth having: regional reporting, te reo Māori and Pacific programming, and free, ad-free news for everyone. Those are exactly the things a struggling commercial media market will not replace.

The government's case

The outgoing government's view deserves a fair hearing. Mr Seymour has called RNZ's finances disastrous for taxpayers, audiences and staff, and said that on the reporting ministers received there was no reason to think anything was wrong. He has argued that the board's audit and risk committee was the body that should have caught the problem. "Clearly, the buck stops somewhere," he said. Ministers have also argued that every public entity has had to find savings, and Media Minister Paul Goldsmith said in 2025 that part of RNZ's funding was redirected to regional newsrooms. Those are reasonable points: boards must own their mistakes, and taxpayers are entitled to tight control of public money.

But accountability for a board is not the same as cutting the newsroom. The people in charge should answer for this. The people who report the news should not lose their jobs because of it.

The bottom line

Victoria University media professor Peter Thompson called the shortfall unprecedented, and he is right. An unprecedented failure deserves a careful, honest response, not a rushed round of redundancies. New Zealanders own RNZ. Whoever forms the next government should make sure it comes out of this crisis better run, properly funded and still on air in every corner of the country.

Sources: 1News, 9 November 2026; 1News, 10 November 2026; The Spinoff (Henry Oliver), 10 November 2026; RNZ (Mary Argue) via Otago Daily Times, 9 November 2026; 1News, 14 August 2026; NZCTU Union News, 13 November 2026; Metronews, 3 June 2025.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'bottom-trawling-phase-out-healthy-oceans-2026',
    publishedAt: '2026-11-13T21:30:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Start phasing out bottom trawling now and give our seabed a chance to recover',
    summary: 'The Opportunity Party wants a phase-out of bottom trawling to begin straight away, starting with sensitive areas like the Hauraki Gulf. With so little of our ocean protected, the conservation case is strong, and a careful plan can look after fishing exports and port towns too.',
    body: `New Zealand likes to sell itself to the world as clean and green. Under the water, that promise is harder to keep. Bottom trawling, which drags heavy nets across the seafloor, still brings in most of the fish caught in our waters. After this month's election, the question of whether to phase it out has moved from the margins to the negotiating table.

This column backs a phase-out. The Opportunity Party (TOP) has made it one of its five bottom lines, and Labour leader Chris Hipkins has signalled he is open to it. A Labour-led government, working with the Greens and TOP, should make it happen, carefully and with the industry, but starting now.

What is on the table

TOP set out its bottom lines in September. According to 1News on 29 September, one is that the next government must begin phasing out bottom trawling immediately, working with industry, iwi and coastal communities. Party leader Qiulae Wong argued that bottom trawling cannot be squared with healthy oceans. RNZ reported on 8 October that TOP wants an end to the practice in sensitive areas, including the Hauraki Gulf, first, followed by a progressive phase-out elsewhere.

TOP's own policy page says New Zealand has the fifth-largest ocean territory on earth, yet only about 0.5% of it is protected as marine reserve. It wants 30% protected by 2035, cameras on commercial fishing boats and an ecosystem-based approach to quota. It also points out that three companies control about 60% of fishing quota. Those are party figures, but they frame the choice well: this is a public resource, and the public is entitled to a say in how it is managed.

Why it matters now

The provisional results give National, ACT and NZ First 67 seats, with special votes still to be counted and the final result due on 27 November, 1News reported on 10 November. TOP holds seven seats. Ms Wong met Christopher Luxon on 9 November and Mr Hipkins the following day. Whoever governs may need TOP, so its ocean policy is now part of the deal-making.

At a televised leaders' debate before the election, Mr Hipkins answered yes when asked about phasing in a ban, RNZ reported. Since the election he has said his concern is mainly about method. "It all comes down to a question of how," he told The Spinoff on 10 November. That is the right question, and it has good answers: start with the most fragile places, set a clear timetable, fund new gear and training, and back the workers and port towns that depend on fishing.

The other side

The industry's concerns are real and should be stated plainly. Moana New Zealand chief executive Steve Tarrant told RNZ that about 70% of the volume caught in New Zealand comes from bottom trawling, and called a blanket ban irresponsible. Sealord chief executive Doug Paulin described the policy as populist and said no other technique can catch those species economically. Mr Luxon said he was "open to" a phase-in, but stressed the need to balance it against the two billion dollars and 9000 jobs he linked to the practice. Even Greenpeace, RNZ reported, favours a phased, targeted ban on the most damaged areas rather than an immediate nationwide one.

Those points argue for doing this well, not for doing nothing. A phase-out with a timetable gives companies time to change boats and methods. Starting with sensitive places like the Hauraki Gulf protects the areas that matter most while the rest of the plan is worked out.

The bottom line

A seabed scraped bare does not grow back in an election cycle. Protecting it is a long-term investment in fish stocks, in the communities that catch them and in the reputation that sells New Zealand seafood overseas. Labour, the Greens and TOP should agree on a sensible, staged plan and get on with it.

Sources: 1News, 29 September 2026; RNZ (Felix Walton) via Otago Daily Times, 8 October 2026; The Opportunity Party, Healthy Oceans policy (accessed 14 November 2026); 1News, 10 November 2026; The Spinoff (Lyric Waiwiri-Smith), 10 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/bottom-trawling-phase-out-healthy-oceans-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-essential-workers-priced-out-of-rentals-2026',
    publishedAt: '2026-11-13T21:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: When nurses and cleaners cannot afford to rent, Australia needs far more social housing',
    summary: 'Anglicare\'s latest snapshot found fewer than 1% of rental listings were affordable for cleaners, retail workers and social workers on the full-time minimum wage. The people who keep the country running deserve a secure home, and that means building much more social and affordable housing.',
    body: `Ask almost any Australian town what it needs and the answer is the same: more nurses, more carers, more teachers, more people to clean, cook and serve. Then ask where those workers are supposed to live. A new report suggests that, for many of them, there is no realistic answer.

This column argues that the rental crisis has become a crisis for essential work itself, and that the answer is a much larger, faster build of social and affordable housing, along with a fairer deal for renters.

What the snapshot found

Anglicare Australia's annual Rental Affordability Snapshot looked at 48,776 rental listings across the country and tested them against the full-time minimum wage for 16 essential jobs, the ABC reported on 5 November. Only three of those 16 occupations saw affordability improve on last year. For retail workers, social workers and cleaners, fewer than 1% of listings were affordable. For nursing it was 1.1%, and for teaching 3.3%. In the Northern Territory, the report found no affordable rental at all for a hospitality worker.

The ABC also cited Cotality data showing unit rents up 44.3% over five years and house rents up 36.6%. Anglicare executive director Kasy Chambers said wages had risen by less than half as much, so most of the pay rises have gone straight into rent.

Behind the numbers are people. The ABC reported on 7 November on a 61-year-old disability support worker in Albany, Western Australia, who has moved seven times in 18 months and now splits a rent of $850 a week with a housemate. Anglicare found just one property across WA's Great Southern and South West regions that was within budget for key health and childcare workers. In Karratha, a local mechanic told the ABC that a lack of housing was stopping him from taking on more staff.

The pressure is not easing. A property industry daily brief on 13 November, summarising REA Group research, reported that rent increases have been the steepest since the 1980s, even as home values have slipped from their March peak.

Why this is everyone's problem

When a nurse cannot find a rental near the hospital, the hospital runs short. When a childcare worker cannot afford to live in a regional town, families there lose childcare and parents lose work hours. Housing is not just a private worry for renters; it decides whether communities can keep the services they depend on.

Ms Chambers put the cause plainly: successive governments stopped building and funding housing. The result, as housing advocates have long argued, is a system that rewards owning several properties while leaving the people who staff our hospitals and aged care homes moving from lease to lease.

What should change

First, build social and affordable housing at a scale that matches the problem, with a clear share set aside for essential workers near where they work, especially in the regions. Second, give renters more security, including limits on unfair rent rises and no-grounds evictions, so a worker does not have to move seven times in 18 months. Third, keep reviewing tax settings that tilt the market towards investors rather than people looking for a home to live in. The first of these is exactly what Anglicare is calling for.

The government's case

The federal government says it is acting. A spokesperson for Housing Minister Clare O'Neil told the ABC: "We're building 55,000 social and affordable homes, with more than 8,000 already complete." The minister's office also pointed to below-market rentals for essential workers. That is a real commitment, and it deserves credit.

But Anglicare's snapshot shows how far there is still to go. When fewer than one listing in a hundred is affordable for a cleaner on the minimum wage, the current pace is not enough. Australia's essential workers have kept the country going through fires, floods and a pandemic. The least we owe them is somewhere affordable to live.

Sources: ABC News (Emma Johnson and Amy Rossbach), 5 November 2026; ABC News (Rachel Jennings, Andrew Chounding and Amy Rossbach), 7 November 2026; Property Buzz daily brief, 13 November 2026, summarising REA Group.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-essential-workers-priced-out-of-rentals-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'kaitaia-triboard-mill-northland-jobs-plan-2026',
    publishedAt: '2026-11-12T21:40:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Kaitāia is losing its last mill, and Northland deserves a real plan for its jobs',
    summary: 'Juken says its Triboard Mill will stop operating by mid-March 2027, putting up to 157 jobs at risk in a town that lost its other mill in August. A Labour-led approach would treat wood processing in the Far North as worth fighting for.',
    body: `Kaitāia has been here before, and that is the problem. In August the town lost the Juken Northland Mill. This week the same company told the workers at its second Kaitāia site, the Triboard Mill, that it will stop operating no later than mid-March 2027. For a small Far North town, that is the difference between young families staying or leaving.

This column argues that what happens next should not be left to chance, a buyer's timetable or a caretaker period in Wellington. Northland needs an active plan for wood processing jobs, and the parties best placed to deliver one are Labour, the Greens and The Opportunity Party.

What Juken has announced

The facts are set out in Juken's own statement, reported by 1News on 11 November. Juken New Zealand has put two proposals to staff. Under the first, it would sell the mill's land, buildings and other assets to a prospective buyer. Under the second, if that sale falls through, it would close the mill and keep trying to sell the site. Either way, the company says it will stop running the mill by mid-March 2027, or earlier. Chief executive Yasufumi Tsuchiya was clear that "No binding sale agreement has been reached." Consultation with staff closes on 25 November.

The prospective buyer has said it intends to restart the mill under new ownership. That is welcome, but it is not a guarantee. Wood Central, a timber industry news site, reported on 12 November that the possible sale covers the land, buildings and machinery but not the staff, and that 157 jobs are at risk either way. Workers First Union organiser Marcus Coverdale told the site the union had hoped the offer would include the workforce, and warned that a gap before re-hiring had left a reopened Gisborne mill short of experienced people.

The same report noted that Juken booked a $39.7 million loss for the year to March. B2B News reported on 11 November that, when the Northland Mill closed, 78 workers were affected; 44 left and 19 were redeployed to Triboard.

A pattern, not a one-off

Kaitāia is not an isolated case. Workers First counts the two Juken mills as the seventh and eighth wood processing closures in New Zealand in two years, Wood Central reported. In a June statement the union put the losses at more than 800 wood processing jobs since late 2023. Those are union figures and should be read as such, but nobody seriously disputes the direction. In February 2025 the Greens' regional development spokesperson Scott Willis said job losses at the Kinleith mill in Tokoroa "could have easily been avoided", and called for a Future Workforce Agency to help regions plan ahead.

This is the core of the case. New Zealand grows enormous amounts of timber. Wood Central reported that Northland MP Grant McCallum pointed to about 50,000 hectares of forestry north of Kaitāia alone. Yet more and more of that wood leaves the country as logs, while the mills that add value at home shut their doors.

What was asked for, and what was refused

The most frustrating part of the Kaitāia story is that local leaders tried to get ahead of it. When Juken first moved to close the Northland Mill, local bodies did not simply accept the decision. BioEnergy Times reported on 15 July that the Northland Regional Council, the Far North District Council and the regional development agency Northland NZ sought government funding to modernise the mill and add a plant turning waste and low-grade wood into biomass fuel. Regional council chair Pita Tipene told Wood Central in July: "That model would require investment by the Government."

That investment did not come. BioEnergy Times reported that David Seymour, then acting prime minister, rejected the calls. B2B News reported that in June Prime Minister Christopher Luxon rejected the union's request for intervention, and that Northland NZ's head of investment, Tui Rutherford, had argued "investing right now will generate a good return." The mill closed in August.

Now, with Triboard on the line, the timing could hardly be worse. The general election was held on 7 November, the final count is not due until later this month, and the outgoing government is in caretaker mode. Northland MP Grant McCallum was candid about it, telling Wood Central "we're between governments now, so that will hold things up for a bit." He said he was still working with potential buyers and government colleagues, and that effort deserves credit. But workers facing redundancy cannot wait for coalition talks to finish.

What a Labour-led approach would do differently

Labour's 2026 manifesto promises to "Continue to grow wood processing in New Zealand", to back businesses that make better use of the whole tree, and to develop local transition plans with working people when industries change. Those are the right instincts. Transition planning means a region gets warning, training and new investment before the last shift ends, rather than a redundancy notice and a pamphlet about benefits.

The Greens bring the long-term view: that wood processing, low-carbon building materials and biomass are part of how New Zealand meets its climate goals while keeping jobs in the regions. TOP brings a focus on evidence-based economic policy and on fixing the incentives that make exporting raw logs more attractive than processing them here.

Concretely, the next government should do three things. First, work with any credible buyer of Triboard to keep the experienced workforce together, including with wage support during a restart if that is what it takes. Second, take a fresh look at the biomass and modernisation proposal that Northland's councils put forward, judged on its merits rather than dismissed. Third, set up the kind of regional workforce planning that Labour and the Greens have both proposed, so Kaitāia is the last town to learn about its future from a consultation document.

The government's case

The outgoing government's position deserves a fair hearing. B2B News reported that Resources Minister Shane Jones said Juken never formally approached the government for help, and ministers have argued that taxpayers should not prop up private businesses that their owners have decided are not viable. The union reported in June that the Prime Minister pointed to Ministry of Social Development support for affected families. National went into the election promising to double value-added timber exports by 2034, according to Wood Central, so the goal of more processing is shared across the House. Governments cannot save every business, and that is a fair point.

But a target for 2034 does little for the 157 people at Triboard in March 2027. When a private owner has already decided to leave and local leaders bring a plan with a return attached, saying no is also a choice, and in Kaitāia it has had consequences.

The bottom line

Acting Far North mayor Chicky Rudkin said in June that "news like this will hit hard". It has hit twice now. The people of Kaitāia have done everything asked of them: they turned up to work, they moved mills when they were told to, and their local leaders brought forward a plan. Whoever forms the next government should treat the Triboard decision as a test of whether regional New Zealand still counts. A Labour-led government, working with the Greens and TOP, would have the policies to pass it.

Sources: 1News, 11 November 2026; Wood Central, 12 November 2026; B2B News, 11 November 2026; BioEnergy Times, 15 July 2026; Wood Central, 21 July 2026; 1News (Emma Hildesley), 24 June 2026; Workers First Union statement via Scoop, 27 June 2026; New Zealand Labour Party 2026 manifesto; Green Party of Aotearoa New Zealand, 14 February 2025.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/kaitaia-triboard-mill-northland-jobs-plan-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'warehouse-strike-ai-robots-staff-deserve-a-say-2026',
    publishedAt: '2026-11-12T21:30:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: The Warehouse strike shows why staff need a say before the robots arrive',
    summary: 'More than 300 distribution-centre staff at The Warehouse walked off for 24 hours over AI and automation. The company rejects the union\'s claims, but the dispute shows New Zealand needs clear rules giving staff a voice when new technology changes their work.',
    body: `On Thursday more than 300 people who keep The Warehouse's shelves stocked put down their scanners for a day. Staff at the company's distribution centres in Wiri, Auckland, and Rolleston, near Christchurch, along with Noel Leeming installation drivers, held a 24-hour strike on 12 November, 1News reported. Their main worry was not pay. It was whether robots and artificial intelligence will leave them without a job.

This column argues they have a point, and that it goes well beyond one company. New Zealand needs rules that give working people a real say before new technology reshapes their jobs. That is the approach Labour, the Greens and The Opportunity Party should push for in the next Parliament.

What the union says

In a statement released through Scoop on 11 November, Workers First Union said a large robot is being installed in Auckland for stock picking, that drones have already shrunk the physical inventory team, and that performance monitoring is tracking how long staff spend on bathroom breaks. Organiser Hayley Courtney said staff with long service simply wanted certainty: "They want to know they have a future here."

The union is asking for consultation, retraining and redeployment for anyone affected, and for agreement with the union before any job-cutting technology is introduced. It also says some Noel Leeming drivers are being rostered extra overtime runs without being asked.

What the company says

The Warehouse Group strongly disputes much of this. RNZ reported on 11 November that the group's people officer, Richard Parker, said bathroom use is not tracked, that monitoring is of efficiency through scanning devices and is not AI, and that the stocktake drones have caused no job losses; in fact, he said, three extra temporary roles were created. On the union's more lurid claims about conditions in the distribution centres, Parker said: "This has never happened."

Those are serious denials and readers should weigh them. Neither side has published figures on how many roles the new robot could affect, so nobody outside the company can yet say how big the change will be.

Why this matters beyond The Warehouse

That uncertainty is exactly the problem. RNZ noted that unemployment is at an 11-year high. In that climate, a worker with 15 or 20 years at a distribution centre who sees a robot being installed is not being unreasonable when they ask what it means for them. At the moment, New Zealand law gives them few guarantees beyond a general duty of good faith and whatever their collective agreement says.

The union's request is modest. Courtney told RNZ the union is not trying to stop the robot or AI. Workers are asking to be told early, to be retrained where possible, and to be moved into other roles rather than shown the door. Many good employers already do this. A clear legal floor would make sure all of them do.

What the left offers

Labour's 2026 manifesto commits to working with working people, employers and unions to prepare for how AI will change jobs and skills, and to safeguards where AI is used to make decisions about individuals. Waatea News reported in September that Labour wants productivity gains from AI to be reflected in wages and conditions. Commentary in LawNews in October described the Greens' AI plan as giving people rights to challenge AI-assisted decisions. TOP's evidence-first approach to policy would sit well alongside both.

The other side

Supporters of faster automation argue that New Zealand's productivity has lagged for decades, and that firms must be free to invest in automation to compete and keep prices down for shoppers. The Warehouse says its technology is about efficiency, not surveillance, and has created some roles. Those are fair points: automation can make work safer and businesses stronger.

But productivity gains that are shared with the people doing the work are more durable than gains that come at their expense. A short strike in Wiri and Rolleston is an early warning. The next government should listen to it.

Sources: 1News, 12 November 2026; Workers First Union statement via Scoop, 11 November 2026; RNZ (Sammy Carter), 11 November 2026, as published by the Otago Daily Times; New Zealand Labour Party 2026 manifesto; Waatea News, 11 September 2026; LawNews (Kalev Crossland), 21 October 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/warehouse-strike-ai-robots-staff-deserve-a-say-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'dairy-welfare-code-winter-grazing-shelter-2026',
    publishedAt: '2026-11-12T21:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: The new dairy welfare code dropped winter grazing and shelter rules, and they should be put back',
    summary: 'The dairy cattle code issued in September left out proposed standards on intensive winter grazing and shelter after a contested process. The best farmers already do better, and the rules should reflect that.',
    body: `New Zealand sells its dairy products to the world on a promise: grass-fed cows, open pastures and high standards. A new code of welfare for dairy cattle was supposed to back that promise with clear minimum rules. On some important issues it does. On others, the protections that were consulted on simply disappeared. This column argues that the next government, ideally one led by Labour with the Greens and The Opportunity Party, should finish the job.

What the code does

The government announced the new code on 23 September. Acting Agriculture Minister Nicola Grigg said calves must be fed milk or milk replacer at least twice a day for their first two weeks, the minimum body condition score for milking cows will rise, thin cows will need a vet's approval before leaving the farm, and regulations to ban the tethering of dairy cattle will be developed. The code takes effect on 19 April 2027. Those are real improvements and deserve credit.

What was left out

RNZ reported on 30 September that several standards consulted on since 2022 were dropped from the final code. They included rules on intensive winter grazing, standards for transporting cull cows, and a requirement for farms to have a working relationship with a vet. National Animal Welfare Advisory Committee chair Matthew Stone said shade, shelter, calf rearing and pasture management during intensive winter grazing were among the most contested issues.

Winter grazing is the issue many New Zealanders will remember from images of cows standing in deep mud. Shelter and dry ground at calving remain only recommended best practice. SAFE chief executive Debra Ashton put the problem simply, telling RNZ: "how can you enforce good animal welfare when these are just recommendations?"

A process under a cloud

How the code was made matters too. B2B News reported on 12 November that associate agriculture minister Andrew Hoggard, a former Federated Farmers president, sent the draft back to the advisory committee in 2024 with a letter asking for "elevated consideration of economics and practicality". Hoggard was later seen to have a conflict of interest, and Grigg signed off the final code. Newsroom has since reported legal concerns: Animal Law Association president Marcelo Rodriguez Ferrere described the dairy and pig codes as "extremely vulnerable" to court challenge, according to the Democracy Project's summary of that report.

These are legal opinions, not court findings. But a code that may not survive a challenge gives farmers no certainty either.

What should happen next

Labour, the Greens and TOP should commit to revisiting the dropped standards through a clean, transparent process. That means restoring minimum rules on intensive winter grazing and shelter, consulting properly, and making sure no decision-maker has an industry conflict. It would protect animals, and it would protect the reputation that every dairy exporter relies on.

The other side

The outgoing government and farming groups argue the code is practical and workable. Grigg said "it's vital we maintain the confidence of New Zealanders and our overseas markets", and said the industry regards a higher body condition score as good practice. DairyNZ described it as the first major update in more than a decade, and Federated Farmers welcomed the changes, RNZ reported. The advisory committee chair said some proposals were scaled back because they did not meet the legal criteria in the Animal Welfare Act. Many farmers already invest heavily in good welfare and worry about costs piling up in a tough season.

Those concerns are real. But good farmers are already meeting higher standards on shelter and winter grazing. Writing those standards into the rules would reward them and bring everyone up to their level.

Sources: New Zealand Government press release (Hon Nicola Grigg) via Scoop, 23 September 2026; RNZ (Monique Steele), 30 September 2026, as published by the Otago Daily Times and Farmers Weekly; B2B News, 12 November 2026; The Democracy Project (Bryce Edwards), News Briefing, 12 November 2026, summarising Newsroom.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/dairy-welfare-code-winter-grazing-shelter-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-special-votes-case-for-progressive-government-2026',
    publishedAt: '2026-11-11T21:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Every special vote counts, and the case for a Labour-led government has never been stronger',
    summary: 'The preliminary count gives the National-led coalition a one-seat majority, with about 14 per cent of votes still to be counted. A government built around Labour, the Greens and The Opportunity Party would answer the questions voters actually asked.',
    body: `New Zealand is waiting. Five days after polling day, nobody can say for certain who will govern the country, and that uncertainty is itself a verdict. A government that had delivered on its promises would not be clinging to a one-seat margin. This column argues that when the final count lands, the better result for working New Zealanders is a government led by Labour, with the Greens and The Opportunity Party (TOP) at the table.

Where the count stands

The facts first. According to Al Jazeera's report of the Electoral Commission's preliminary results, published on 7 November, the National-led coalition of National, ACT and New Zealand First holds 67 of a projected 131 seats. That is one more than the 66 needed to govern. National and Labour each won just under 30 per cent of the party vote.

That majority is not final. About 14 per cent of all votes are special votes, still to be counted. These include ballots cast overseas and votes cast outside a voter's home electorate. Al Jazeera notes that special votes have historically favoured the left. The final result is due on 27 November, and until then the coalition stays on as a caretaker government.

The Electoral Commission also said TOP will clear the 5 per cent threshold and enter Parliament. If the coalition loses even one seat on the specials, the arithmetic changes completely, and TOP could become the party that decides who governs.

Christopher Luxon summed it up on election night: "But right now, it is too close to call." Chris Hipkins did not claim victory either, telling supporters: "New Zealand has spoken." He added that it may take a little longer to understand exactly what voters said.

A vote about the cost of living

Whatever the final seat count, the message from voters is hard to miss. In an analysis for the ABC on 10 November, chief business correspondent Ian Verrender argued that soaring prices pushed voters to shake up the status quo in New Zealand, as they did in the United States midterms. He noted that several high-ranking ministers lost their places.

The numbers behind that anger are stark. Stats NZ figures reported by RNZ and the Otago Daily Times on 3 November show unemployment at 5.7 per cent in the September quarter, the highest in 11 years, with 174,000 people out of work. Take-home pay rose 3.3 per cent over the year while inflation ran at 3.7 per cent. In plain terms, many workers went backwards.

Verrender also pointed out that about 120,000 New Zealanders moved to Australia in the three years to mid-2026. When young workers and families leave in those numbers, it is not a sign that the government's growth plan is working.

National was elected three years ago promising to tame inflation and get the economy moving. Inflation is still well above the Reserve Bank's target, growth remains weak, and the dole queue is longer. After three years in charge, the government owns these results.

Why Labour should lead

Labour went into this campaign promising cheaper healthcare and cheaper transport, Al Jazeera reported. Those are not abstract ideas. They are the bills that come out of household budgets every week: the GP visit that gets put off, the bus fare or petrol that eats into a wage that is not keeping up.

Labour's record on wages, the minimum wage and public health investment gives it the credibility to lead a government focused on the household squeeze. It is also the only party with the size and depth to hold a centre-left government together through a full term.

What the Greens bring

The Greens have spent years making the case that climate action and fair incomes belong together. They have long argued that a fairer tax system, where the wealthiest pay a reasonable share, can fund better income support and public services. In a Parliament where the cost of living dominated the campaign, that argument deserves a seat at the cabinet table, not just the cross benches.

A government that includes the Greens would also bring stronger voices on housing quality, public transport and the health of rivers and coastlines. Those are long-term investments that every New Zealander benefits from.

Why TOP matters

The Opportunity Party's arrival in Parliament is good news for anyone who wants evidence-based policy. TOP has long pushed for a tax system that leans less on wages and more on land and unearned property gains. Whatever one thinks of the detail, that is a serious answer to the housing affordability problem that has priced a generation out of home ownership.

Luxon has repeatedly ruled out working with TOP, Al Jazeera reported, although National campaign chair Simeon Brown told TVNZ he was not ruling out talks. That shift matters. If National is already rethinking its red lines, TOP has every reason to test which partner would give its ideas a real hearing. A Labour-led arrangement is the more natural fit.

The government's case

To be fair to the other side: National is once again the largest party, and on the preliminary count its coalition has a majority. Brown told TVNZ the party was in a strong position and confident of forming a government with its partners. National campaigned on returning the budget to surplus through spending discipline while expanding the national pension scheme, and its supporters argue that steady fiscal management is what an economy coming out of recession needs. ACT and New Zealand First also won seats and have a legitimate claim to be part of any coalition the numbers allow.

Patience, then a change

Former minister Peter Dunne, who served under both National and Labour, told Al Jazeera: "We could face weeks of interparty negotiations to form a government." He noted that Parliament has to sit by early January, raising the prospect of going into Christmas without a clear government.

That is uncomfortable, but it is how MMP is meant to work. Every special vote must be counted, every party must be heard, and the government that emerges should reflect the full result, not the election-night snapshot.

If the specials shift even one seat, Labour, the Greens and TOP should be ready with a clear, costed plan for the first hundred days: lower health costs, help with transport, a serious jobs plan for the regions with the highest unemployment, and a fair way to pay for it. New Zealanders voted for change on prices and jobs. They deserve a government that will deliver it.

Sources: Al Jazeera, 7 November 2026; ABC News (Ian Verrender analysis), 10 November 2026; Otago Daily Times / RNZ, 3 November 2026; interest.co.nz, 4 November 2026.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-unemployment-11-year-high-workers-left-behind-2026',
    publishedAt: '2026-11-11T21:10:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: 174,000 people out of work is a choice, and the next government must make a different one',
    summary: 'Unemployment has reached 5.7 per cent, its highest level in 11 years, and wages are falling behind prices. A jobs-first plan from Labour, the Greens and TOP would put workers ahead of austerity.',
    body: `The last labour market figures before the election were the worst in more than a decade. They should shape every conversation in the coalition talks now under way.

What the figures show

Stats NZ data, reported by RNZ and the Otago Daily Times on 3 November and by interest.co.nz on 4 November, put the unemployment rate at 5.7 per cent in the September quarter, up from 5.6 per cent. According to interest.co.nz, the last time it was that high was in 2015. The number of people out of work rose to 174,000, which is 14,000 more than a year earlier.

Behind the headline figure the picture is worse. Long-term unemployment, meaning people out of work for more than a year, now makes up about 21.5 per cent of the total, the highest share since 1994, the ODT reported. The underutilisation rate, which counts people who want more work as well as the jobless, was 13.8 per cent, covering about 438,000 people, according to interest.co.nz. The share of young people aged 15 to 24 not in work, education or training rose to 14.1 per cent.

The pain is not shared evenly. Northland's unemployment rate was 8.3 per cent, and Auckland, Waikato and Manawatū-Whanganui were all above 6 per cent, the ODT reported. Underutilisation among Māori was 22.3 per cent and among Pacific peoples 21.2 per cent, according to interest.co.nz.

The jobs that are being created are less secure. Stats NZ's Abby Johnston said: "Casual and fixed term roles increased over the year." interest.co.nz reported that casual employees rose by almost a fifth over the year, while full-time employment fell over the quarter.

Wages going backwards

Meanwhile, pay is not keeping up. Broad wage growth slowed to 2.1 per cent, near a five-year low, and take-home pay rose 3.3 per cent against inflation of 3.7 per cent, the ODT reported. For many households, that means another year of working just as hard for less.

Renters are being squeezed from the other side. Trade Me figures reported by B2B News on 11 November show the national median rent up 2.5 per cent to $625 a week, with Auckland at $660. The same report notes that full interest deductibility for landlords returned in April 2026, a tax break that went to property investors while people looking for work were left to cope with rising rents.

A different choice

None of this was inevitable. A government that put spending restraint first and restored a tax break for landlords made choices that put pressure on the people with the least room to absorb it.

Labour, the Greens and The Opportunity Party offer a different direction. Labour campaigned on making healthcare and transport cheaper, which would ease the cost of getting to work and staying well enough to work. The Greens have long championed public investment in warm homes, public transport and clean energy, all of which create jobs in the regions that need them most. TOP has argued for a tax system that rewards work over property speculation. Together, they could build a jobs plan that targets Northland, the regions and young people first.

That plan should include keeping apprenticeships and trades training funded, bringing forward shovel-ready infrastructure and housing, and making sure the welfare system helps people back into decent work rather than simply pushing them off the books.

The government's case

The government and its supporters argue that the job market is a lagging cost of bringing inflation down. The ODT reported that the Reserve Bank has said subdued wage growth is needed to reduce inflation pressures, and there are still 19,000 more people in work than a year ago. National has campaigned on spending discipline and a return to surplus, arguing that stable public finances will support growth over time.

But ordinary families cannot pay the rent with a promise about the long run. With unemployment at an 11-year high, the next government's first test is simple: does it put workers first? Labour, the Greens and TOP are ready to say yes.

Sources: Otago Daily Times / RNZ, 3 November 2026; interest.co.nz, 4 November 2026; OneRoof, 9 November 2026; B2B News, 11 November 2026.

Photo: Auckland Town Hall, by ChewyPineapple via Wikimedia Commons (CC BY-SA 3.0 NZ).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aucklandtownhall.jpg?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-record-home-loan-slump-first-buyers-renters-2026',
    publishedAt: '2026-11-11T21:00:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: A record slump in investor lending is a chance to put first home buyers and renters first',
    summary: 'New home lending has suffered its biggest quarterly fall on record, led by investors. Australia should use this moment to tilt the housing market back towards people who want a home to live in.',
    body: `Australia's housing market has just recorded something it has never seen before. According to Australian Bureau of Statistics figures reported by the ABC on 11 November, the value of new home loan commitments fell 15.5 per cent in the September quarter. That is the largest quarterly fall since the series began in 2002, deeper than the falls during the global financial crisis and the start of the pandemic.

The detail matters. Investor lending fell a record 32.3 per cent over the quarter, while owner-occupier lending fell 5.3 per cent and first home buyer lending fell 8 per cent, the ABC reported. In other words, investors pulled back far harder than families buying a place to live.

Why investors are retreating

Higher interest rates are part of the story. The Reserve Bank has lifted the cash rate five times this year, the ABC reported. But tax changes in the federal budget also appear to be playing a role. J.P. Morgan economist Tom Ryan told the ABC that "investor lending has declined much more sharply" than owner-occupier lending, and said the budget tax changes had likely made the fall worse. The ABS's Mish Tan said investor activity was being influenced by more than borrowing costs.

For years, tax settings tilted the field towards people buying their second, third or tenth property. If that tilt is now being corrected, it is a reform worth defending, not reversing at the first sign of a softer market.

The squeeze on families is real

None of this means ordinary buyers are having an easy time. Canstar estimates that a person on the average full-time wage of $108,650 has lost more than $58,000 in borrowing power after the latest rate rise, and a couple on average wages close to $117,000, the ABC reported. Cotality data shows national house prices have fallen for seven months in a row.

Outside the property market, the cost of living keeps biting. An ABC Story Lab feature on 9 November followed seven households through their weekly shop and found families cutting back on fresh food, meat and treats. Foodbank reported that 100,000 more households experienced food insecurity in the past year, with high living costs the top reason given.

What a fair housing policy looks like

Falling investor demand creates an opening. With fewer investors competing at auctions, first home buyers have a better chance of getting a foot in the door, as long as they can still borrow. Governments should use this moment to back them: more social and affordable housing, shared-equity schemes that lower the deposit barrier, and strong support for people building homes rather than speculating on them.

Renters must not be forgotten. If some investors sell, the homes do not disappear; many will be bought by owner-occupiers who were renting before. But states and the Commonwealth should make sure renters have fair protections on rent rises and evictions while the market adjusts.

PRD chief economist Diaswati Mardiasmo noted that units are typically 25 to 35 per cent cheaper than houses, and told the ABC: "Less debt means a smaller mortgage and more manageable repayments." Better planning rules that allow more good-quality units and townhouses near transport would give more families that choice.

The other side

Those who favour higher rates argue that they are needed because inflation is still too high, and the RBA has said inflation is not yet under control, the ABC reported. Some economists warn of a sharper fall: AMP's Shane Oliver told the ABC that "houses overall are far more vulnerable to a fall in prices" because they look more overvalued than units.

Those concerns deserve a hearing. But a housing market that works for people who want a home to live in, rather than for those treating homes as a tax-advantaged investment, is a goal worth holding on to through a tough patch.

Sources: ABC News business live blog, 11 November 2026; ABC News (Hanan Dervisevic), 11 November 2026; ABC News Story Lab, 9 November 2026.

Image: Downunder Voices editorial illustration.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-record-home-loan-slump-first-buyers-renters-2026?v=2',
    author: 'Downunder Voices Opinion',
  },
]
