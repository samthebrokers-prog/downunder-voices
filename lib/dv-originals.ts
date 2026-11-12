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
