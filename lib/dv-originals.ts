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
  category: 'editorial-view' | 'australia' | 'new-zealand' | 'world' | 'social-issues' | 'small-business' | 'trade-logistics' | 'community' // 'editorial-view' shows as Opinion
  title: string
  summary: string // 1–2 sentence standfirst
  body: string // full article, ends with "Sources: …" and "Photo: … via Wikimedia Commons (licence)."
  imageUrl: string // https://commons.wikimedia.org/wiki/Special:FilePath/<File>?width=1280
  author: string // e.g. 'Downunder Voices Desk'
}

export const DV_ORIGINALS: DvOriginal[] = [
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
